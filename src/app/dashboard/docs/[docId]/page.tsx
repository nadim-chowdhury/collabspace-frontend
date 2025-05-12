"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronLeft,
  MoreHorizontal,
  Star,
  Clock,
  Share2,
  Download,
  Trash,
  History,
  Comments,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";

// This would be your actual editor component
// import Editor from "@/components/docs/core/Editor";
// Temporary placeholder for demonstration
const Editor = () => (
  <div className="min-h-[60vh] border rounded-md p-8 bg-white dark:bg-gray-900">
    {/* Sample content structure - would be replaced by your actual editor */}
    <h1
      className="text-3xl font-bold mb-4"
      contentEditable
      suppressContentEditableWarning
    >
      Untitled Document
    </h1>
    <p className="mb-4" contentEditable suppressContentEditableWarning>
      This is a basic example of a document. In a real implementation, this
      would be replaced by your block-based editor component.
    </p>
    <h2
      className="text-2xl font-bold mb-3 mt-6"
      contentEditable
      suppressContentEditableWarning
    >
      Getting Started
    </h2>
    <p className="mb-4" contentEditable suppressContentEditableWarning>
      Click anywhere to start editing. Press / to see the slash commands menu.
    </p>
    <ul className="list-disc pl-6 mb-4">
      <li className="mb-1" contentEditable suppressContentEditableWarning>
        Create pages and subpages
      </li>
      <li className="mb-1" contentEditable suppressContentEditableWarning>
        Add different content blocks
      </li>
      <li className="mb-1" contentEditable suppressContentEditableWarning>
        Format text and embed media
      </li>
    </ul>
  </div>
);

// Sample collaborator type
interface Collaborator {
  id: string;
  name: string;
  avatarUrl?: string;
  online: boolean;
  lastActivity?: Date;
}

// Mock data - would come from your API/state management
const sampleCollaborators: Collaborator[] = [
  {
    id: "user1",
    name: "You",
    avatarUrl: "/assets/avatars/user1.png",
    online: true,
  },
  {
    id: "user2",
    name: "Alex Johnson",
    avatarUrl: "/assets/avatars/user2.png",
    online: true,
  },
  {
    id: "user3",
    name: "Sam Chen",
    avatarUrl: "/assets/avatars/user3.png",
    online: false,
    lastActivity: new Date(),
  },
];

export default function DocumentPage() {
  const params = useParams();
  const router = useRouter();
  const docId = params.docId as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isStarred, setIsStarred] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date>(new Date());
  const [collaborators, setCollaborators] =
    useState<Collaborator[]>(sampleCollaborators);
  const [showComments, setShowComments] = useState(false);

  // Mock document breadcrumb path - would come from your API
  const breadcrumbPath = [
    { id: "workspace", name: "Workspace" },
    { id: "project-x", name: "Project X" },
    { id: docId, name: "Document" },
  ];

  useEffect(() => {
    // Simulate loading document data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [docId]);

  const handleBackToDocuments = () => {
    router.push("/dashboard/docs");
  };

  const handleViewHistory = () => {
    router.push(`/dashboard/docs/${docId}/history`);
  };

  const handleShareDocument = () => {
    router.push(`/dashboard/docs/${docId}/share`);
  };

  const handleMoveToTrash = () => {
    // Logic to move document to trash
    router.push(`/dashboard/docs/${docId}/trash`);
  };

  // Simulate autosave effect
  useEffect(() => {
    const interval = setInterval(() => {
      setLastSaved(new Date());
    }, 30000); // Save every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Document cover image - could be configurable
  const coverImage = "/assets/images/doc-cover.jpg"; // Default or document-specific

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Document Header */}
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            {/* Left side - Navigation */}
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBackToDocuments}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>

              <div className="hidden md:block ml-2">
                <Breadcrumb>
                  <BreadcrumbList>
                    {breadcrumbPath.map((item, index) => (
                      <BreadcrumbItem key={item.id}>
                        {index < breadcrumbPath.length - 1 ? (
                          <BreadcrumbLink
                            href={`/dashboard/docs/${
                              item.id !== "workspace" ? item.id : ""
                            }`}
                          >
                            {item.name}
                          </BreadcrumbLink>
                        ) : (
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {item.name}
                          </span>
                        )}
                        {index < breadcrumbPath.length - 1 && (
                          <BreadcrumbSeparator />
                        )}
                      </BreadcrumbItem>
                    ))}
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center space-x-1">
              {/* Last saved indicator */}
              <div className="hidden md:flex items-center text-xs text-gray-500 dark:text-gray-400 mr-4">
                <Clock className="h-3 w-3 mr-1" />
                Saved{" "}
                {lastSaved.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>

              {/* Comments toggle */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={showComments ? "default" : "ghost"}
                      size="icon"
                      onClick={() => setShowComments(!showComments)}
                    >
                      <Comments className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Toggle comments</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Star document */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsStarred(!isStarred)}
                    >
                      <Star
                        className={`h-4 w-4 ${
                          isStarred ? "fill-yellow-400 text-yellow-400" : ""
                        }`}
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {isStarred ? "Remove from starred" : "Add to starred"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* History button */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleViewHistory}
                    >
                      <History className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View history</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Share button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleShareDocument}
                className="ml-2"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>

              {/* More actions menu */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56" align="end">
                  <div className="grid gap-1">
                    <Button
                      variant="ghost"
                      className="flex items-center justify-start"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                    <Button
                      variant="ghost"
                      className="flex items-center justify-start"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Manage access
                    </Button>
                    <Button
                      variant="ghost"
                      className="flex items-center justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                      onClick={handleMoveToTrash}
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      Move to trash
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-3/4" />
          </div>
        ) : (
          <div className="flex">
            {/* Document editor - main content */}
            <div className="flex-1">
              {/* Cover image (optional) */}
              <div
                className="w-full h-48 bg-cover bg-center rounded-t-lg mb-6"
                style={{ backgroundImage: `url(${coverImage})` }}
              ></div>

              {/* Document title and content */}
              <div className="relative">
                {/* Collaborators bar */}
                <div className="absolute right-0 -top-16 flex items-center space-x-1">
                  {collaborators.map((user) => (
                    <TooltipProvider key={user.id}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Avatar
                            className={`h-8 w-8 border-2 ${
                              user.online
                                ? "border-green-500"
                                : "border-gray-200 dark:border-gray-700"
                            }`}
                          >
                            {user.avatarUrl ? (
                              <AvatarImage
                                src={user.avatarUrl}
                                alt={user.name}
                              />
                            ) : (
                              <AvatarFallback>
                                {user.name.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            )}
                          </Avatar>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            {user.name} {user.online ? "(online)" : "(offline)"}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>

                {/* Editor component */}
                <Editor />
              </div>
            </div>

            {/* Comments panel - conditionally shown */}
            {showComments && (
              <div className="w-80 ml-6 border-l border-gray-200 dark:border-gray-800 pl-6">
                <h3 className="text-lg font-medium mb-4">Comments</h3>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  No comments yet. Select text to add a comment.
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
