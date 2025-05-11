"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const navItems = [
  { label: "Docs", href: "/dashboard/docs" },
  { label: "Board", href: "/dashboard/board" },
  { label: "Chat", href: "/dashboard/chat" },
  { label: "Whiteboard", href: "/dashboard/whiteboard" },
  { label: "Meet", href: "/dashboard/meet" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col p-6 space-y-4">
      <h2 className="text-2xl font-bold mb-6">CollabSpace</h2>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={clsx(
            "py-2 px-4 rounded hover:bg-gray-700 transition",
            pathname === item.href && "bg-gray-700"
          )}
        >
          {item.label}
        </Link>
      ))}
    </aside>
  );
}
