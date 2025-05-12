import React, { useState, useEffect, useRef } from "react";
import { useBlockOperations } from "@/hooks/docs/useBlockOperations";
import { cn } from "@/lib/utils";
import { ListBlockType } from "@/types/models/docBlock";

interface ListItem {
  id: string;
  content: string;
  checked?: boolean;
}

interface ListBlockProps {
  id: string;
  items: ListItem[];
  listType: "bullet" | "numbered" | "todo";
  onUpdate: (id: string, items: ListItem[], metadata?: any) => void;
  onKeyDown?: (e: React.KeyboardEvent, id: string, index: number) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  readOnly?: boolean;
  isSelected?: boolean;
}

export const ListBlock: React.FC<ListBlockProps> = ({
  id,
  items,
  listType = "bullet",
  onUpdate,
  onKeyDown,
  onFocus,
  onBlur,
  readOnly = false,
  isSelected = false,
}) => {
  const [localItems, setLocalItems] = useState<ListItem[]>(items);
  const { splitBlock, transformBlock } = useBlockOperations();
  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Update local state when props change
  useEffect(() => {
    setLocalItems(items);
  }, [items]);

  // Update UI when a list item changes
  const handleItemChange = (index: number, content: string) => {
    const newItems = [...localItems];
    newItems[index].content = content;
    setLocalItems(newItems);
    onUpdate(id, newItems, { listType });
  };

  // Toggle checkbox for todo list items
  const handleCheckboxToggle = (index: number) => {
    const newItems = [...localItems];
    newItems[index].checked = !newItems[index].checked;
    setLocalItems(newItems);
    onUpdate(id, newItems, { listType });
  };

  // Handle keyboard navigation and commands
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    // Handle Enter to create new list item
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      // Extract current item text and position
      const currentItem = itemRefs.current[index];
      const selection = window.getSelection();
      const range = selection?.getRangeAt(0);

      if (range && currentItem) {
        const currentPos = range.startOffset;
        const text = currentItem.textContent || "";
        const beforeText = text.substring(0, currentPos);
        const afterText = text.substring(currentPos);

        // If line is empty and not the first item, exit list or decrease indent
        if (beforeText === "" && afterText === "" && index > 0) {
          // Remove the empty item
          const newItems = [...localItems];
          newItems.splice(index, 1);

          // If it's the last item and empty, convert to paragraph
          if (index === localItems.length - 1) {
            onUpdate(id, newItems, { listType });
            // Create new paragraph block below
            splitBlock(id, "");
          } else {
            onUpdate(id, newItems, { listType });
          }
          return;
        }

        // Update current item with text before cursor
        const newItems = [...localItems];
        newItems[index].content = beforeText;

        // Insert new item with text after cursor
        const newItem = {
          id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          content: afterText,
          checked: false,
        };
        newItems.splice(index + 1, 0, newItem);

        onUpdate(id, newItems, { listType });

        // Focus the new item after render
        setTimeout(() => {
          const newItemEl = itemRefs.current[index + 1];
          if (newItemEl) {
            newItemEl.focus();
            // Place cursor at beginning of text
            const range = document.createRange();
            const sel = window.getSelection();
            range.setStart(newItemEl, 0);
            range.collapse(true);
            sel?.removeAllRanges();
            sel?.addRange(range);
          }
        }, 0);
      }
    }

    // Backspace at beginning of item
    if (e.key === "Backspace" && index > 0) {
      const currentItem = itemRefs.current[index];
      const selection = window.getSelection();
      const range = selection?.getRangeAt(0);

      if (range && currentItem && range.startOffset === 0) {
        e.preventDefault();

        // Merge with previous item
        const newItems = [...localItems];
        const prevItemContent = newItems[index - 1].content;
        const currentItemContent = newItems[index].content;

        // Update previous item with combined content
        newItems[index - 1].content = prevItemContent + currentItemContent;

        // Remove current item
        newItems.splice(index, 1);
        onUpdate(id, newItems, { listType });

        // Focus previous item and place cursor at the joining point
        setTimeout(() => {
          const prevItemEl = itemRefs.current[index - 1];
          if (prevItemEl) {
            prevItemEl.focus();
            // Place cursor at the joining point
            const range = document.createRange();
            const sel = window.getSelection();
            const textNode = prevItemEl.firstChild || prevItemEl;
            range.setStart(textNode, prevItemContent.length);
            range.collapse(true);
            sel?.removeAllRanges();
            sel?.addRange(range);
          }
        }, 0);
      }
    }

    // Tab for indentation (would implement nested lists)
    if (e.key === "Tab") {
      e.preventDefault();
      // Here you would implement indent/outdent logic for nested lists
    }

    // Forward the event to parent if needed
    if (onKeyDown) {
      onKeyDown(e, id, index);
    }
  };

  // Render list marker based on type
  const renderMarker = (index: number, item: ListItem) => {
    switch (listType) {
      case "bullet":
        return <span className="text-gray-400 mr-2">•</span>;
      case "numbered":
        return <span className="text-gray-400 mr-2">{index + 1}.</span>;
      case "todo":
        return (
          <input
            type="checkbox"
            className="mr-2 rounded"
            checked={item.checked}
            onChange={() => handleCheckboxToggle(index)}
            onClick={(e) => e.stopPropagation()}
            readOnly={readOnly}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div ref={listRef} className="py-1">
      {localItems.map((item, index) => (
        <div key={item.id} className="flex items-start py-1 group">
          <div className="flex-shrink-0 w-6 flex items-center justify-center pt-1">
            {renderMarker(index, item)}
          </div>
          <div
            ref={(el) => (itemRefs.current[index] = el)}
            contentEditable={!readOnly}
            suppressContentEditableWarning
            className={cn(
              "flex-grow outline-none rounded-sm px-1",
              "focus:bg-gray-50 dark:focus:bg-gray-800/50",
              {
                "text-gray-400 italic": !item.content.trim(),
                "line-through text-gray-500":
                  listType === "todo" && item.checked,
              }
            )}
            onInput={(e) =>
              handleItemChange(index, e.currentTarget.textContent || "")
            }
            onKeyDown={(e) => handleKeyDown(e, index)}
            onFocus={onFocus}
            onBlur={onBlur}
            data-placeholder={!item.content ? "List item" : undefined}
          >
            {item.content}
          </div>
        </div>
      ))}

      {isSelected && !readOnly && (
        <div className="mt-1 flex pl-6 space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            className={cn(
              "text-xs py-1 px-2 rounded text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800",
              listType === "bullet" &&
                "bg-gray-100 dark:bg-gray-800 text-blue-500"
            )}
            onClick={() => onUpdate(id, localItems, { listType: "bullet" })}
          >
            Bullet
          </button>
          <button
            className={cn(
              "text-xs py-1 px-2 rounded text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800",
              listType === "numbered" &&
                "bg-gray-100 dark:bg-gray-800 text-blue-500"
            )}
            onClick={() => onUpdate(id, localItems, { listType: "numbered" })}
          >
            Numbered
          </button>
          <button
            className={cn(
              "text-xs py-1 px-2 rounded text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800",
              listType === "todo" &&
                "bg-gray-100 dark:bg-gray-800 text-blue-500"
            )}
            onClick={() => onUpdate(id, localItems, { listType: "todo" })}
          >
            Todo
          </button>
        </div>
      )}
    </div>
  );
};

export default ListBlock;
