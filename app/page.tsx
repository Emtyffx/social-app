import { userSecurityFilter, validateSessionToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import React from 'react'
import { Content } from './content';
import { redirect } from 'next/navigation';
const HomePage = async () => {
  "use server";
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token');

  const { user, session } = await validateSessionToken(token?.value ?? '');
  if (!user) {
    return redirect('/login');
  }
  return (
    <Content user={userSecurityFilter(user)} sessionId={session.id} />
  )
}



export default HomePage
