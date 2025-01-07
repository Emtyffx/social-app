"use client";
import { Button } from "@/components/ui/button";
import { userSecurityFilter } from "@/lib/auth";
import { deleteAccount, logout } from "./actions";

export const Content = ({
  user, sessionId
}: {
    user: ReturnType<typeof userSecurityFilter>,
    sessionId: string,
}) => {


  return (
    <>
      <div>Welcome {user.name}</div>
      <Button onClick={() => logout(sessionId)}>Logout</Button>
      <Button onClick={() => deleteAccount(sessionId)}>Delete account</Button>
    </>
  );
};
