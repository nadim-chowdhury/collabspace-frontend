"use client";

import { useState, useEffect } from "react";

// Enum for user roles
export enum UserRole {
  OWNER = "owner",
  EDITOR = "editor",
  COMMENTER = "commenter",
  VIEWER = "viewer",
}

export interface DocumentPermissions {
  userId: string;
  role: UserRole;
}

export function useDocPermissions(docId: string) {
  const [permissions, setPermissions] = useState<DocumentPermissions | null>(
    null
  );

  useEffect(() => {
    // In a real implementation, this would be an API call to fetch permissions
    const fetchPermissions = async () => {
      try {
        // Simulated permissions fetch
        // In a real app, this would come from an authentication/authorization service
        const mockPermissions: DocumentPermissions = {
          userId: "current-user-id",
          role: UserRole.EDITOR, // Default to editor for demonstration
        };

        setPermissions(mockPermissions);
      } catch (error) {
        console.error("Failed to fetch document permissions", error);
      }
    };

    fetchPermissions();
  }, [docId]);

  // Derive permission flags based on user's role
  const canEdit =
    permissions?.role === UserRole.OWNER ||
    permissions?.role === UserRole.EDITOR;

  const canComment =
    permissions?.role === UserRole.OWNER ||
    permissions?.role === UserRole.EDITOR ||
    permissions?.role === UserRole.COMMENTER;

  const canShare = permissions?.role === UserRole.OWNER;

  return {
    canEdit,
    canComment,
    canShare,
    userRole: permissions?.role,
  };
}
