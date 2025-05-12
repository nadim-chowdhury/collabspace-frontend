import React, { useState, useEffect } from "react";
import { X, Clock, Undo2, Download, FileText } from "lucide-react";

// Define types for version
export interface DocumentVersion {
  id: string;
  timestamp: Date;
  author: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  changes: string[];
  isCurrent: boolean;
}

interface VersionHistoryProps {
  documentId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function VersionHistory({
  documentId,
  isOpen,
  onClose,
}: VersionHistoryProps) {
  const [versions, setVersions] = useState<DocumentVersion[]>([]);
  const [selectedVersion, setSelectedVersion] =
    useState<DocumentVersion | null>(null);

  // Simulate fetching version history
  useEffect(() => {
    const fetchVersionHistory = async () => {
      // In a real app, this would be an API call
      const mockVersions: DocumentVersion[] = [
        {
          id: "v4",
          timestamp: new Date("2024-05-10T14:30:00"),
          author: {
            id: "1",
            name: "Alice Johnson",
            avatarUrl: "/api/placeholder/40/40?text=AJ",
          },
          changes: [
            "Added new section on project goals",
            "Fixed formatting in introduction",
          ],
          isCurrent: true,
        },
        {
          id: "v3",
          timestamp: new Date("2024-05-08T11:15:00"),
          author: {
            id: "2",
            name: "Bob Smith",
            avatarUrl: "/api/placeholder/40/40?text=BS",
          },
          changes: [
            "Restructured document outline",
            "Added initial draft of conclusions",
          ],
          isCurrent: false,
        },
        {
          id: "v2",
          timestamp: new Date("2024-05-05T09:45:00"),
          author: {
            id: "3",
            name: "Charlie Brown",
            avatarUrl: "/api/placeholder/40/40?text=CB",
          },
          changes: [
            "Initial document creation",
            "Added preliminary research notes",
          ],
          isCurrent: false,
        },
      ];

      setVersions(mockVersions);
      // Select the current version by default
      const currentVersion = mockVersions.find((v) => v.isCurrent);
      if (currentVersion) {
        setSelectedVersion(currentVersion);
      }
    };

    if (isOpen) {
      fetchVersionHistory();
    }
  }, [documentId, isOpen]);

  const handleRestoreVersion = (version: DocumentVersion) => {
    // Simulate restoring a previous version
    const confirmRestore = window.confirm(
      `Are you sure you want to restore version from ${version.timestamp.toLocaleString()}?`
    );

    if (confirmRestore) {
      // In a real app, this would be an API call to restore the version
      alert(`Restored version ${version.id}`);

      // Update versions to mark this as current
      setVersions((prev) =>
        prev.map((v) => ({
          ...v,
          isCurrent: v.id === version.id,
        }))
      );

      setSelectedVersion(version);
    }
  };

  const handleDownloadVersion = (version: DocumentVersion) => {
    // Simulate downloading a version
    alert(`Downloading version from ${version.timestamp.toLocaleString()}`);
    // In a real app, this would trigger a file download
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[800px] flex">
        {/* Sidebar - Version List */}
        <div className="w-1/3 border-r p-4 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold flex items-center">
              <Clock className="mr-2" /> Version History
            </h2>
            <button
              onClick={onClose}
              className="text-gray-600 hover:bg-gray-100 p-2 rounded-full"
            >
              <X size={20} />
            </button>
          </div>

          {versions.map((version) => (
            <div
              key={version.id}
              className={`p-3 mb-2 rounded-lg cursor-pointer flex items-center justify-between ${
                selectedVersion?.id === version.id
                  ? "bg-blue-100 border-blue-500"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => setSelectedVersion(version)}
            >
              <div className="flex items-center space-x-2">
                {version.author.avatarUrl ? (
                  <img
                    src={version.author.avatarUrl}
                    alt={version.author.name}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                    {version.author.name.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="font-medium">{version.author.name}</p>
                  <p className="text-xs text-gray-500">
                    {version.timestamp.toLocaleString()}
                  </p>
                </div>
              </div>
              {version.isCurrent && (
                <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">
                  Current
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Version Details */}
        {selectedVersion && (
          <div className="w-2/3 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">
                <FileText className="inline-block mr-2" />
                Version Details
              </h3>
              <div className="space-x-2">
                {!selectedVersion.isCurrent && (
                  <button
                    onClick={() => handleRestoreVersion(selectedVersion)}
                    className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
                  >
                    <Undo2 className="mr-2" /> Restore
                  </button>
                )}
                <button
                  onClick={() => handleDownloadVersion(selectedVersion)}
                  className="bg-gray-100 text-gray-800 px-4 py-2 rounded flex items-center"
                >
                  <Download className="mr-2" /> Download
                </button>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Changes:</h4>
              <ul className="list-disc list-inside">
                {selectedVersion.changes.map((change, index) => (
                  <li key={index} className="mb-1">
                    {change}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 text-sm text-gray-600">
              <p>
                <strong>Author:</strong> {selectedVersion.author.name}
              </p>
              <p>
                <strong>Timestamp:</strong>{" "}
                {selectedVersion.timestamp.toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
