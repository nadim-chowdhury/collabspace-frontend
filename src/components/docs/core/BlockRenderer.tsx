import React, { useRef, useEffect } from "react";
import { Block } from "@/types/document";
import { cn } from "@/lib/utils";
import TextBlock from "../blocks/TextBlock";
import HeadingBlock from "../blocks/HeadingBlock";
import ListBlock from "../blocks/ListBlock";
import ToggleBlock from "../blocks/ToggleBlock";

interface BlockRendererProps {
  block: Block;
  isSelected: boolean;
  isFocused: boolean;
  onChange: (content: any) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  registerRef: (ref: HTMLDivElement | null) => void;
  onSelect: () => void;
  onFocus: () => void;
}

/**
 * Renders the appropriate block component based on block type
 */
const BlockRenderer: React.FC<BlockRendererProps> = ({
  block,
  isSelected,
  isFocused,
  onChange,
  onKeyDown,
  registerRef,
  onSelect,
  onFocus,
}) => {
  const blockRef = useRef<HTMLDivElement>(null);

  // Register the block ref
  useEffect(() => {
    if (blockRef.current) {
      registerRef(blockRef.current);
    }

    return () => {
      registerRef(null);
    };
  }, [registerRef]);

  // Calculate the indent style
  const indentStyle = {
    paddingLeft: `${block.indent * 1.5}rem`,
  };

  // Render the appropriate block based on type
  const renderBlockContent = () => {
    switch (block.type) {
      case "text":
        return (
          <TextBlock
            content={block.content}
            onChange={onChange}
            isSelected={isSelected}
            isFocused={isFocused}
          />
        );

      case "heading":
        return (
          <HeadingBlock
            content={block.content}
            onChange={onChange}
            isSelected={isSelected}
            isFocused={isFocused}
          />
        );

      case "list-item":
        return (
          <ListBlock
            content={block.content}
            onChange={onChange}
            isSelected={isSelected}
            isFocused={isFocused}
          />
        );

      case "toggle":
        return (
          <ToggleBlock
            content={block.content}
            onChange={onChange}
            isSelected={isSelected}
            isFocused={isFocused}
          />
        );

      // Add more block types as needed

      default:
        return (
          <div className="p-2 border border-red-300 rounded">
            Unsupported block type: {block.type}
          </div>
        );
    }
  };

  return (
    <div
      ref={blockRef}
      className={cn(
        "block-container relative group transition-colors",
        isSelected && "bg-gray-100 dark:bg-gray-800/50 rounded",
        block.type === "text" && "py-1"
      )}
      style={indentStyle}
      onClick={onSelect}
      onFocus={onFocus}
      onKeyDown={onKeyDown}
      data-block-id={block.id}
      data-block-type={block.type}
    >
      {/* Add block handle for drag & drop (future implementation) */}
      <div className="absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 opacity-0 group-hover:opacity-40 pl-1 cursor-move">
        <div className="w-1.5 h-8 rounded-full bg-gray-300 dark:bg-gray-700"></div>
      </div>

      {/* Block content */}
      {renderBlockContent()}
    </div>
  );
};

export default BlockRenderer;
