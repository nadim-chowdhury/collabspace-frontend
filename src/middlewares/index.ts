import { Middleware } from "@reduxjs/toolkit";

// Import individual middlewares
import { apiMiddleware } from "./api";
import logger from "./logger";
import socketMiddleware from "./socket";

// Centralized middleware configuration
export const configureMiddleware = (): Middleware[] => {
  const middlewares: Middleware[] = [
    // API middleware for handling API requests
    apiMiddleware,

    // Socket middleware with default configuration
    // You can pass custom socket configuration here if needed
    socketMiddleware(),

    // Logger middleware (only active in development)
    logger,
  ];

  return middlewares;
};

// Export individual middlewares for potential individual use
export { apiMiddleware, logger, socketMiddleware };

// Export types and action creators from individual middlewares
export * from "./api";
export * from "./socket";
