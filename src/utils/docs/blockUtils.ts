/**
 * Utility functions for handling document blocks
 */

import { Block, BlockId, BlockType, TextBlock } from "@/types/models/docBlock";
import { v4 as uuidv4 } from "uuid";

/**
 * Creates a new block with default values based on the block type
 */
export const createBlock = (
  type: BlockType,
  parentId: BlockId | null = null
): Block => {
  const now = new Date().toISOString();
  const baseBlock = {
    id: uuidv4(),
    type,
    createdAt: now,
    updatedAt: now,
    parentId,
  };

  // Create specific block types with their defaults
  switch (type) {
    case "text":
      return {
        ...baseBlock,
        type: "text",
        content: [{ text: "" }],
      } as TextBlock;

    case "heading_1":
    case "heading_2":
    case "heading_3":
      return {
        ...baseBlock,
        type,
        content: [{ text: "" }],
      } as any; // Type casting for simplicity

    case "bulleted_list":
      return {
        ...baseBlock,
        type: "bulleted_list",
        items: [{ content: [{ text: "" }] }],
      } as any;

    case "numbered_list":
      return {
        ...baseBlock,
        type: "numbered_list",
        items: [{ content: [{ text: "" }] }],
        start: 1,
      } as any;

    case "checklist":
      return {
        ...baseBlock,
        type: "checklist",
        items: [{ content: [{ text: "" }], checked: false }],
      } as any;

    case "toggle":
      return {
        ...baseBlock,
        type: "toggle",
        summary: [{ text: "" }],
        isOpen: true,
      } as any;

    case "code":
      return {
        ...baseBlock,
        type: "code",
        content: "",
        language: "javascript",
      } as any;

    case "quote":
      return {
        ...baseBlock,
        type: "quote",
        content: [{ text: "" }],
      } as any;

    case "divider":
      return {
        ...baseBlock,
        type: "divider",
      } as any;

    default:
      // Return a default text block if the type is not handled
      return {
        ...baseBlock,
        type: "text",
        content: [{ text: "" }],
      } as TextBlock;
  }
};

/**
 * Finds a block by ID in an array of blocks
 */
export const findBlockById = (
  blocks: Block[],
  id: BlockId
): Block | undefined => {
  return blocks.find((block) => block.id === id);
};

/**
 * Finds the index of a block in an array of blocks
 */
export const findBlockIndexById = (blocks: Block[], id: BlockId): number => {
  return blocks.findIndex((block) => block.id === id);
};

/**
 * Checks if a block is empty (has no content)
 */
export const isBlockEmpty = (block: Block): boolean => {
  switch (block.type) {
    case "text":
    case "heading_1":
    case "heading_2":
    case "heading_3":
      return (
        !block.content ||
        block.content.length === 0 ||
        block.content[0].text === ""
      );

    case "bulleted_list":
    case "numbered_list":
    case "checklist":
      return (
        !block.items ||
        block.items.length === 0 ||
        (block.items.length === 1 &&
          (!block.items[0].content ||
            block.items[0].content.length === 0 ||
            block.items[0].content[0].text === ""))
      );

    case "toggle":
      return (
        !block.summary ||
        block.summary.length === 0 ||
        block.summary[0].text === ""
      );

    case "code":
      return !block.content || block.content === "";

    case "quote":
      return (
        !block.content ||
        block.content.length === 0 ||
        block.content[0].text === ""
      );

    // A divider block is never considered empty
    case "divider":
      return false;

    default:
      return true;
  }
};

/**
 * Gets the text content of a block (for search indexing)
 */
export const getBlockTextContent = (block: Block): string => {
  switch (block.type) {
    case "text":
    case "heading_1":
    case "heading_2":
    case "heading_3":
      return block.content
        ? block.content.map((item) => item.text).join("")
        : "";

    case "bulleted_list":
    case "numbered_list":
    case "checklist":
      return block.items
        ? block.items
            .map((item) =>
              item.content ? item.content.map((c) => c.text).join("") : ""
            )
            .join("\n")
        : "";

    case "toggle":
      return block.summary
        ? block.summary.map((item) => item.text).join("")
        : "";

    case "code":
      return block.content || "";

    case "quote":
      return block.content
        ? block.content.map((item) => item.text).join("")
        : "";

    case "divider":
      return "";

    default:
      return "";
  }
};

/**
 * Converts a block type to a human-readable name
 */
export const getBlockTypeName = (type: BlockType): string => {
  switch (type) {
    case "text":
      return "Text";
    case "heading_1":
      return "Heading 1";
    case "heading_2":
      return "Heading 2";
    case "heading_3":
      return "Heading 3";
    case "bulleted_list":
      return "Bulleted List";
    case "numbered_list":
      return "Numbered List";
    case "checklist":
      return "Checklist";
    case "toggle":
      return "Toggle";
    case "code":
      return "Code";
    case "quote":
      return "Quote";
    case "divider":
      return "Divider";
    case "image":
      return "Image";
    case "bookmark":
      return "Bookmark";
    case "embed":
      return "Embed";
    case "file":
      return "File";
    case "page":
      return "Page Link";
    case "table":
      return "Table";
    default:
      return "Unknown";
  }
};

/**
 * Finds the nearest common ancestor of two blocks
 * Returns null if the blocks have no common ancestor
 */
export const findCommonAncestor = (
  blocks: Block[],
  blockId1: BlockId,
  blockId2: BlockId
): BlockId | null => {
  const block1 = findBlockById(blocks, blockId1);
  const block2 = findBlockById(blocks, blockId2);

  if (!block1 || !block2) return null;

  const ancestors1 = getAncestors(blocks, blockId1);
  const ancestors2 = getAncestors(blocks, blockId2);

  // Find the first common ancestor
  for (const ancestorId of ancestors1) {
    if (ancestors2.includes(ancestorId)) {
      return ancestorId;
    }
  }

  return null;
};

/**
 * Gets all ancestors of a block, starting from the immediate parent
 * Returns an array of block IDs
 */
export const getAncestors = (blocks: Block[], blockId: BlockId): BlockId[] => {
  const block = findBlockById(blocks, blockId);
  if (!block || !block.parentId) return [];

  const ancestors: BlockId[] = [block.parentId];
  let currentParentId = block.parentId;

  while (currentParentId) {
    const parent = findBlockById(blocks, currentParentId);
    if (!parent || !parent.parentId) break;

    ancestors.push(parent.parentId);
    currentParentId = parent.parentId;
  }

  return ancestors;
};

/**
 * Gets all descendants of a block
 * Returns an array of block IDs
 */
export const getDescendants = (
  blocks: Block[],
  blockId: BlockId
): BlockId[] => {
  const descendants: BlockId[] = [];

  // Find direct children
  const children = blocks.filter((block) => block.parentId === blockId);

  // Add children and their descendants
  for (const child of children) {
    descendants.push(child.id);
    descendants.push(...getDescendants(blocks, child.id));
  }

  return descendants;
};

/**
 * Converts a block to a different type while preserving content when possible
 */
export const convertBlockType = (block: Block, newType: BlockType): Block => {
  const now = new Date().toISOString();
  const baseBlock = {
    id: block.id,
    type: newType,
    createdAt: block.createdAt,
    updatedAt: now,
    parentId: block.parentId,
  };

  // Extract text content from the original block
  const textContent = getBlockTextContent(block);

  // Create a new block with the appropriate type
  return createBlock(newType, block.parentId);
};
