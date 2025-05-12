// import React, { useEffect, useRef } from "react";
// import { cn } from "@/lib/utils";

// interface TextBlockProps {
//   content: {
//     text: string;
//     format?: Record<string, any>;
//   };
//   onChange: (content: any) => void;
//   isSelected: boolean;
//   isFocused: boolean;
// }

// /**
//  * A basic text block component for plain text
//  */
// const TextBlock: React.FC<TextBlockProps> = ({
//   content,
//   onChange,
//   isSelected,
//   isFocused,
// }) => {
//   const contentRef = useRef<HTMLDivElement>(null);

//   // Update content when text changes
//   const handleContentChange = () => {
//     if (contentRef.current) {
//       const newText = contentRef.current.textContent || "";
//       onChange({ ...content, text: newText });
//     }
//   };

//   // Update the content when the format changes
//   useEffect(() => {
//     if (contentRef.current && content.format) {
//       // Apply formatting (advanced implementation would handle this)
//       // For now, we'll just set the content
//     }
//   }, [content.format]);

//   return (
//     <div className="py-1">
//       <div
//         ref={contentRef}
//         className={cn(
//           "outline-none whitespace-pre-wrap break-words",
//           isSelected && "bg-gray-100 dark:bg-gray-800/50",
//           !content.text &&
//             "before:content-['Type_something...'] before:text-gray-400 before:pointer-events-none"
//         )}
//         contentEditable
//         suppressContentEditableWarning
//         onInput={handleContentChange}
//         onBlur={handleContentChange}
//         dangerouslySetInnerHTML={{ __html: content.text || "" }}
//       />
//     </div>
//   );
// };

// export default TextBlock;

import React, { useEffect, useRef } from "react";
import { TextBlock as TextBlockType } from "@/types/models/docBlock";
import { useEditor } from "../core/EditorProvider";

interface TextBlockProps {
  block: TextBlockType;
  isActive: boolean;
  readOnly?: boolean;
  onClick: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

const TextBlock: React.FC<TextBlockProps> = ({
  block,
  isActive,
  readOnly = false,
  onClick,
  onKeyDown,
}) => {
  const { updateBlock } = useEditor();
  const contentRef = useRef<HTMLDivElement>(null);

  // Focus the block when it becomes active
  useEffect(() => {
    if (isActive && contentRef.current && !readOnly) {
      contentRef.current.focus();

      // Place cursor at the end of the text content
      const selection = window.getSelection();
      if (selection) {
        const range = document.createRange();
        range.selectNodeContents(contentRef.current);
        range.collapse(false); // Collapse to end
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  }, [isActive, readOnly]);

  // Convert rich text content to HTML
  const renderContent = () => {
    if (!block.content || block.content.length === 0) {
      return "";
    }

    // In a real implementation, we'd properly handle all formatting
    // For now, just return the plain text content
    return block.content.map((item) => item.text).join("");
  };

  // Handle content changes
  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    if (readOnly) return;

    const newText = e.currentTarget.textContent || "";

    // Update the block with new content
    updateBlock(block.id, {
      content: [{ text: newText }],
    });
  };

  // In a real implementation, we would:
  // 1. Handle formatting (bold, italic, etc.)
  // 2. Process paste events to clean HTML
  // 3. Implement drag handle for reordering
  // 4. Add hover controls for block actions

  return (
    <div
      className={`block text-block ${isActive ? "active" : ""}`}
      onClick={onClick}
      style={{
        position: "relative",
        padding: "8px 32px",
        margin: "8px 0",
        borderRadius: "4px",
        backgroundColor: isActive ? "rgba(35, 131, 226, 0.05)" : "transparent",
      }}
    >
      {/* Drag handle (non-functional in this basic implementation) */}
      <div
        className="drag-handle"
        style={{
          position: "absolute",
          left: "8px",
          top: "50%",
          transform: "translateY(-50%)",
          opacity: isActive ? 0.5 : 0,
          cursor: "grab",
        }}
      >
        ⋮
      </div>

      {/* Editable content */}
      <div
        ref={contentRef}
        contentEditable={!readOnly}
        suppressContentEditableWarning
        className="text-block-content"
        onInput={handleInput}
        onKeyDown={onKeyDown}
        style={{
          outline: "none",
          minHeight: "24px",
          lineHeight: "1.5",
          wordBreak: "break-word",
        }}
        dangerouslySetInnerHTML={{ __html: renderContent() }}
      />

      {/* Block type indicator (visible when block is empty and active) */}
      {isActive && (!block.content || block.content[0].text === "") && (
        <div
          className="placeholder"
          style={{
            position: "absolute",
            top: "8px",
            left: "32px",
            color: "#9fa6b2",
            pointerEvents: "none",
          }}
        >
          Type '/' for commands
        </div>
      )}
    </div>
  );
};

export default TextBlock;
