"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = {
  content: string;
  onChange: (val: string) => void;
};

export default function Editor({ content, onChange }: Props) {
  const [isPreview, setIsPreview] = useState(false);

  return (
    <div className="flex flex-col md:flex-row gap-6 h-full">
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-semibold text-[#4e342e]">Markdown Editor</h2>
          <button
            onClick={() => setIsPreview((prev) => !prev)}
            className="text-sm text-[#6d4c41] bg-[#efebe9] px-3 py-1 rounded hover:bg-[#d7ccc8] transition"
          >
            {isPreview ? "Edit Mode" : "Preview Mode"}
          </button>
        </div>
        {!isPreview ? (
          <textarea
            value={content}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Write using markdown..."
            className="w-full h-full min-h-[400px] p-4 border border-[#bcaaa4] bg-white rounded-lg resize-none text-sm text-[#3e2723] focus:outline-none focus:ring-2 focus:ring-[#a1887f]"
          />
        ) : (
          <div className="w-full min-h-[400px] p-4 border border-[#bcaaa4] bg-white rounded-lg text-sm prose prose-sm max-w-none overflow-auto text-[#3e2723] prose-headings:text-[#4e342e]">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
