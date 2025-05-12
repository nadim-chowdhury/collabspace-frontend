import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface HeadingBlockProps {
  content: {
    text: string;
    level: number;
    format?: Record<string, any>;
  };
  onChange: (content: any) => void;
  isSelected: boolean;
  isFocused: boolean;
}

/**
 * Heading block component for creating headings with different levels
 */
const HeadingBlock: React.FC<HeadingBlockProps> = ({
  content,
  onChange,
  isSelected,
  isFocused,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const level = content.level || 2; // Default to h2 if not specified

  // Update content when text changes
  const handleContentChange = () => {
    if (contentRef.current) {
      const newText = contentRef.current.textContent || "";
      onChange({ ...content, text: newText });
    }
  };

  // Change heading level
  const changeLevel = (newLevel: number) => {
    onChange({ ...content, level: newLevel });
  };

  // Apply appropriate heading styles based on level
  const getHeadingClass = () => {
    switch (level) {
      case 1:
        return "text-3xl font-bold";
      case 2:
        return "text-2xl font-bold";
      case 3:
        return "text-xl font-bold";
      default:
        return "text-lg font-bold";
    }
  };

  useEffect(() => {
    // Additional effects when level changes
  }, [level]);

  return (
    <div className="py-2">
      {/* Optional level selector (visible when selected) */}
      {isSelected && (
        <div className="absolute -left-12 top-1/2 transform -translate-y-1/2 flex flex-col space-y-1 text-gray-400">
          <button
            type="button"
            className="hover:text-black dark:hover:text-white"
            onClick={() => changeLevel(1)}
          >
            H1
          </button>
          <button
            type="button"
            className="hover:text-black dark:hover:text-white"
            onClick={() => changeLevel(2)}
          >
            H2
          </button>
          <button
            type="button"
            className="hover:text-black dark:hover:text-white"
            onClick={() => changeLevel(3)}
          >
            H3
          </button>
        </div>
      )}

      <div
        ref={contentRef}
        className={cn(
          getHeadingClass(),
          "outline-none whitespace-pre-wrap break-words",
          !content.text &&
            "before:content-['Heading...'] before:text-gray-400 before:pointer-events-none"
        )}
        contentEditable
        suppressContentEditableWarning
        onInput={handleContentChange}
        onBlur={handleContentChange}
        dangerouslySetInnerHTML={{ __html: content.text || "" }}
      />
    </div>
  );
};

export default HeadingBlock;
