"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#d2b48c] via-[#f5f5dc] to-[#fdf6ec] text-[#3e2723] px-6 py-10 flex flex-col">
      <header className="w-full max-w-6xl mx-auto flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold tracking-wide text-[#4e342e]">
          Collab<span className="text-[#6d4c41]">Space</span>
        </h1>
        <div className="space-x-4">
          <Link
            href="/login"
            className="bg-[#6d4c41] text-white px-4 py-2 rounded-md hover:bg-[#5d4037] transition"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="bg-[#d7ccc8] text-[#3e2723] px-4 py-2 rounded-md hover:bg-[#c7b7b1] transition"
          >
            Register
          </Link>
        </div>
      </header>

      <section className="flex-1 flex flex-col items-center justify-center text-center">
        <h2 className="text-5xl font-extrabold mb-6 text-[#4e342e]">
          Brew Ideas. Build Together.
        </h2>
        <p className="text-xl max-w-2xl text-[#5d4037] mb-10">
          Welcome to{" "}
          <span className="font-semibold text-[#795548]">CollabSpace</span>,
          your all-in-one workspace to write docs, manage tasks, chat,
          brainstorm on whiteboards, and host meetings.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/dashboard"
            className="bg-[#795548] text-white px-6 py-3 rounded-md hover:bg-[#6d4c41] transition"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/features"
            className="border border-[#795548] text-[#5d4037] px-6 py-3 rounded-md hover:bg-[#f5f5dc] transition"
          >
            Learn More
          </Link>
        </div>
      </section>

      <footer className="text-center text-sm text-[#6d4c41] mt-10">
        © {new Date().getFullYear()} CollabSpace. Crafted with ☕ and code.
      </footer>
    </main>
  );
}
