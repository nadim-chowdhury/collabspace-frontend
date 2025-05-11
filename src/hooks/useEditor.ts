"use client";

import { useState } from "react";

export function useEditor() {
  const [content, setContent] = useState("");

  const updateContent = (value: string) => setContent(value);

  return { content, updateContent };
}
