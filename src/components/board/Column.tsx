"use client";

import TaskCard from "./TaskCard";

export default function Column({ title }: { title: string }) {
  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <div className="space-y-2">
        <TaskCard title={`${title} Task 1`} />
        <TaskCard title={`${title} Task 2`} />
      </div>
    </div>
  );
}
