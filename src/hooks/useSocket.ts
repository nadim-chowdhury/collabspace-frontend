"use client";

import { useEffect, useRef } from "react";
import io from "socket.io-client";

export function useSocket(url: string) {
  const socketRef = useRef<any>();

  useEffect(() => {
    socketRef.current = io(url);
    return () => socketRef.current.disconnect();
  }, [url]);

  return socketRef.current;
}
