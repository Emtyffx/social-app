import { validateSessionToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import React from "react";
import { Content } from "./content";

const LoginPage = async () => {
  "use server";
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  const { user } = await validateSessionToken(token?.value ?? "");
  if (user) {
    return redirect("/");
  }
  return <Content />;
};



export default LoginPage;
