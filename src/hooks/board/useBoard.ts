"use client";

import { useState } from "react";

export function useBoard() {
  const [columns, setColumns] = useState({});

  const addTask = (columnId: string, task: string) => {
    // Add task logic
  };

  return { columns, addTask };
}
