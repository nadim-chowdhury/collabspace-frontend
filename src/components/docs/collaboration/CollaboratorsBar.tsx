import React, { useState, useEffect } from "react";
import { UserPlus, UserCheck, UserX, MoreHorizontal } from "lucide-react";
import Image from "next/image";

// Define types for collaborator
export interface Collaborator {
  id: string;
  name: string;
  email: string;
  role: "owner" | "editor" | "viewer";
  status: "online" | "offline" | "away";
  avatarUrl?: string;
}

interface CollaboratorsBarProps {
  documentId: string;
}

export function CollaboratorsBar({ documentId }: CollaboratorsBarProps) {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");

  // Simulate fetching collaborators
  useEffect(() => {
    const fetchCollaborators = async () => {
      // In a real app, this would be an API call
      const mockCollaborators: Collaborator[] = [
        {
          id: "1",
          name: "Alice Johnson",
          email: "alice@example.com",
          role: "owner",
          status: "online",
          avatarUrl: "/api/placeholder/40/40?text=AJ",
        },
        {
          id: "2",
          name: "Bob Smith",
          email: "bob@example.com",
          role: "editor",
          status: "away",
          avatarUrl: "/api/placeholder/40/40?text=BS",
        },
        {
          id: "3",
          name: "Charlie Brown",
          email: "charlie@example.com",
          role: "viewer",
          status: "offline",
          avatarUrl: "/api/placeholder/40/40?text=CB",
        },
      ];

      setCollaborators(mockCollaborators);
    };

    fetchCollaborators();
  }, [documentId]);

  const handleInvite = () => {
    if (!inviteEmail.trim()) return;

    // Simulate invite logic
    const newCollaborator: Collaborator = {
      id: `temp-${Date.now()}`,
      name: inviteEmail.split("@")[0],
      email: inviteEmail,
      role: "viewer", // Default to viewer
      status: "offline",
      avatarUrl: "/api/placeholder/40/40?text=NI", // New Invite
    };

    setCollaborators((prev) => [...prev, newCollaborator]);
    setInviteEmail("");
    setIsInviteModalOpen(false);

    // In a real app, this would be an API call to send invite
    alert(`Invitation sent to ${inviteEmail}`);
  };

  //   const handleRemoveCollaborator = (collaboratorId: string) => {
  //     // Simulate removing collaborator
  //     setCollaborators((prev) =>
  //       prev.filter((collab) => collab.id !== collaboratorId)
  //     );

  //     // In a real app, this would be an API call
  //     alert(`Removed collaborator with ID: ${collaboratorId}`);
  //   };

  const getStatusColor = (status: Collaborator["status"]) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "away":
        return "bg-yellow-500";
      case "offline":
        return "bg-gray-500";
    }
  };

  return (
    <div className="bg-white border-b p-2 flex items-center space-x-2">
      {/* Collaborator Avatars */}
      <div className="flex -space-x-2">
        {collaborators.map((collaborator) => (
          <div
            key={collaborator.id}
            className="relative"
            title={`${collaborator.name} (${collaborator.role})`}
          >
            {collaborator.avatarUrl ? (
              <Image
                src={collaborator.avatarUrl}
                alt={collaborator.name}
                className="w-8 h-8 rounded-full border-2 border-white"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white">
                {collaborator.name.charAt(0)}
              </div>
            )}
            {/* Status Indicator */}
            <span
              className={`absolute bottom-0 right-0 w-2 h-2 rounded-full ${getStatusColor(
                collaborator.status
              )}`}
            />
          </div>
        ))}
      </div>

      {/* Invite Button */}
      <button
        onClick={() => setIsInviteModalOpen(true)}
        className="text-blue-600 hover:bg-blue-100 p-2 rounded-full"
        title="Invite Collaborators"
      >
        <UserPlus size={20} />
      </button>

      {/* Invite Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Invite Collaborators</h2>
            <div className="flex space-x-2 mb-4">
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="Enter email to invite"
                className="flex-1 p-2 border rounded"
              />
              <button
                onClick={handleInvite}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Invite
              </button>
            </div>
            <button
              onClick={() => setIsInviteModalOpen(false)}
              className="text-gray-600 hover:bg-gray-100 p-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
