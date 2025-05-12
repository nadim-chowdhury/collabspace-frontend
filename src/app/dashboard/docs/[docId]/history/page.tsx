import { useState } from "react";
import { useDocumentHistory } from "@/hooks/docs/useDocumentHistory";
import { DocumentBreadcrumb } from "@/components/docs/DocumentBreadcrumb";
import { Button } from "@/components/ui/button";

export default function DocumentHistoryPage({
  params,
}: {
  params: { docId: string };
}) {
  const { docId } = params;
  const {
    document,
    versions,
    isLoading,
    error,
    restoreVersion,
    compareVersions,
  } = useDocumentHistory(docId);

  const [selectedVersions, setSelectedVersions] = useState<string[]>([]);

  const handleVersionSelect = (versionId: string) => {
    if (selectedVersions.includes(versionId)) {
      setSelectedVersions(selectedVersions.filter((id) => id !== versionId));
    } else if (selectedVersions.length < 2) {
      setSelectedVersions([...selectedVersions, versionId]);
    }
  };

  // Handle loading and error states
  if (isLoading) {
    return <div className="p-6">Loading document history...</div>;
  }

  if (error) {
    return (
      <div className="p-6 text-red-500">
        Error loading document history: {error.message}
      </div>
    );
  }

  if (!document) {
    return <div className="p-6">No document found.</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <DocumentBreadcrumb document={document} />
        <h1 className="text-2xl font-bold mt-2">Version History</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Version List */}
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">Versions</h2>
          {versions.length === 0 ? (
            <p className="text-gray-500">No version history available</p>
          ) : (
            versions.map((version) => (
              <div
                key={version.id}
                className={`p-3 mb-2 border rounded cursor-pointer ${
                  selectedVersions.includes(version.id)
                    ? "bg-blue-100 border-blue-300"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => handleVersionSelect(version.id)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{version.author}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(version.timestamp).toLocaleString()}
                    </p>
                  </div>
                  {selectedVersions.length === 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        restoreVersion(version.id);
                      }}
                    >
                      Restore
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
        {/* Version Comparison or Details */}
        <div className="border rounded-lg p-4">
          {selectedVersions.length === 2 ? (
            <div>
              <h2 className="text-lg font-semibold mb-4">Compare Versions</h2>
              {compareVersions(selectedVersions[0], selectedVersions[1])}
            </div>
          ) : selectedVersions.length === 1 ? (
            <div>
              <h2 className="text-lg font-semibold mb-4">Version Details</h2>
              <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
                {JSON.stringify(
                  versions.find((v) => v.id === selectedVersions[0]),
                  null,
                  2
                )}
              </pre>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              Select one or two versions to view details or compare
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
