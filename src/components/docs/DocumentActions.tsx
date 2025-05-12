import React, { useState } from "react";
import {
  Share2,
  MoreVertical,
  Star,
  Copy,
  Trash2,
  Edit2,
  Sparkles,
} from "lucide-react";

// Define the Document type to match the expected structure
export interface Document {
  id: string;
  title: string;
  isFavorite?: boolean;
  // Add other relevant document properties
}

interface DocumentActionsProps {
  document: Document;
  onEdit: (updates: Partial<Document>) => void;
  canShare?: boolean;
  onOpenAIAssistant?: () => void;
  onOpenVersionHistory?: () => void;
}

export function DocumentActions({
  document,
  onEdit,
  canShare = false,
  onOpenAIAssistant,
  onOpenVersionHistory,
}: DocumentActionsProps) {
  const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState(false);

  const handleToggleFavorite = () => {
    onEdit({
      isFavorite: !document.isFavorite,
    });
  };

  const handleRename = () => {
    const newTitle = prompt("Enter new document name", document.title);
    if (newTitle && newTitle.trim()) {
      onEdit({ title: newTitle.trim() });
    }
  };

  const handleDuplicate = () => {
    // In a real app, this would call an API to create a copy
    alert(`Duplicating document: ${document.title}`);
  };

  const handleDelete = () => {
    // Add confirmation and actual deletion logic
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this document?"
    );
    if (confirmDelete) {
      // Implement delete logic
      alert(`Deleting document: ${document.title}`);
    }
  };

  return (
    <div className="relative flex items-center space-x-2">
      {/* AI Assistant Button */}
      {onOpenAIAssistant && (
        <button
          onClick={onOpenAIAssistant}
          className="text-blue-600 hover:bg-blue-100 p-2 rounded-full"
          title="AI Assistant"
        >
          <Sparkles size={20} />
        </button>
      )}

      {/* Version History Button */}
      {onOpenVersionHistory && (
        <button
          onClick={onOpenVersionHistory}
          className="text-gray-600 hover:bg-gray-100 p-2 rounded-full"
          title="Version History"
        >
          History
        </button>
      )}

      {/* Favorite Toggle */}
      <button
        onClick={handleToggleFavorite}
        className={`hover:bg-gray-100 p-2 rounded-full ${
          document.isFavorite ? "text-yellow-500" : "text-gray-600"
        }`}
        title={
          document.isFavorite ? "Remove from Favorites" : "Add to Favorites"
        }
      >
        <Star size={20} fill={document.isFavorite ? "currentColor" : "none"} />
      </button>

      {/* Share Button */}
      {canShare && (
        <button
          className="text-gray-600 hover:bg-gray-100 p-2 rounded-full"
          title="Share"
        >
          <Share2 size={20} />
        </button>
      )}

      {/* Options Dropdown */}
      <div className="relative">
        <button
          onClick={() => setIsOptionsMenuOpen(!isOptionsMenuOpen)}
          className="text-gray-600 hover:bg-gray-100 p-2 rounded-full"
          title="More Options"
        >
          <MoreVertical size={20} />
        </button>

        {isOptionsMenuOpen && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-white border rounded-md shadow-lg z-10">
            <button
              onClick={handleRename}
              className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100"
            >
              <Edit2 size={16} className="mr-2" /> Rename
            </button>
            <button
              onClick={handleDuplicate}
              className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100"
            >
              <Copy size={16} className="mr-2" /> Duplicate
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100 text-red-600"
            >
              <Trash2 size={16} className="mr-2" /> Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
