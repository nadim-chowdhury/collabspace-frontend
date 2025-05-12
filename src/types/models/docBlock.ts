// Unique identifier for each block
export type BlockId = string;

// All possible block types supported by the editor
export type BlockType =
  | "text"
  | "heading_1"
  | "heading_2"
  | "heading_3"
  | "bulleted_list"
  | "numbered_list"
  | "checklist"
  | "toggle"
  | "code"
  | "quote"
  | "divider"
  | "image"
  | "bookmark"
  | "embed"
  | "file"
  | "page"
  | "table";

// Basic text formatting types
export interface TextFormat {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
  color?: string;
  backgroundColor?: string;
}

// Text content with optional formatting
export interface RichText {
  text: string;
  format?: TextFormat;
}

// Base properties all blocks share
export interface BaseBlock {
  id: BlockId;
  type: BlockType;
  createdAt: string;
  updatedAt: string;
  parentId: BlockId | null;
  children?: BlockId[];
}

// Basic text block (paragraph)
export interface TextBlock extends BaseBlock {
  type: "text";
  content: RichText[];
}

// Heading blocks (levels 1-3)
export interface HeadingBlock extends BaseBlock {
  type: "heading_1" | "heading_2" | "heading_3";
  content: RichText[];
}

// List item for both bulleted and numbered lists
export interface ListItemContent {
  content: RichText[];
  checked?: boolean; // For checklist items
  children?: ListItemContent[]; // For nested lists
}

// Bulleted list block
export interface BulletedListBlock extends BaseBlock {
  type: "bulleted_list";
  items: ListItemContent[];
}

// Numbered list block
export interface NumberedListBlock extends BaseBlock {
  type: "numbered_list";
  items: ListItemContent[];
  start?: number; // Starting number
}

// Checklist (todo) block
export interface ChecklistBlock extends BaseBlock {
  type: "checklist";
  items: ListItemContent[];
}

// Toggle block (collapsible content)
export interface ToggleBlock extends BaseBlock {
  type: "toggle";
  summary: RichText[];
  isOpen: boolean;
}

// Code block with syntax highlighting
export interface CodeBlock extends BaseBlock {
  type: "code";
  content: string;
  language: string;
  caption?: RichText[];
}

// Quote block
export interface QuoteBlock extends BaseBlock {
  type: "quote";
  content: RichText[];
}

// Divider/separator block
export interface DividerBlock extends BaseBlock {
  type: "divider";
}

// Image block
export interface ImageBlock extends BaseBlock {
  type: "image";
  url: string;
  caption?: RichText[];
  width?: number;
  height?: number;
  alignment?: "left" | "center" | "right";
}

// Bookmark/link block
export interface BookmarkBlock extends BaseBlock {
  type: "bookmark";
  url: string;
  title?: string;
  description?: string;
  thumbnail?: string;
}

// Embed block (iframe content)
export interface EmbedBlock extends BaseBlock {
  type: "embed";
  url: string;
  caption?: RichText[];
  width?: number;
  height?: number;
}

// File attachment block
export interface FileBlock extends BaseBlock {
  type: "file";
  url: string;
  name: string;
  size?: number;
  type?: string;
}

// Page link/reference block
export interface PageBlock extends BaseBlock {
  type: "page";
  pageId: string;
  title?: string;
}

// Table cell content
export interface TableCell {
  content: RichText[];
  colSpan?: number;
  rowSpan?: number;
}

// Table block
export interface TableBlock extends BaseBlock {
  type: "table";
  rows: TableCell[][];
  hasHeaderRow: boolean;
  hasHeaderColumn: boolean;
}

// Union type of all possible blocks
export type Block =
  | TextBlock
  | HeadingBlock
  | BulletedListBlock
  | NumberedListBlock
  | ChecklistBlock
  | ToggleBlock
  | CodeBlock
  | QuoteBlock
  | DividerBlock
  | ImageBlock
  | BookmarkBlock
  | EmbedBlock
  | FileBlock
  | PageBlock
  | TableBlock;

// Helper type guard functions
export const isTextBlock = (block: Block): block is TextBlock =>
  block.type === "text";

export const isHeadingBlock = (block: Block): block is HeadingBlock =>
  block.type === "heading_1" ||
  block.type === "heading_2" ||
  block.type === "heading_3";

export const isBulletedListBlock = (block: Block): block is BulletedListBlock =>
  block.type === "bulleted_list";

export const isNumberedListBlock = (block: Block): block is NumberedListBlock =>
  block.type === "numbered_list";

export const isChecklistBlock = (block: Block): block is ChecklistBlock =>
  block.type === "checklist";

export const isToggleBlock = (block: Block): block is ToggleBlock =>
  block.type === "toggle";

export const isCodeBlock = (block: Block): block is CodeBlock =>
  block.type === "code";
