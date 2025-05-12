"use client";

import { useState, useEffect } from "react";

// Interfaces for type safety
export interface DocumentBlock {
  id: string;
  type: "text" | "heading" | "list" | "code";
  content: string;
  metadata?: Record<string, any>;
}

export interface Document {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  // Add more document metadata as needed
}

export function useDocEditor(docId: string) {
  const [document, setDocument] = useState<Document | null>(null);
  const [blocks, setBlocks] = useState<DocumentBlock[]>([]);

  // Simulate fetching document from an API
  useEffect(() => {
    // In a real implementation, this would be an API call
    const fetchDocument = async () => {
      try {
        // Simulated document fetch
        const mockDocument: Document = {
          id: docId,
          title: "New Document",
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        // Simulated initial blocks
        const mockBlocks: DocumentBlock[] = [
          {
            id: "block1",
            type: "text",
            content: "Welcome to your new document",
          },
        ];

        setDocument(mockDocument);
        setBlocks(mockBlocks);
      } catch (error) {
        console.error("Failed to fetch document", error);
      }
    };

    fetchDocument();
  }, [docId]);

  const updateDocument = (updates: Partial<Document>) => {
    setDocument((prev) =>
      prev ? { ...prev, ...updates, updatedAt: new Date() } : null
    );
  };

  const addBlock = (block: Omit<DocumentBlock, "id">) => {
    const newBlock: DocumentBlock = {
      ...block,
      id: `block-${Date.now()}`, // Generate unique ID
    };
    setBlocks((prev) => [...prev, newBlock]);
  };

  const updateBlock = (blockId: string, updates: Partial<DocumentBlock>) => {
    setBlocks((prev) =>
      prev.map((block) =>
        block.id === blockId ? { ...block, ...updates } : block
      )
    );
  };

  const deleteBlock = (blockId: string) => {
    setBlocks((prev) => prev.filter((block) => block.id !== blockId));
  };

  const moveBlock = (blockId: string, targetIndex: number) => {
    setBlocks((prev) => {
      // Remove the block from its current position
      const blockToMove = prev.find((block) => block.id === blockId);
      if (!blockToMove) return prev;

      const filteredBlocks = prev.filter((block) => block.id !== blockId);

      // Insert the block at the target index
      filteredBlocks.splice(targetIndex, 0, blockToMove);

      return filteredBlocks;
    });
  };

  return {
    document,
    blocks,
    updateDocument,
    addBlock,
    updateBlock,
    deleteBlock,
    moveBlock,
  };
}
