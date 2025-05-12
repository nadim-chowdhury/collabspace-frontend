import React, { useState, useEffect, useRef } from "react";
import { useBlockOperations } from "@/hooks/docs/useBlockOperations";
import { cn } from "@/lib/utils";

interface QuoteBlockProps {
  id: string;
  content: string;
  citation?: string;
  variant?: "default" | "simple" | "large";
  placeholder?: string;
  onUpdate: (id: string, content: string, metadata?: any) => void;
  onKeyDown?: (e: React.KeyboardEvent, id: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  readOnly?: boolean;
  isSelected?: boolean;
}

export const QuoteBlock: React.FC<QuoteBlockProps> = ({
  id,
  content,
  citation = "",
  variant = "default",
  placeholder = "Type a quote...",
  onUpdate,
  onKeyDown,
  onFocus,
  onBlur,
  readOnly = false,
  isSelected = false,
}) => {
  const [localContent, setLocalContent] = useState<string>(content);
  const [localCitation, setLocalCitation] = useState<string>(citation);
  const [localVariant, setLocalVariant] = useState<
    "default" | "simple" | "large"
  >(variant);
  const { splitBlock } = useBlockOperations();
  const contentRef = useRef<HTMLDivElement>(null);
  const citationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalContent(content);
    setLocalCitation(citation);
    setLocalVariant(variant);
  }, [content, citation, variant]);

  // Handle content changes
  const handleContentChange = (e: React.FormEvent<HTMLDivElement>) => {
    const newContent = e.currentTarget.innerHTML;
    setLocalContent(newContent);
    onUpdate(id, newContent, {
      citation: localCitation,
      variant: localVariant,
    });
  };

  // Handle citation changes
  const handleCitationChange = (e: React.FormEvent<HTMLDivElement>) => {
    const newCitation = e.currentTarget.textContent || "";
    setLocalCitation(newCitation);
    onUpdate(id, localContent, {
      citation: newCitation,
      variant: localVariant,
    });
  };

  // Handle variant change
  const handleVariantChange = (newVariant: "default" | "simple" | "large") => {
    setLocalVariant(newVariant);
    onUpdate(id, localContent, {
      citation: localCitation,
      variant: newVariant,
    });
  };

  // Handle key commands
  const handleKeyDown = (
    e: React.KeyboardEvent,
    target: "content" | "citation"
  ) => {
    // Enter to split block or move to citation
    if (e.key === "Enter" && !e.shiftKey && target === "content") {
      e.preventDefault();

      // If there's already citation text, split the block
      if (localCitation) {
        const selection = window.getSelection();
        const range = selection?.getRangeAt(0);

        if (range) {
          const currentPos = range.startOffset;
          const element = range.startContainer;
          const text = element.textContent || "";

          // Get the parent paragraph if we're in a text node
          const paragraph =
            element.nodeType === Node.TEXT_NODE
              ? element.parentElement
              : element;

          // Get all content before the cursor in this specific paragraph
          const beforeText = text.substring(0, currentPos);
          const afterText = text.substring(currentPos);

          // Update the content of this paragraph
          if (element.nodeType === Node.TEXT_NODE && element.parentElement) {
            element.textContent = beforeText;
          }

          // Update the current block content
          const updatedContent = contentRef.current?.innerHTML || "";
          onUpdate(id, updatedContent, {
            citation: localCitation,
            variant: localVariant,
          });

          // Create new block with text after cursor
          splitBlock(id, afterText);
        }
      } else {
        // If no citation yet, focus the citation field
        citationRef.current?.focus();
      }
      return;
    }

    // Backspace at beginning of citation field moves focus back to content
    if (
      e.key === "Backspace" &&
      target === "citation" &&
      (!localCitation || window.getSelection()?.anchorOffset === 0)
    ) {
      e.preventDefault();
      contentRef.current?.focus();

      // Place cursor at the end of content
      const range = document.createRange();
      const sel = window.getSelection();
      const contentElement = contentRef.current;

      if (contentElement) {
        range.selectNodeContents(contentElement);
        range.collapse(false);
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
      return;
    }

    // Forward the event to parent
    if (onKeyDown) {
      onKeyDown(e, id);
    }
  };

  return (
    <div className="my-2 group">
      <div
        className={cn("relative", {
          "pl-4 border-l-4 border-gray-300 dark:border-gray-600":
            localVariant === "default",
          "pl-4 border-l-2 border-gray-200 dark:border-gray-700":
            localVariant === "simple",
          "px-8 py-2 text-lg italic": localVariant === "large",
        })}
      >
        {/* Quote content */}
        <div
          ref={contentRef}
          contentEditable={!readOnly}
          suppressContentEditableWarning
          className={cn(
            "outline-none mb-1",
            "focus:bg-gray-50 dark:focus:bg-gray-800/50 rounded-sm",
            {
              "text-gray-400 italic": !localContent.trim(),
              "text-xl": localVariant === "large",
            }
          )}
          onInput={handleContentChange}
          onKeyDown={(e) => handleKeyDown(e, "content")}
          onFocus={onFocus}
          onBlur={onBlur}
          dangerouslySetInnerHTML={{ __html: localContent || "" }}
          data-placeholder={!localContent ? placeholder : undefined}
        />

        {/* Quote citation */}
        {(isSelected || localCitation) && (
          <div
            ref={citationRef}
            contentEditable={!readOnly}
            suppressContentEditableWarning
            className={cn(
              "outline-none text-sm text-gray-500 dark:text-gray-400 mt-1",
              "focus:bg-gray-50 dark:focus:bg-gray-800/50 rounded-sm",
              {
                "text-gray-400 italic": !localCitation.trim(),
              }
            )}
            onInput={handleCitationChange}
            onKeyDown={(e) => handleKeyDown(e, "citation")}
            data-placeholder="Add citation..."
          >
            {localCitation}
          </div>
        )}
      </div>

      {/* Quote style selector */}
      {isSelected && !readOnly && (
        <div className="ml-4 mt-1 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            className={cn(
              "text-xs py-1 px-2 rounded text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800",
              localVariant === "default" &&
                "bg-gray-100 dark:bg-gray-800 text-blue-500"
            )}
            onClick={() => handleVariantChange("default")}
          >
            Default
          </button>
          <button
            className={cn(
              "text-xs py-1 px-2 rounded text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800",
              localVariant === "simple" &&
                "bg-gray-100 dark:bg-gray-800 text-blue-500"
            )}
            onClick={() => handleVariantChange("simple")}
          >
            Simple
          </button>
          <button
            className={cn(
              "text-xs py-1 px-2 rounded text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800",
              localVariant === "large" &&
                "bg-gray-100 dark:bg-gray-800 text-blue-500"
            )}
            onClick={() => handleVariantChange("large")}
          >
            Large
          </button>
        </div>
      )}
    </div>
  );
};

export default QuoteBlock;
