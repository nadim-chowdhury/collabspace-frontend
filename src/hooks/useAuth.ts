"use client";

import { useState } from "react";

export function useAuth() {
  const [user, setUser] = useState(null);

  const login = (credentials: any) => {
    // Placeholder
    setUser({ id: 1, name: "John Doe" });
  };

  const logout = () => setUser(null);

  return { user, login, logout };
}
