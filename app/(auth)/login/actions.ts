"use server";

import { createSession, generateSessionToken } from "@/lib/auth";
import { db } from "@/lib/drizzle";
import { userTable } from "@/lib/schema";
import { loginParams, loginSchema } from "@/lib/validation";
import { sha256 } from "@oslojs/crypto/sha2";
import { encodeHexLowerCase } from "@oslojs/encoding";
import { eq } from "drizzle-orm";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(values: loginParams): Promise<string | never> {
  try {
    const validationResult = loginSchema.safeParse(values);
    if (!validationResult.success) {
      return "Something went wrong. Please try again later.";
    }
    const formData = validationResult.data;
    const cookieStore = await cookies();
    const result = await db
      .select()
      .from(userTable)
      .where(eq(userTable.name, formData.name));
    if (result.length < 1) {
      return "Incorrect user or password";
    }
    const user = result[0];
    if (
      user.passwordHash ===
      encodeHexLowerCase(sha256(new TextEncoder().encode(formData.password)))
    ) {
      return "Incorrect user or password";
    }
    const newSessionToken = generateSessionToken();
    await createSession(newSessionToken, user.id);
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
