"use server";

import { createSession, generateSessionToken } from "@/lib/auth";
import { db } from "@/lib/drizzle";
import { userTable } from "@/lib/schema";
import { signUpParams, signUpSchema } from "@/lib/validation";
import { encodeHexLowerCase } from "@oslojs/encoding";
import { eq, or } from "drizzle-orm";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function signUp(values: signUpParams): Promise<string | never> {
  try {
    const validationResult = signUpSchema.safeParse(values);
    if (!validationResult.success) {
      return "Something went wrong. Please try again later.";
    }
    const formData = validationResult.data;
    const result = await db
      .select()
      .from(userTable)
      .where(
        or(
          eq(userTable.name, formData.name),
          eq(userTable.email, formData.email),
        ),
      );
    if (result.length > 0) {
      return "User with this name or email already exists";
    }
    const newUser = {
      name: formData.name,
      email: formData.email,
      passwordHash: encodeHexLowerCase(
        new TextEncoder().encode(formData.password),
      ),
    };
    const userCreationResult = await db
      .insert(userTable)
      .values(newUser)
      .returning();
    if (userCreationResult.length < 1) {
      return "Something went wrong. Please try again later.";
    }
    const createdUser = userCreationResult[0];

    const newSessionToken = generateSessionToken();
    await createSession(newSessionToken, createdUser.id);
    const cookieStore = await cookies();
    cookieStore.set("session_token", newSessionToken);
    return redirect("/");
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    } else {
      return "Something went wrong. Please try again later";
    }
  }
}
