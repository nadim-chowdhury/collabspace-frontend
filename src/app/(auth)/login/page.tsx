"use client";

import { SignIn, useUser } from "@clerk/nextjs";

export default function LoginPage() {
  const { user } = useUser();

  if (!user) return <SignIn />;

  return <div>Welcome!</div>;
}
