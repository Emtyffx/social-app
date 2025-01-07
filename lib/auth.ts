import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from '@oslojs/encoding';
import { type User, type Session, sessionTable, userTable } from './schema';
import { sha256 } from '@oslojs/crypto/sha2';
import { db } from './drizzle';
import { eq } from 'drizzle-orm';

/**
 * Generate a random token for the given user.
 * @param userId - The id of the user to generate the token for.
 * @returns Generated token
 */
export function generateSessionToken(): string {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  const token = encodeBase32LowerCaseNoPadding(bytes);
  return token;
}

/**
 * Create a new session for the given user.
 * @param token - The token to create session with.
 * @param userId - The id of the user for whor to create the session.
 * @returns Created session
 */
export async function createSession(
  token: string,
  userId: number
): Promise<Session> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const session: Session = {
    id: sessionId,
    userId,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 1 month
  };
  await db.insert(sessionTable).values(session);
  return session;
}

/** Validate the given token and return the corresponding session and user.
 * @param token - The token to validate.
 * @returns Returns Session and User when the token is valid. Otherwise returns null for user and session.
 */
export async function validateSessionToken(
  token: string
): Promise<SessionValidationResult> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const result = await db
    .select({ user: userTable, session: sessionTable })
    .from(sessionTable)
    .innerJoin(userTable, eq(sessionTable.userId, userTable.id))
    .where(eq(sessionTable.id, sessionId));
  if (result.length < 1) {
    return { session: null, user: null };
  }
  const { user, session } = result[0];
  if (session.expiresAt.getTime() <= Date.now()) {
    await db.delete(sessionTable).where(eq(sessionTable.id, sessionId));
    return { session: null, user: null };
  }
  if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
    session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30); // add 30 days
    await db
      .update(sessionTable)
      .set({ expiresAt: session.expiresAt })
      .where(eq(sessionTable.id, sessionId));
  }

  return {
    session,
    user,
  };
}

/**
 *
 * @param sessionId the id of the session to validate
 * @returns void
 */
export async function invalidateSession(sessionId: string): Promise<void> {
  await db.delete(sessionTable).where(eq(sessionTable.id, sessionId));
}

export const userSecurityFilter = ({ name, email }: User): Omit<Omit<User, "id">, "passwordHash"> => ({ name, email})

export type SessionValidationResult =
  | { session: null; user: null }
  | { session: Session; user: User };

