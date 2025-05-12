import { Middleware } from "@reduxjs/toolkit";
import io, { Socket } from "socket.io-client";

// Define socket action types
export const SOCKET_CONNECT = "SOCKET_CONNECT";
export const SOCKET_DISCONNECT = "SOCKET_DISCONNECT";
export const SOCKET_EVENT = "SOCKET_EVENT";

// Socket configuration interface
interface SocketConfig {
  url: string;
  options?: any;
}

// Socket middleware state
interface SocketMiddlewareState {
  socket: Socket | null;
}

// Create socket middleware
const socketMiddleware = (config?: SocketConfig): Middleware => {
  const middlewareState: SocketMiddlewareState = {
    socket: null,
  };

  return (store) => (next) => (action: any) => {
    const { type, payload } = action;

    switch (type) {
      case SOCKET_CONNECT:
        // Disconnect existing socket if any
        if (middlewareState.socket) {
          middlewareState.socket.disconnect();
        }

        // Create new socket connection
        const connectionConfig = payload || config;
        if (!connectionConfig) {
          console.error("Socket connection configuration is missing");
          return next(action);
        }

        middlewareState.socket = io(
          connectionConfig.url,
          connectionConfig.options
        );

        // Setup socket event listeners
        middlewareState.socket.on("connect", () => {
          store.dispatch({
            type: "SOCKET_CONNECTED",
            payload: middlewareState.socket,
          });
        });

        middlewareState.socket.on("disconnect", () => {
          store.dispatch({
            type: "SOCKET_DISCONNECTED",
          });
        });

        // Generic event handler
        middlewareState.socket.onAny((eventName, ...args) => {
          store.dispatch({
            type: SOCKET_EVENT,
            payload: {
              event: eventName,
              data: args,
            },
          });
        });

        return next(action);

      case SOCKET_DISCONNECT:
        if (middlewareState.socket) {
          middlewareState.socket.disconnect();
          middlewareState.socket = null;
        }
        return next(action);

      case SOCKET_EVENT:
        // Emit socket event
        if (middlewareState.socket && payload.event) {
          middlewareState.socket.emit(payload.event, payload.data);
        }
        return next(action);

      default:
        return next(action);
    }
  };
};

// Action creators
export const connectSocket = (config: SocketConfig) => ({
  type: SOCKET_CONNECT,
  payload: config,
});

export const disconnectSocket = () => ({
  type: SOCKET_DISCONNECT,
});

export const emitSocketEvent = (event: string, data: any) => ({
  type: SOCKET_EVENT,
  payload: { event, data },
});

export default socketMiddleware;
