import { useState, useEffect, useCallback } from "react";
import { useSocket } from "../useSocket";

// Define types for document operations
export type DocOperation = {
  type: "insert" | "delete" | "update";
  path: string[];
  value?: any;
  index?: number;
  oldValue?: any;
};

export type DocContent = {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
  createdAt: string;
  createdBy?: {
    id: string;
    name: string;
  };
};

// Mock API functions (replace with real API calls)
const api = {
  getDocument: async (id: string): Promise<DocContent> => {
    // In a real app, this would be an API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id,
          title: "Fetched Document",
          content: "<p>Document content from API</p>",
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        });
      }, 300);
    });
  },
  saveDocument: async (doc: Partial<DocContent>): Promise<DocContent> => {
    // In a real app, this would be an API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: doc.id || "new-id",
          title: doc.title || "Untitled",
          content: doc.content || "",
          updatedAt: new Date().toISOString(),
          createdAt: doc.createdAt || new Date().toISOString(),
        });
      }, 300);
    });
  },
};

export function useDoc(docId: string | null) {
  const [document, setDocument] = useState<DocContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [collaborators, setCollaborators] = useState<
    { id: string; name: string }[]
  >([]);

  const socket = useSocket();

  // Load document
  useEffect(() => {
    let isMounted = true;

    const loadDocument = async () => {
      if (!docId) {
        setDocument(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const doc = await api.getDocument(docId);
        if (isMounted) {
          setDocument(doc);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error ? err : new Error("Failed to load document")
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadDocument();

    return () => {
      isMounted = false;
    };
  }, [docId]);

  // Set up socket for collaborative editing
  useEffect(() => {
    if (!socket || !docId) return;

    // Join document room
    socket.emit("join_document", docId);

    // Listen for operations from other users
    const handleDocOperation = (
      operation: DocOperation & { docId: string }
    ) => {
      if (operation.docId !== docId) return;

      setDocument((prevDoc) => {
        if (!prevDoc) return null;

        // Simplified operation handling
        switch (operation.type) {
          case "update":
            const updatedDoc = { ...prevDoc };

            // Deep update for nested paths
            let target = updatedDoc as any;
            const pathParts = operation.path;

            for (let i = 0; i < pathParts.length - 1; i++) {
              target = target[pathParts[i]];
            }

            target[pathParts[pathParts.length - 1]] = operation.value;

            return {
              ...updatedDoc,
              updatedAt: new Date().toISOString(),
            };

          default:
            return prevDoc;
        }
      });
    };

    // Listen for collaborator updates
    const handleCollaboratorsUpdate = (
      users: { id: string; name: string }[]
    ) => {
      setCollaborators(users);
    };

    socket.on("doc_operation", handleDocOperation);
    socket.on("collaborators_update", handleCollaboratorsUpdate);

    // Clean up listeners when component unmounts
    return () => {
      socket.off("doc_operation", handleDocOperation);
      socket.off("collaborators_update", handleCollaboratorsUpdate);
      socket.emit("leave_document", docId);
    };
  }, [socket, docId]);

  // Update document content
  const updateContent = useCallback(
    async (newContent: string) => {
      if (!document) return;

      // Optimistically update local state
      const optimisticUpdate = {
        ...document,
        content: newContent,
        updatedAt: new Date().toISOString(),
      };

      setDocument(optimisticUpdate);

      // Emit change to other collaborators
      if (socket) {
        socket.emit("doc_operation", {
          docId,
          operation: {
            type: "update",
            path: ["content"],
            value: newContent,
          },
        });
      }

      // Save to server (debounced in a real app)
      setIsSaving(true);

      try {
        const savedDoc = await api.saveDocument({
          id: document.id,
          title: document.title,
          content: newContent,
        });

        // Update with server response
        setDocument(savedDoc);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to save document")
        );

        // Revert on error
        setDocument(document);
      } finally {
        setIsSaving(false);
      }
    },
    [document, docId, socket]
  );

  // Update document title
  const updateTitle = useCallback(
    async (newTitle: string) => {
      if (!document) return;

      // Optimistically update local state
      const optimisticUpdate = {
        ...document,
        title: newTitle,
        updatedAt: new Date().toISOString(),
      };

      setDocument(optimisticUpdate);

      // Emit change to other collaborators
      if (socket) {
        socket.emit("doc_operation", {
          docId,
          operation: {
            type: "update",
            path: ["title"],
            value: newTitle,
          },
        });
      }

      // Save to server
      setIsSaving(true);

      try {
        const savedDoc = await api.saveDocument({
          id: document.id,
          title: newTitle,
          content: document.content,
        });

        // Update with server response
        setDocument(savedDoc);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to save document")
        );

        // Revert on error
        setDocument(document);
      } finally {
        setIsSaving(false);
      }
    },
    [document, docId, socket]
  );

  return {
    document,
    isLoading,
    error,
    isSaving,
    collaborators,
    updateContent,
    updateTitle,
  };
}
