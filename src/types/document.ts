import { UUID } from "./";
import { UserModel } from "./models/auth";
import { BlockType, DocBlock } from "./models/docBlock";

// Document related types
export interface Document {
  id: UUID;
  title: string;
  emoji?: string;
  icon?: string;
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
  lastEditedBy: UUID;
  createdBy: UUID;
  parentId: UUID | null;
  isTemplate: boolean;
  archived: boolean;
  favorite: boolean;
  blocks: DocBlock[];
  path: string[];
  shareLink?: string;
  permissions: DocumentPermission[];
  tags: string[];
  metadata: DocumentMetadata;
}

export interface DocumentMetadata {
  description?: string;
  lastViewed?: string;
  viewCount?: number;
  editCount?: number;
  templateId?: UUID;
  isPublic?: boolean;
  syncStatus?: "synced" | "syncing" | "unsynced" | "error";
  database?: boolean;
  databaseViews?: DatabaseView[];
  properties?: DatabaseProperty[];
}

export interface DocumentPermission {
  id: UUID;
  documentId: UUID;
  userId: UUID;
  email?: string;
  permissionType: "view" | "edit" | "comment" | "full";
  createdAt: string;
  invitePending?: boolean;
}

export interface DocumentComment {
  id: UUID;
  documentId: UUID;
  blockId?: UUID;
  userId: UUID;
  content: string;
  createdAt: string;
  updatedAt?: string;
  resolved: boolean;
  parent?: UUID;
  mentions?: UUID[];
  reactions?: CommentReaction[];
}

export interface CommentReaction {
  userId: UUID;
  reaction: string;
}

export interface DocumentHistory {
  id: UUID;
  documentId: UUID;
  userId: UUID;
  timestamp: string;
  blocks: DocBlock[];
  title: string;
  changeDescription?: string;
  version: number;
}

export interface DocumentTreeItem {
  id: UUID;
  title: string;
  emoji?: string;
  icon?: string;
  children: DocumentTreeItem[];
  parentId: UUID | null;
  isTemplate: boolean;
  archived: boolean;
  favorite: boolean;
  type: "document" | "database";
  path: string[];
}

export interface DatabaseView {
  id: UUID;
  name: string;
  type: "table" | "board" | "gallery" | "calendar" | "list" | "timeline";
  filters?: DatabaseFilter[];
  sorts?: DatabaseSort[];
  groupBy?: string;
  properties?: string[]; // Visible property IDs in this view
  settings: {
    [key: string]: any;
  };
}

export interface DatabaseProperty {
  id: string;
  name: string;
  type: PropertyType;
  options?: PropertyOption[];
  relationId?: UUID;
  relationPropertyId?: string;
  formula?: string;
  isRequired?: boolean;
  defaultValue?: any;
  settings?: {
    [key: string]: any;
  };
}

export type PropertyType =
  | "text"
  | "number"
  | "select"
  | "multi_select"
  | "date"
  | "person"
  | "file"
  | "checkbox"
  | "url"
  | "email"
  | "phone"
  | "formula"
  | "relation"
  | "rollup"
  | "created_time"
  | "created_by"
  | "last_edited_time"
  | "last_edited_by";

export interface PropertyOption {
  id: string;
  name: string;
  color: string;
}

export interface DatabaseFilter {
  propertyId: string;
  operator: FilterOperator;
  value: any;
  type: "and" | "or";
  subFilters?: DatabaseFilter[];
}

export type FilterOperator =
  | "equals"
  | "does_not_equal"
  | "contains"
  | "does_not_contain"
  | "greater_than"
  | "less_than"
  | "greater_than_or_equal_to"
  | "less_than_or_equal_to"
  | "is_empty"
  | "is_not_empty"
  | "starts_with"
  | "ends_with"
  | "between"
  | "before"
  | "after"
  | "on_or_before"
  | "on_or_after";

export interface DatabaseSort {
  propertyId: string;
  direction: "ascending" | "descending";
}

export interface DocumentSearch {
  id: UUID;
  title: string;
  preview: string;
  path: string[];
  matchType: "title" | "content" | "tag";
  matchedBlocks?: {
    id: UUID;
    content: string;
    type: BlockType;
  }[];
  lastUpdated: string;
}

export interface DocumentShareSettings {
  documentId: UUID;
  isPublic: boolean;
  allowComments: boolean;
  allowDuplication: boolean;
  expiresAt?: string;
  password?: string;
  shareLink?: string;
}

export interface DocumentCollaborator extends UserModel {
  presence?: {
    lastActive: string;
    cursor?: {
      blockId: UUID;
      offset: number;
    };
    selection?: {
      start: {
        blockId: UUID;
        offset: number;
      };
      end: {
        blockId: UUID;
        offset: number;
      };
    };
  };
}

export interface DocumentRelation {
  sourceDocId: UUID;
  sourcePropertyId: string;
  targetDocId: UUID;
  targetPropertyId: string;
  type: "one_to_one" | "one_to_many" | "many_to_many";
}

export interface DocumentBacklink {
  sourceDocId: UUID;
  sourceBlockId: UUID;
  targetDocId: UUID;
  snippet: string;
  updatedAt: string;
}

export interface DocumentTemplate {
  id: UUID;
  title: string;
  emoji?: string;
  icon?: string;
  coverImage?: string;
  category: string;
  description: string;
  preview?: string;
  usageCount: number;
  blocks: DocBlock[];
}
