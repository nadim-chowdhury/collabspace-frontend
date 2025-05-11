"use client";

import { useState } from "react";
import DocSidebar from "@/components/docs/DocSidebar";
import Editor from "@/components/docs/Editor";

export default function DocsPage() {
  const [selectedDoc, setSelectedDoc] = useState("Project Plan");
  const [documents, setDocuments] = useState<Record<string, string>>({
    "Project Plan": "",
    "Meeting Notes": "",
    Roadmap: "",
  });

  const handleContentChange = (newContent: string) => {
    setDocuments((prev) => ({
      ...prev,
      [selectedDoc]: newContent,
    }));
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <DocSidebar
        documents={Object.keys(documents)}
        selected={selectedDoc}
        onSelect={setSelectedDoc}
      />
      <main className="flex-1 p-6 overflow-auto">
        <h1 className="text-2xl font-bold mb-4">{selectedDoc}</h1>
        <Editor
          content={documents[selectedDoc]}
          onChange={handleContentChange}
        />
      </main>
    </div>
  );
}
