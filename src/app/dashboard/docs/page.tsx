"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Grid3X3,
  List,
  Clock,
  Star,
  FolderOpen,
  FileText,
  Filter,
} from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import EmptyState from "@/components/shared/EmptyState";

// Example document type - this would come from your types
interface Document {
  id: string;
  title: string;
  emoji?: string;
  coverImage?: string;
  updatedAt: Date;
  starred: boolean;
  createdBy: string;
  isTemplate: boolean;
  parentId?: string | null;
}

// Example documents - this would come from your API/Redux
const EXAMPLE_DOCS: Document[] = [
  {
    id: "doc1",
    title: "Getting Started Guide",
    emoji: "🚀",
    updatedAt: new Date(2025, 4, 10),
    starred: true,
    createdBy: "user1",
    isTemplate: false,
  },
  {
    id: "doc2",
    title: "Project Roadmap",
    coverImage: "/assets/images/roadmap-cover.jpg",
    updatedAt: new Date(2025, 4, 11),
    starred: false,
    createdBy: "user1",
    isTemplate: false,
  },
  {
    id: "doc3",
    title: "Meeting Notes Template",
    emoji: "📝",
    updatedAt: new Date(2025, 4, 5),
    starred: true,
    createdBy: "user1",
    isTemplate: true,
  },
];

export default function DocsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [documents, setDocuments] = useState<Document[]>(EXAMPLE_DOCS);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewType, setViewType] = useState("grid"); // grid or list
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading documents
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleCreateDoc = () => {
    // In production, you'd create a new doc in the backend first
    // Then navigate to it
    router.push(`/dashboard/docs/new-doc-id`);
  };

  const handleOpenDoc = (docId: string) => {
    router.push(`/dashboard/docs/${docId}`);
  };

  const filteredDocs = documents.filter((doc) =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const DocCard = ({ doc }: { doc: Document }) => (
    <div
      className="group relative flex flex-col rounded-lg border border-gray-200 hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-700 bg-white dark:bg-gray-950 overflow-hidden cursor-pointer transition-all hover:shadow-md"
      onClick={() => handleOpenDoc(doc.id)}
    >
      {/* Cover Image or Colored Header */}
      <div className="h-28 w-full bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 relative">
        {doc.coverImage && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${doc.coverImage})` }}
          />
        )}
        {/* Star Button */}
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-yellow-500 dark:text-gray-400 dark:hover:text-yellow-400"
          onClick={(e) => {
            e.stopPropagation();
            // Toggle star logic here
          }}
        >
          <Star
            className={`h-5 w-5 ${
              doc.starred ? "fill-yellow-400 text-yellow-400" : ""
            }`}
          />
        </button>
      </div>

      {/* Document Content */}
      <div className="flex-1 p-4">
        <div className="flex items-center mb-2">
          <span className="text-2xl mr-2">{doc.emoji}</span>
          <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">
            {doc.title}
          </h3>
        </div>
      </div>

      {/* Footer with metadata */}
      <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-800">
        Updated {doc.updatedAt.toLocaleDateString()}
      </div>
    </div>
  );

  const DocRow = ({ doc }: { doc: Document }) => (
    <div
      className="group flex items-center rounded-lg border border-transparent hover:border-gray-200 dark:hover:border-gray-800 bg-white dark:bg-gray-950 p-3 cursor-pointer transition-all"
      onClick={() => handleOpenDoc(doc.id)}
    >
      <div className="flex-shrink-0 mr-3 text-2xl">
        {doc.emoji || <FileText className="h-6 w-6 text-gray-400" />}
      </div>
      <div className="flex-1">
        <h3 className="font-medium text-gray-900 dark:text-gray-100">
          {doc.title}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Updated {doc.updatedAt.toLocaleDateString()}
        </p>
      </div>
      <button
        className="flex-shrink-0 text-gray-500 hover:text-yellow-500 dark:text-gray-400 dark:hover:text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => {
          e.stopPropagation();
          // Toggle star logic here
        }}
      >
        <Star
          className={`h-5 w-5 ${
            doc.starred ? "fill-yellow-400 text-yellow-400" : ""
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="container mx-auto py-6 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Documents
        </h1>
        <Button onClick={handleCreateDoc}>
          <Plus className="h-4 w-4 mr-2" />
          New Document
        </Button>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Select defaultValue="updated">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="updated">Last updated</SelectItem>
              <SelectItem value="created">Created date</SelectItem>
              <SelectItem value="alpha">Alphabetical</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex border rounded-md overflow-hidden">
            <button
              className={`p-2 ${
                viewType === "grid"
                  ? "bg-gray-100 dark:bg-gray-800"
                  : "bg-white dark:bg-gray-950"
              }`}
              onClick={() => setViewType("grid")}
            >
              <Grid3X3 className="h-5 w-5" />
            </button>
            <button
              className={`p-2 ${
                viewType === "list"
                  ? "bg-gray-100 dark:bg-gray-800"
                  : "bg-white dark:bg-gray-950"
              }`}
              onClick={() => setViewType("list")}
            >
              <List className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Documents</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="starred">Starred</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-28 bg-gray-200 dark:bg-gray-800 rounded-t-lg"></div>
                  <div className="h-24 bg-gray-100 dark:bg-gray-900 rounded-b-lg p-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded mb-2 w-3/4"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredDocs.length === 0 ? (
            <EmptyState
              icon={<FileText className="h-12 w-12" />}
              title="No documents found"
              description="Create a new document or try a different search."
              action={
                <Button onClick={handleCreateDoc}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Document
                </Button>
              }
            />
          ) : viewType === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDocs.map((doc) => (
                <DocCard key={doc.id} doc={doc} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {filteredDocs.map((doc) => (
                <DocRow key={doc.id} doc={doc} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="recent">
          {/* Similar to "all" but with filtered documents */}
          {/* You would filter by recently accessed docs here */}
        </TabsContent>

        <TabsContent value="starred">
          {/* Show only starred documents */}
          {viewType === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDocs
                .filter((doc) => doc.starred)
                .map((doc) => (
                  <DocCard key={doc.id} doc={doc} />
                ))}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {filteredDocs
                .filter((doc) => doc.starred)
                .map((doc) => (
                  <DocRow key={doc.id} doc={doc} />
                ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="templates">
          {/* Show only template documents */}
          {viewType === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDocs
                .filter((doc) => doc.isTemplate)
                .map((doc) => (
                  <DocCard key={doc.id} doc={doc} />
                ))}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {filteredDocs
                .filter((doc) => doc.isTemplate)
                .map((doc) => (
                  <DocRow key={doc.id} doc={doc} />
                ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
