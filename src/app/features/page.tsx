"use client";

import {
  Coffee,
  FileText,
  ClipboardList,
  MessageCircle,
  Paintbrush,
  Video,
} from "lucide-react";

export default function FeaturesPage() {
  const features = [
    {
      title: "Collaborative Docs",
      description:
        "Write, edit, and share documents in real-time with your team.",
      icon: <FileText className="h-8 w-8 text-[#795548]" />,
    },
    {
      title: "Task Management",
      description:
        "Organize projects with kanban boards, tasks, and priorities.",
      icon: <ClipboardList className="h-8 w-8 text-[#795548]" />,
    },
    {
      title: "Instant Messaging",
      description: "Chat in real-time with individuals or groups seamlessly.",
      icon: <MessageCircle className="h-8 w-8 text-[#795548]" />,
    },
    {
      title: "Interactive Whiteboards",
      description: "Sketch, draw, and brainstorm ideas together visually.",
      icon: <Paintbrush className="h-8 w-8 text-[#795548]" />,
    },
    {
      title: "Video Meetings",
      description:
        "Host and join secure video meetings with built-in controls.",
      icon: <Video className="h-8 w-8 text-[#795548]" />,
    },
    {
      title: "Productivity Hub",
      description:
        "All-in-one dashboard to keep your team connected and productive.",
      icon: <Coffee className="h-8 w-8 text-[#795548]" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f5dc] to-[#fdf6ec] text-[#3e2723] px-6 py-16">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#4e342e]">
          Why Choose <span className="text-[#6d4c41]">CollabSpace</span>?
        </h1>
        <p className="text-lg text-[#5d4037] mb-12">
          Everything you need to collaborate, create, and connect — beautifully
          integrated.
        </p>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center text-center hover:shadow-xl transition"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-[#4e342e]">
                {feature.title}
              </h3>
              <p className="text-[#5d4037] mt-2">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
