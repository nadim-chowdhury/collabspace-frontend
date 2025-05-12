// "use client";

// import { useState } from "react";

// export function useAuth() {
//   const [user, setUser] = useState(null);

//   const login = (credentials: any) => {
//     // Placeholder
//     setUser({ id: 1, name: "John Doe" });
//   };

//   const logout = () => setUser(null);

//   return { user, login, logout };
// }

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Define user type
export type User = {
  id: string;
  name: string;
  email: string;
  token: string;
  avatar?: string;
};

// Mock user for development
const MOCK_USER: User = {
  id: "user-1",
  name: "Test User",
  email: "test@example.com",
  token: "mock-jwt-token",
  avatar: "https://ui-avatars.com/api/?name=Test+User&background=random",
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Load user from localStorage on initial mount
  useEffect(() => {
    const loadUser = () => {
      try {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (err) {
        console.error("Failed to load user from localStorage:", err);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Login function
  const login = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      setError(null);

      try {
        // In a real app, this would be an API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock successful login
        if (email === "test@example.com" && password === "password") {
          setUser(MOCK_USER);
          localStorage.setItem("user", JSON.stringify(MOCK_USER));
          router.push("/dashboard");
          return true;
        } else {
          setError("Invalid email or password");
          return false;
        }
      } catch (err) {
        setError("An error occurred during login");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  // Register function
  const register = useCallback(
    async (name: string, email: string, password: string) => {
      setLoading(true);
      setError(null);

      try {
        // In a real app, this would be an API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock successful registration
        const newUser = {
          ...MOCK_USER,
          name,
          email,
          id: `user-${Date.now()}`,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
            name
          )}&background=random`,
        };

        setUser(newUser);
        localStorage.setItem("user", JSON.stringify(newUser));
        router.push("/dashboard");
        return true;
      } catch (err) {
        setError("An error occurred during registration");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  // Logout function
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("user");
    router.push("/login");
  }, [router]);

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };
}
