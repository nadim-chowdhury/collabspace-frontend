import React, { useState } from "react";
import { DocumentBlock } from "@/hooks/docs/useDocEditor";

interface EditorProps {
  blocks: DocumentBlock[];
  onAddBlock: (block: Omit<DocumentBlock, "id">) => void;
  onUpdateBlock: (blockId: string, updates: Partial<DocumentBlock>) => void;
  onDeleteBlock: (blockId: string) => void;
  onMoveBlock: (blockId: string, targetIndex: number) => void;
  readOnly?: boolean;
  canComment?: boolean;
}

export function Editor({
  blocks,
  onAddBlock,
  onUpdateBlock,
  onDeleteBlock,
  onMoveBlock,
  readOnly = false,
  canComment = false,
}: EditorProps) {
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);

  // const handleBlockEdit = (blockId: string, content: string) => {
  //   onUpdateBlock(blockId, { content });
  //   setEditingBlockId(null);
  // };

  const handleAddBlock = () => {
    onAddBlock({
      type: "text",
      content: "New block",
    });
  };

  return (
    <div className="editor-container">
      {blocks.map((block, index) => (
        <div key={block.id} className="editor-block mb-2 p-2 border rounded">
          {editingBlockId === block.id ? (
            <textarea
              className="w-full p-2 border rounded"
              value={block.content}
              onChange={(e) =>
                onUpdateBlock(block.id, { content: e.target.value })
              }
              onBlur={() => setEditingBlockId(null)}
              autoFocus
            />
          ) : (
            <div
              className="block-content"
              onClick={() => !readOnly && setEditingBlockId(block.id)}
            >
              {block.content}
            </div>
          )}

          {!readOnly && (
            <div className="block-actions mt-2 flex space-x-2">
              <button
                onClick={() => onDeleteBlock(block.id)}
                className="text-red-500 hover:bg-red-100 p-1 rounded"
              >
                Delete
              </button>
              {index > 0 && (
                <button
                  onClick={() => onMoveBlock(block.id, index - 1)}
                  className="hover:bg-gray-100 p-1 rounded"
                >
                  Move Up
                </button>
              )}
              {index < blocks.length - 1 && (
                <button
                  onClick={() => onMoveBlock(block.id, index + 1)}
                  className="hover:bg-gray-100 p-1 rounded"
                >
                  Move Down
                </button>
              )}
            </div>
          )}

          {canComment && (
            <div className="block-comments mt-2">
              <button className="text-blue-500 hover:bg-blue-100 p-1 rounded">
                Add Comment
              </button>
            </div>
          )}
        </div>
      ))}

      {!readOnly && (
        <div className="add-block-section mt-4">
          <button
            onClick={handleAddBlock}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Block
          </button>
        </div>
      )}
    </div>
  );
}
