import { Middleware } from "@reduxjs/toolkit";

// Logger Middleware for development
const logger: Middleware = (store) => (next) => (action: any) => {
  // Only log in development mode
  if (process.env.NODE_ENV === "development") {
    console.group(
      `%c Action: ${action.type}`,
      "color: blue; font-weight: bold;"
    );

    console.log(
      "%c Previous State:",
      "color: gray; font-weight: bold;",
      store.getState()
    );
    console.log("%c Action:", "color: green; font-weight: bold;", action);

    // Execute the action
    const result = next(action);

    console.log(
      "%c Next State:",
      "color: purple; font-weight: bold;",
      store.getState()
    );

    console.groupEnd();

    return result;
  }

  // If not in development, just pass the action through
  return next(action);
};

export default logger;
