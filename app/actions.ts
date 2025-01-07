"use server";

import { invalidateSession } from "@/lib/auth";
import { db } from "@/lib/drizzle";
import { sessionTable, userTable } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function logout(sessionId: string | null): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("session_token");
  await invalidateSession(sessionId ?? '');
  return revalidatePath("/");

}

export async function deleteAccount(sessionId: string | null): Promise<string | void> {
  const result = await db.select().from(sessionTable).where(eq(sessionTable.id, sessionId ?? ''));
  if (result.length < 1) {
    return "Something went wrong. Please try again later.";
  }
  const session = result[0];
  await db.delete(userTable).where(eq(userTable.id, session.userId));
  const cookieStore = await cookies();
  cookieStore.delete("session_token");
  return revalidatePath("/");


}
