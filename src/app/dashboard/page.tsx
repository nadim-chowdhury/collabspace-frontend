"use client";

import {
  FileText,
  Kanban,
  MessageSquareText,
  Paintbrush2,
  Video,
} from "lucide-react";
import Link from "next/link";

const dashboardSections = [
  {
    name: "Docs",
    description: "Create, edit, and share collaborative documents.",
    icon: <FileText className="h-6 w-6 text-[#6d4c41]" />,
    href: "/dashboard/docs",
  },
  {
    name: "Board",
    description: "Organize tasks visually with our kanban board.",
    icon: <Kanban className="h-6 w-6 text-[#6d4c41]" />,
    href: "/dashboard/board",
  },
  {
    name: "Chat",
    description: "Message your team in real time.",
    icon: <MessageSquareText className="h-6 w-6 text-[#6d4c41]" />,
    href: "/dashboard/chat",
  },
  {
    name: "Whiteboard",
    description: "Sketch ideas and brainstorm collaboratively.",
    icon: <Paintbrush2 className="h-6 w-6 text-[#6d4c41]" />,
    href: "/dashboard/whiteboard",
  },
  {
    name: "Meet",
    description: "Join or start a secure video meeting.",
    icon: <Video className="h-6 w-6 text-[#6d4c41]" />,
    href: "/dashboard/meet",
  },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#fdf6ec] px-6 py-10 text-[#3e2723]">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold mb-2">Welcome to CollabSpace 👋</h2>
        <p className="text-[#5d4037] mb-8">
          All your collaboration tools — in one place. Pick a feature to get
          started.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardSections.map((section) => (
            <Link
              key={section.name}
              href={section.href}
              className="bg-white border border-[#e0cfc2] rounded-xl shadow-md p-6 hover:shadow-xl transition group"
            >
              <div className="flex items-center gap-3 mb-3">
                {section.icon}
                <h3 className="text-xl font-semibold group-hover:text-[#795548] transition">
                  {section.name}
                </h3>
              </div>
              <p className="text-sm text-[#6d4c41]">{section.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
