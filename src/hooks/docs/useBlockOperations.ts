import { useCallback } from "react";
import { useEditor } from "@/hooks/docs/useEditor";
import { Block, BlockId, BlockType } from "@/types/models/docBlock";
import {
  createBlock,
  findBlockIndexById,
  isBlockEmpty,
} from "@/utils/docs/blockUtils";

/**
 * Custom hook for block operations in the editor
 */
export const useBlockOperations = () => {
  const {
    blocks,
    currentBlockId,
    addBlock,
    updateBlock,
    deleteBlock,
    setCurrentBlock,
  } = useEditor();

  /**
   * Inserts a new block of the specified type after the current block
   */
  const insertBlock = useCallback(
    (type: BlockType) => {
      if (!currentBlockId) return;

      const newBlockId = addBlock(type, currentBlockId);
      setCurrentBlock(newBlockId);

      // Focus the new block (should be done by Editor component when currentBlockId changes)
      return newBlockId;
    },
    [currentBlockId, addBlock, setCurrentBlock]
  );

  /**
   * Splits the current block at the cursor position and creates a new block with the second part
   */
  const splitBlock = useCallback(
    (cursorPosition: number) => {
      if (!currentBlockId) return;

      const block = blocks.find((b) => b.id === currentBlockId);
      if (!block) return;

      // Currently only handling text blocks for simplicity
      if (block.type === "text") {
        const text = block.content?.[0]?.text || "";

        // Split the text at cursor position
        const beforeText = text.substring(0, cursorPosition);
        const afterText = text.substring(cursorPosition);

        // Update the current block with the first part
        updateBlock(block.id, {
          content: [{ text: beforeText }],
        });

        // Create a new block with the second part
        const newBlockId = addBlock("text", block.id);
        updateBlock(newBlockId, {
          content: [{ text: afterText }],
        });

        // Focus the new block
        setCurrentBlock(newBlockId);
        return newBlockId;
      }

      return insertBlock("text");
    },
    [
      blocks,
      currentBlockId,
      updateBlock,
      addBlock,
      setCurrentBlock,
      insertBlock,
    ]
  );

  /**
   * Merges the current block with the previous block if possible
   */
  const mergeWithPreviousBlock = useCallback(() => {
    if (!currentBlockId) return;

    const currentIndex = findBlockIndexById(blocks, currentBlockId);
    if (currentIndex <= 0) return; // No previous block

    const currentBlock = blocks[currentIndex];
    const previousBlock = blocks[currentIndex - 1];

    // Only handle text blocks for now
    if (currentBlock.type === "text" && previousBlock.type === "text") {
      const previousText = previousBlock.content?.[0]?.text || "";
      const currentText = currentBlock.content?.[0]?.text || "";

      // Merge the text content
      updateBlock(previousBlock.id, {
        content: [{ text: previousText + currentText }],
      });

      // Delete the current block
      deleteBlock(currentBlock.id);

      // Focus the previous block
      setCurrentBlock(previousBlock.id);
      return previousBlock.id;
    }

    return null;
  }, [blocks, currentBlockId, updateBlock, deleteBlock, setCurrentBlock]);

  /**
   * Handles backspace at the beginning of a block
   */
  const handleBackspaceAtBlockStart = useCallback(() => {
    if (!currentBlockId) return;

    const currentBlock = blocks.find((b) => b.id === currentBlockId);
    if (!currentBlock) return;

    // If block is empty, delete it and focus previous block
    if (isBlockEmpty(currentBlock)) {
      const currentIndex = findBlockIndexById(blocks, currentBlockId);
      if (currentIndex > 0) {
        const previousBlockId = blocks[currentIndex - 1].id;
        deleteBlock(currentBlockId);
        setCurrentBlock(previousBlockId);
        return previousBlockId;
      }
      return null;
    }

    // If not empty, merge with previous block
    return mergeWithPreviousBlock();
  }, [
    blocks,
    currentBlockId,
    deleteBlock,
    setCurrentBlock,
    mergeWithPreviousBlock,
  ]);

  /**
   * Toggles the block type (convert to a different type)
   */
  const toggleBlockType = useCallback(
    (type: BlockType) => {
      if (!currentBlockId) return;

      const block = blocks.find((b) => b.id === currentBlockId);
      if (!block) return;

      // Create a new block with the same content but different type
      const textContent = block.content?.[0]?.text || "";

      // Create a new block with the appropriate type
      const newBlock = createBlock(type, block.parentId);

      // Set the content if it's a text-based block
      if ("content" in newBlock && Array.isArray(newBlock.content)) {
        newBlock.content = [{ text: textContent }];
      }

      // Replace the current block
      updateBlock(currentBlockId, newBlock);
      return currentBlockId;
    },
    [blocks, currentBlockId, updateBlock]
  );

  /**
   * Indents the current block (increases nesting level)
   */
  const indentBlock = useCallback(() => {
    if (!currentBlockId) return;

    const currentIndex = findBlockIndexById(blocks, currentBlockId);
    if (currentIndex <= 0) return; // Can't indent the first block

    const previousBlock = blocks[currentIndex - 1];

    // Set previous block as parent
    updateBlock(currentBlockId, {
      parentId: previousBlock.id,
    });

    return currentBlockId;
  }, [blocks, currentBlockId, updateBlock]);

  /**
   * Outdents the current block (decreases nesting level)
   */
  const outdentBlock = useCallback(() => {
    if (!currentBlockId) return;

    const currentBlock = blocks.find((b) => b.id === currentBlockId);
    if (!currentBlock || !currentBlock.parentId) return; // Not nested

    const parentBlock = blocks.find((b) => b.id === currentBlock.parentId);
    if (!parentBlock) return;

    // Set parent's parent as new parent
    updateBlock(currentBlockId, {
      parentId: parentBlock.parentId,
    });

    return currentBlockId;
  }, [blocks, currentBlockId, updateBlock]);

  return {
    insertBlock,
    splitBlock,
    mergeWithPreviousBlock,
    handleBackspaceAtBlockStart,
    toggleBlockType,
    indentBlock,
    outdentBlock,
  };
};

export default useBlockOperations;
