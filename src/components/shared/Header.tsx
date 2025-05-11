"use client";

import Avatar from "./Avatar";
import ThemeSwitcher from "./ThemeSwitcher";

export default function Header() {
  return (
    <header className="h-16 bg-white shadow px-6 flex items-center justify-between">
      <h1 className="text-xl font-semibold">CollabSpace</h1>
      <div className="flex items-center space-x-4">
        <ThemeSwitcher />
        <Avatar />
      </div>
    </header>
  );
}
