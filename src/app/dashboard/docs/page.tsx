"use client";

import { useState } from "react";
import { useDocEditor } from "@/hooks/docs/useDocEditor";
import { useDocPermissions } from "@/hooks/docs/useDocPermissions";
import { Editor } from "@/components/docs/core/Editor";
import { DocumentActions } from "@/components/docs/DocumentActions";
import { DocumentBreadcrumb } from "@/components/docs/DocumentBreadcrumb";
import { AIAssistant } from "@/components/docs/ai/AIAssistant";
import { CollaboratorsBar } from "@/components/docs/collaboration/CollaboratorsBar";
import { VersionHistory } from "@/components/docs/ui/VersionHistory";

export default function DocumentPage({
  params,
}: {
  params: { docId: string };
}) {
  const { docId } = params;

  const {
    document,
    blocks,
    updateDocument,
    addBlock,
    updateBlock,
    deleteBlock,
    moveBlock,
  } = useDocEditor(docId);

  const { canEdit, canComment, canShare } = useDocPermissions(docId);

  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [isVersionHistoryOpen, setIsVersionHistoryOpen] = useState(false);

  if (!document) {
    return <div>Loading document...</div>;
  }

  return (
    <div className="flex flex-col h-full">
      {/* Document Header */}
      <div className="p-4 border-b flex justify-between items-center">
        <DocumentBreadcrumb document={document} />
        <DocumentActions
          document={document}
          onEdit={updateDocument}
          canShare={canShare}
          onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
          onOpenVersionHistory={() => setIsVersionHistoryOpen(true)}
        />
      </div>

      {/* Collaborators Bar */}
      <CollaboratorsBar documentId={docId} />

      {/* Main Editor */}
      <div className="flex-1 overflow-y-auto p-6">
        <Editor
          blocks={blocks}
          onAddBlock={addBlock}
          onUpdateBlock={updateBlock}
          onDeleteBlock={deleteBlock}
          onMoveBlock={moveBlock}
          readOnly={!canEdit}
          canComment={canComment}
        />
      </div>

      {/* AI Assistant Modal */}
      {isAIAssistantOpen && (
        <AIAssistant
          documentId={docId}
          isOpen={isAIAssistantOpen}
          onClose={() => setIsAIAssistantOpen(false)}
        />
      )}

      {/* Version History Modal */}
      {isVersionHistoryOpen && (
        <VersionHistory
          documentId={docId}
          isOpen={isVersionHistoryOpen}
          onClose={() => setIsVersionHistoryOpen(false)}
        />
      )}
    </div>
  );
}
