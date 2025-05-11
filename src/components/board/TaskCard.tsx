"use client";

export default function TaskCard({ title }: { title: string }) {
  return (
    <div className="bg-white border rounded p-3 shadow-sm text-sm">{title}</div>
  );
}
