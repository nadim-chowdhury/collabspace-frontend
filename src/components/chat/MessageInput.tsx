"use client";

import { useState } from "react";

export default function MessageInput() {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;
    console.log("Send:", text);
    setText("");
  };

  return (
    <div className="flex items-center gap-2 mt-4">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 border px-4 py-2 rounded-md"
      />
      <button
        onClick={handleSend}
        className="bg-blue-600 text-white px-4 py-2 rounded-md"
      >
        Send
      </button>
    </div>
  );
}
