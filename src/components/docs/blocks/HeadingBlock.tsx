import React, { useState, useEffect, useRef } from "react";
import { useBlockOperations } from "@/hooks/docs/useBlockOperations";
import { cn } from "@/lib/utils";
import { HeadingBlockType } from "@/types/models/docBlock";

interface HeadingBlockProps {
  id: string;
  content: string;
  level: 1 | 2 | 3;
  placeholder?: string;
  onUpdate: (id: string, content: string, metadata?: any) => void;
  onKeyDown?: (e: React.KeyboardEvent, id: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  readOnly?: boolean;
  isSelected?: boolean;
}

export const HeadingBlock: React.FC<HeadingBlockProps> = ({
  id,
  content,
  level = 1,
  placeholder = "Heading",
  onUpdate,
  onKeyDown,
  onFocus,
  onBlur,
  readOnly = false,
  isSelected = false,
}) => {
  const [localContent, setLocalContent] = useState<string>(content);
  const { splitBlock, transformBlock } = useBlockOperations();
  const contentRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    setLocalContent(content);
  }, [content]);

  const handleInput = (e: React.FormEvent<HTMLHeadingElement>) => {
    const newContent = e.currentTarget.textContent || "";
    setLocalContent(newContent);
    onUpdate(id, newContent, { level });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Convert to paragraph if backspace at beginning of empty heading
    if (e.key === "Backspace" && contentRef.current?.textContent === "") {
      e.preventDefault();
      transformBlock(id, "text");
      return;
    }

    // Enter to create new block below
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      // Create new text block below
      splitBlock(id, "");
    }

    // Handle heading level changes with keyboard shortcuts
    if (
      (e.key === "1" || e.key === "2" || e.key === "3") &&
      e.altKey &&
      e.shiftKey
    ) {
      e.preventDefault();
      const newLevel = parseInt(e.key) as 1 | 2 | 3;
      onUpdate(id, localContent, { level: newLevel });
      return;
    }

    // Forward the event to parent
    if (onKeyDown) {
      onKeyDown(e, id);
    }
  };

  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;

  return (
    <div className="relative group">
      {isSelected && !readOnly && (
        <div className="absolute -left-8 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex space-x-1">
            {[1, 2, 3].map((lvl) => (
              <button
                key={lvl}
                className={cn(
                  "w-6 h-6 flex items-center justify-center rounded",
                  level === lvl
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                    : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                )}
                onClick={() =>
                  onUpdate(id, localContent, { level: lvl as 1 | 2 | 3 })
                }
                type="button"
              >
                H{lvl}
              </button>
            ))}
          </div>
        </div>
      )}

      <HeadingTag
        ref={contentRef}
        contentEditable={!readOnly}
        suppressContentEditableWarning
        className={cn(
          "outline-none py-1 px-2 min-h-[1em] rounded-sm font-bold",
          "focus:bg-gray-50 dark:focus:bg-gray-800/50",
          {
            "text-3xl": level === 1,
            "text-2xl": level === 2,
            "text-xl": level === 3,
            "text-gray-400 italic": !localContent.trim(),
          }
        )}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onFocus={onFocus}
        onBlur={onBlur}
        data-placeholder={!localContent ? placeholder : undefined}
      >
        {localContent}
      </HeadingTag>
    </div>
  );
};

export default HeadingBlock;
