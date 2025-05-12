import React, { useState, useEffect, useRef } from "react";
import { useBlockOperations } from "@/hooks/docs/useBlockOperations";
import { InlineFormatting } from "@/components/docs/formatting/InlineFormatting";
import { cn } from "@/lib/utils";
import { TextBlockType } from "@/types/models/docBlock";

interface TextBlockProps {
  id: string;
  content: string;
  placeholder?: string;
  format?: TextBlockType["format"];
  onUpdate: (id: string, content: string, format?: any) => void;
  onKeyDown?: (e: React.KeyboardEvent, id: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  readOnly?: boolean;
  isSelected?: boolean;
}

export const TextBlock: React.FC<TextBlockProps> = ({
  id,
  content,
  placeholder = "Type something...",
  format = {},
  onUpdate,
  onKeyDown,
  onFocus,
  onBlur,
  readOnly = false,
  isSelected = false,
}) => {
  const [localContent, setLocalContent] = useState<string>(content);
  const [showFormatting, setShowFormatting] = useState<boolean>(false);
  const { splitBlock } = useBlockOperations();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalContent(content);
  }, [content]);

  // Update parent component when content changes
  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const newContent = e.currentTarget.innerHTML;
    setLocalContent(newContent);
    onUpdate(id, newContent, format);
  };

  // Handle key commands
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle slash command trigger
    if (
      e.key === "/" &&
      !e.shiftKey &&
      (e.target as HTMLElement).textContent === ""
    ) {
      e.preventDefault();
      // Open slash menu logic would go here
    }

    // Enter to split block
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const selection = window.getSelection();
      const range = selection?.getRangeAt(0);

      if (range) {
        const currentPos = range.startOffset;
        const text = contentRef.current?.textContent || "";
        const beforeText = text.substring(0, currentPos);
        const afterText = text.substring(currentPos);

        // Update current block with text before cursor
        onUpdate(id, beforeText, format);

        // Create new block with text after cursor
        splitBlock(id, afterText);
      }
    }

    // Forward the event to parent
    if (onKeyDown) {
      onKeyDown(e, id);
    }
  };

  const handleFocus = () => {
    setShowFormatting(true);
    if (onFocus) onFocus();
  };

  const handleBlur = () => {
    setShowFormatting(false);
    if (onBlur) onBlur();
  };

  const handleFormatChange = (newFormat: Partial<TextBlockType["format"]>) => {
    const updatedFormat = { ...format, ...newFormat };
    onUpdate(id, localContent, updatedFormat);
  };

  return (
    <div className="relative group">
      {showFormatting && isSelected && !readOnly && (
        <div className="absolute -top-10 left-0 z-10">
          <InlineFormatting
            currentFormat={format}
            onChange={handleFormatChange}
          />
        </div>
      )}

      <div
        ref={contentRef}
        contentEditable={!readOnly}
        suppressContentEditableWarning
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        dangerouslySetInnerHTML={{ __html: localContent || "" }}
        className={cn(
          "outline-none py-1 px-2 min-h-[1.5em] rounded-sm",
          "focus:bg-gray-50 dark:focus:bg-gray-800/50",
          {
            "text-gray-400 italic": !localContent.trim(),
            "font-bold": format?.bold,
            italic: format?.italic,
            underline: format?.underline,
            "line-through": format?.strikethrough,
            "text-gray-500": format?.code,
            "bg-gray-100 dark:bg-gray-800/70 font-mono rounded px-1":
              format?.code,
            "text-red-500": format?.color === "red",
            "text-blue-500": format?.color === "blue",
            "text-green-500": format?.color === "green",
            "text-yellow-500": format?.color === "yellow",
            "text-purple-500": format?.color === "purple",
          }
        )}
        data-placeholder={!localContent ? placeholder : undefined}
      />
    </div>
  );
};

export default TextBlock;
