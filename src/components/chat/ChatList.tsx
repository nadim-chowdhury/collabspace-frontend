"use client";

import MessageItem from "./MessageItem";

export default function ChatList() {
  const messages = [
    { id: 1, user: "Alice", text: "Hey! How's the doc going?" },
    { id: 2, user: "Bob", text: "Good! Just started typing it." },
  ];

  return (
    <div className="space-y-2 overflow-y-auto max-h-[400px]">
      {messages.map((msg) => (
        <MessageItem key={msg.id} {...msg} />
      ))}
    </div>
  );
}
