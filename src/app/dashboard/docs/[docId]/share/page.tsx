import React, { useState } from "react";
import { useDocPermissions } from "@/hooks/docs/useDocPermissions";
import { DocumentBreadcrumb } from "@/components/docs/DocumentBreadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function DocumentSharePage({
  params,
}: {
  params: { docId: string };
}) {
  const { docId } = params;
  const {
    document,
    shareDocument,
    getShareLink,
    getCurrentShares,
    updateSharePermission,
    revokeShare,
  } = useDocPermissions(docId);

  const [newShareEmail, setNewShareEmail] = useState("");
  const [newSharePermission, setNewSharePermission] = useState("view");

  const handleShareDocument = () => {
    if (newShareEmail) {
      shareDocument(newShareEmail, newSharePermission);
      setNewShareEmail("");
      setNewSharePermission("view");
    }
  };

  const handleCopyShareLink = () => {
    const shareLink = getShareLink();
    navigator.clipboard.writeText(shareLink);
  };

  if (!document) {
    return <div>Loading document sharing...</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <DocumentBreadcrumb document={document} />
        <h1 className="text-2xl font-bold mt-2">Share Document</h1>
      </div>

      {/* Share Link Section */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-4">Share Link</h2>
        <div className="flex space-x-2">
          <Input value={getShareLink()} readOnly className="flex-1" />
          <Button onClick={handleCopyShareLink}>Copy Link</Button>
        </div>
      </div>

      {/* Share with People Section */}
      <div className="bg-white p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-4">Share with People</h2>
        <div className="flex space-x-2 mb-4">
          <Input
            placeholder="Enter email to share"
            value={newShareEmail}
            onChange={(e) => setNewShareEmail(e.target.value)}
            className="flex-1"
          />
          <Select
            value={newSharePermission}
            onValueChange={setNewSharePermission}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Permissions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="view">View</SelectItem>
              <SelectItem value="edit">Edit</SelectItem>
              <SelectItem value="comment">Comment</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleShareDocument}>Share</Button>
        </div>
      </div>

      {/* Current Shares Section */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Current Shares</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {getCurrentShares().map((share: any) => (
              <TableRow key={share.email}>
                <TableCell>{share.email}</TableCell>
                <TableCell>
                  <Select
                    value={share.permission}
                    onValueChange={(value) =>
                      updateSharePermission(share.email, value)
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder={share.permission} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="view">View</SelectItem>
                      <SelectItem value="edit">Edit</SelectItem>
                      <SelectItem value="comment">Comment</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => revokeShare(share.email)}
                  >
                    Revoke
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
