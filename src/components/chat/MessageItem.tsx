"use client";

export default function MessageItem({
  user,
  text,
}: {
  user: string;
  text: string;
}) {
  return (
    <div className="bg-white shadow p-3 rounded-md border">
      <strong>{user}:</strong> <span className="text-sm">{text}</span>
    </div>
  );
}
