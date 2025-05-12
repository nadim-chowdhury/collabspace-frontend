import React from "react";
import { Home, ChevronRight } from "lucide-react";

// Define interfaces for workspace and document
export interface Workspace {
  id: string;
  name: string;
}

export interface Document {
  id: string;
  title: string;
  workspace?: Workspace;
  parentFolder?: {
    id: string;
    name: string;
  };
}

interface DocumentBreadcrumbProps {
  document: Document;
}

export function DocumentBreadcrumb({ document }: DocumentBreadcrumbProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600">
      {/* Workspace Link */}
      {document.workspace && (
        <>
          <a
            href={`/workspace/${document.workspace.id}`}
            className="flex items-center hover:text-blue-600 transition-colors"
          >
            <Home size={16} className="mr-1" />
            {document.workspace.name}
          </a>
          <ChevronRight size={16} className="text-gray-400" />
        </>
      )}

      {/* Parent Folder Link */}
      {document.parentFolder && (
        <>
          <a
            href={`/folder/${document.parentFolder.id}`}
            className="hover:text-blue-600 transition-colors"
          >
            {document.parentFolder.name}
          </a>
          <ChevronRight size={16} className="text-gray-400" />
        </>
      )}

      {/* Current Document */}
      <span className="font-semibold text-gray-800">{document.title}</span>
    </nav>
  );
}
