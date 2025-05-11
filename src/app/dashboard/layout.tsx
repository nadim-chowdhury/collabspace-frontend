"use client";

import { useState, ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  FileText,
  Trello,
  MessageCircle,
  PencilRuler,
  Video,
  Menu,
} from "lucide-react";

const navItems = [
  { label: "Docs", href: "/dashboard/docs", icon: FileText },
  { label: "Board", href: "/dashboard/board", icon: Trello },
  { label: "Chat", href: "/dashboard/chat", icon: MessageCircle },
  { label: "Whiteboard", href: "/dashboard/whiteboard", icon: PencilRuler },
  { label: "Meet", href: "/dashboard/meet", icon: Video },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <section className="flex h-screen bg-[#efebe9] text-[#3e2723]">
      {/* Sidebar */}
      <aside
        className={clsx(
          "bg-[#4e342e] text-white flex flex-col transition-all duration-300",
          collapsed ? "w-20 items-center p-4" : "w-64 p-6"
        )}
      >
        {/* Header & Toggle */}
        <div className="flex justify-between items-center mb-10 w-full">
          {!collapsed && <h2 className="text-2xl font-bold">☕ CollabSpace</h2>}
          <button
            className="text-white"
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? "Expand" : "Collapse"}
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col space-y-2 w-full">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "flex items-center gap-3 py-2 px-3 rounded-md transition hover:bg-[#6d4c41]/80",
                  isActive && "bg-[#6d4c41]",
                  collapsed && "justify-center px-2"
                )}
              >
                <Icon size={20} />
                {!collapsed && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="h-16 bg-white shadow-sm px-6 flex items-center justify-between border-b border-[#d7ccc8]">
          <h1 className="text-lg font-semibold">Dashboard</h1>
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-[#6d4c41] rounded-full flex items-center justify-center text-white font-bold">
              U
            </div>
            <span className="font-medium">Username</span>
          </div>
        </header>

        {/* Page Content */}
        <div className="">{children}</div>
      </main>
    </section>
  );
}
