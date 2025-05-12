// "use client";

// import { useEffect, useRef } from "react";
// import io from "socket.io-client";

// export function useSocket(url: string) {
//   const socketRef = useRef<any>();

//   useEffect(() => {
//     socketRef.current = io(url);
//     return () => socketRef.current.disconnect();
//   }, [url]);

//   return socketRef.current;
// }

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./useAuth";

// Singleton socket instance
let socket: Socket | null = null;

export function useSocket() {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const { user } = useAuth();

  useEffect(() => {
    // Initialize socket connection if we have a user and no socket yet
    if (user && !socket) {
      // In development, connect to the local server
      // In production, this would use relative URL or environment variable
      socket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000", {
        auth: {
          token: user.token, // Pass authentication token
        },
      });
    }

    if (!socket) return;

    // Set up event listeners
    const onConnect = () => {
      setIsConnected(true);
      console.log("Socket connected");
    };

    const onDisconnect = () => {
      setIsConnected(false);
      console.log("Socket disconnected");
    };

    const onError = (error: Error) => {
      console.error("Socket error:", error);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("error", onError);

    // If socket exists but isn't connected, try to connect
    if (socket && !socket.connected) {
      socket.connect();
    }

    // Clean up listeners when component unmounts
    return () => {
      if (socket) {
        socket.off("connect", onConnect);
        socket.off("disconnect", onDisconnect);
        socket.off("error", onError);
      }
    };
  }, [user]);

  // Disconnect socket when user logs out
  useEffect(() => {
    if (!user && socket && socket.connected) {
      socket.disconnect();
      socket = null;
    }
  }, [user]);

  return socket;
}