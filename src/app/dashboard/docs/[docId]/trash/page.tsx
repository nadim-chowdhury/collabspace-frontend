import React, { useState, useCallback } from "react";
import { useRouter } from "next/router";
import { useDoc } from "@/hooks/docs/useDocs";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DeletedDocument {
  id: string;
  title: string;
  deletedAt: string;
  size: string;
}

export default function TrashPage() {
  const router = useRouter();
  const { docId } = router.query;

  const { document, isLoading, error, updateContent, updateTitle } = useDoc(
    docId as string
  );

  // Mock deleted documents and actions for demonstration
  const deletedDocuments: DeletedDocument[] = [
    {
      id: "1",
      title: "Document 1",
      deletedAt: "2025-05-10T12:00:00Z",
      size: "1 MB",
    },
    {
      id: "2",
      title: "Document 2",
      deletedAt: "2025-05-11T15:30:00Z",
      size: "2 MB",
    },
  ];

  const restoreDocument = (id: string) => {
    console.log(`Restoring document with id: ${id}`);
  };

  const permanentlyDeleteDocument = (id: string) => {
    console.log(`Permanently deleting document with id: ${id}`);
  };

  const emptyTrash = () => {
    console.log("Emptying trash");
  };

  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);

  const handleSelectDocument = useCallback((docId: string) => {
    setSelectedDocuments((prev) =>
      prev.includes(docId)
        ? prev.filter((id) => id !== docId)
        : [...prev, docId]
    );
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedDocuments.length === deletedDocuments.length) {
      setSelectedDocuments([]);
    } else {
      setSelectedDocuments(deletedDocuments.map((doc: any) => doc.id));
    }
  }, [selectedDocuments, deletedDocuments]);

  const handleRestoreSelected = useCallback(() => {
    selectedDocuments.forEach((docId) => {
      restoreDocument(docId);
    });
    setSelectedDocuments([]);
  }, [selectedDocuments]);

  const handlePermanentlyDeleteSelected = useCallback(() => {
    selectedDocuments.forEach((docId) => {
      permanentlyDeleteDocument(docId);
    });
    setSelectedDocuments([]);
  }, [selectedDocuments]);

  const handleEmptyTrash = useCallback(() => {
    if (
      window.confirm(
        "Are you sure you want to empty the trash? This action cannot be undone."
      )
    ) {
      emptyTrash();
    }
  }, []);

  if (isLoading) {
    return (
      <div className="p-6">
        <p>Loading deleted documents...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-500">
        <p>Error: {error.message}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Trash</h1>
        {deletedDocuments.length > 0 && (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={handleRestoreSelected}
              disabled={selectedDocuments.length === 0}
              aria-label="Restore selected documents"
            >
              Restore Selected
            </Button>
            <Button
              variant="destructive"
              onClick={handlePermanentlyDeleteSelected}
              disabled={selectedDocuments.length === 0}
              aria-label="Permanently delete selected documents"
            >
              Delete Selected
            </Button>
            <Button
              variant="destructive"
              onClick={handleEmptyTrash}
              aria-label="Empty trash"
            >
              Empty Trash
            </Button>
          </div>
        )}
      </div>

      {deletedDocuments.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>Your trash is empty</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={selectedDocuments.length === deletedDocuments.length}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all documents"
                />
              </TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Deleted Date</TableHead>
              <TableHead>Size</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {deletedDocuments.map((doc: any) => (
              <TableRow key={doc.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedDocuments.includes(doc.id)}
                    onCheckedChange={() => handleSelectDocument(doc.id)}
                    aria-label={`Select document ${doc.title}`}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <span>{doc.title}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {doc.deletedAt
                    ? new Date(doc.deletedAt).toLocaleString()
                    : "Unknown"}
                </TableCell>
                <TableCell>{doc.size}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => restoreDocument(doc.id)}
                      aria-label={`Restore document ${doc.title}`}
                    >
                      Restore
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => permanentlyDeleteDocument(doc.id)}
                      aria-label={`Delete document ${doc.title}`}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
