import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface ImageBlockProps {
  id: string;
  src: string;
  alt?: string;
  caption?: string;
  width?: string | number;
  height?: string | number;
  alignment?: "left" | "center" | "right" | "full";
  onUpdate: (id: string, src: string, metadata?: any) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  readOnly?: boolean;
  isSelected?: boolean;
}

export const ImageBlock: React.FC<ImageBlockProps> = ({
  id,
  src,
  alt = "",
  caption = "",
  width,
  height,
  alignment = "center",
  onUpdate,
  onFocus,
  onBlur,
  readOnly = false,
  isSelected = false,
}) => {
  const [localSrc, setLocalSrc] = useState<string>(src);
  const [localAlt, setLocalAlt] = useState<string>(alt);
  const [localCaption, setLocalCaption] = useState<string>(caption);
  const [localAlignment, setLocalAlignment] = useState<
    "left" | "center" | "right" | "full"
  >(alignment);
  const [localWidth, setLocalWidth] = useState<string | number | undefined>(
    width
  );
  const [localHeight, setLocalHeight] = useState<string | number | undefined>(
    height
  );
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [showMenu, setShowMenu] = useState<boolean>(false);

  const imageRef = useRef<HTMLImageElement>(null);
  const captionRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocalSrc(src);
    setLocalAlt(alt);
    setLocalCaption(caption);
    setLocalAlignment(alignment);
    setLocalWidth(width);
    setLocalHeight(height);
  }, [src, alt, caption, alignment, width, height]);

  // Handle image upload via file input
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Create a URL for the uploaded image
    const reader = new FileReader();
    reader.onload = (event) => {
      const newSrc = event.target?.result as string;
      setLocalSrc(newSrc);

      // Update the parent component
      onUpdate(id, newSrc, {
        alt: localAlt,
        caption: localCaption,
        width: localWidth,
        height: localHeight,
        alignment: localAlignment,
      });
    };
    reader.readAsDataURL(file);
  };

  // Handle image alignment change
  const handleAlignmentChange = (
    newAlignment: "left" | "center" | "right" | "full"
  ) => {
    setLocalAlignment(newAlignment);
    onUpdate(id, localSrc, {
      alt: localAlt,
      caption: localCaption,
      width: localWidth,
      height: localHeight,
      alignment: newAlignment,
    });
  };

  // Handle caption change
  const handleCaptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCaption = e.target.value;
    setLocalCaption(newCaption);
    onUpdate(id, localSrc, {
      alt: localAlt,
      caption: newCaption,
      width: localWidth,
      height: localHeight,
      alignment: localAlignment,
    });
  };

  // Handle alt text change
  const handleAltChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAlt = e.target.value;
    setLocalAlt(newAlt);
    onUpdate(id, localSrc, {
      alt: newAlt,
      caption: localCaption,
      width: localWidth,
      height: localHeight,
      alignment: localAlignment,
    });
  };

  // Handle image resize with mouse
  const startResize = (e: React.MouseEvent) => {
    e.preventDefault();
    if (readOnly) return;

    setIsResizing(true);

    const startX = e.clientX;
    const startWidth = imageRef.current?.offsetWidth || 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const currentX = e.clientX;
      const deltaX = currentX - startX;

      // Calculate new width based on delta (minimum 50px)
      const newWidth = Math.max(50, startWidth + deltaX);

      // Update width state
      setLocalWidth(newWidth);

      // Apply the new width to the image element
      if (imageRef.current) {
        imageRef.current.style.width = `${newWidth}px`;
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);

      // Update parent with final dimensions
      onUpdate(id, localSrc, {
        alt: localAlt,
        caption: localCaption,
        width: localWidth,
        height: localHeight,
        alignment: localAlignment,
      });

      // Remove event listeners
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    // Add event listeners for resize tracking
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // Handle paste from clipboard
  const handlePaste = async () => {
    try {
      const clipboardItems = await navigator.clipboard.read();

      for (const clipboardItem of clipboardItems) {
        for (const type of clipboardItem.types) {
          if (type.startsWith("image/")) {
            const blob = await clipboardItem.getType(type);
            const reader = new FileReader();

            reader.onload = (e) => {
              const newSrc = e.target?.result as string;
              setLocalSrc(newSrc);
              onUpdate(id, newSrc, {
                alt: localAlt,
                caption: localCaption,
                width: localWidth,
                height: localHeight,
                alignment: localAlignment,
              });
            };

            reader.readAsDataURL(blob);
            return;
          }
        }
      }

      alert("No image found in clipboard");
    } catch (err) {
      console.error("Failed to read clipboard contents:", err);
      alert("Could not access clipboard. Please check browser permissions.");
    }
  };

  // Generate container class based on alignment
  const containerClass = cn("my-4 relative group", {
    "mx-auto": localAlignment === "center",
    "ml-0 mr-auto": localAlignment === "left",
    "ml-auto mr-0": localAlignment === "right",
    "w-full": localAlignment === "full",
  });

  return (
    <div
      ref={containerRef}
      className={containerClass}
      onFocus={onFocus}
      onBlur={onBlur}
      style={{
        width:
          localAlignment === "full"
            ? "100%"
            : localWidth
            ? `${localWidth}px`
            : "auto",
      }}
    >
      {/* Image display */}
      {localSrc ? (
        <div className="relative">
          <Image
            ref={imageRef}
            src={localSrc}
            alt={localAlt}
            className={cn(
              "max-w-full",
              isSelected && "ring-2 ring-blue-500",
              localAlignment === "full" && "w-full"
            )}
            style={{
              width: localWidth ? `${localWidth}px` : "auto",
              height: localHeight ? `${localHeight}px` : "auto",
              cursor: isResizing ? "nwse-resize" : "default",
            }}
          />

          {/* Resize handle */}
          {isSelected && !readOnly && (
            <div
              className="absolute bottom-2 right-2 w-4 h-4 bg-white border border-gray-300 rounded-sm cursor-nwse-resize"
              onMouseDown={startResize}
            />
          )}
        </div>
      ) : (
        <div
          className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-md bg-gray-50 dark:bg-gray-800/50"
          onClick={() => fileInputRef.current?.click()}
        >
          <p className="text-gray-500 dark:text-gray-400 mb-2">
            Click to upload an image
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-sm">
            or paste from clipboard
          </p>
        </div>
      )}

      {/* Image caption */}
      {(isSelected || localCaption) && (
        <input
          ref={captionRef}
          type="text"
          value={localCaption}
          onChange={handleCaptionChange}
          placeholder="Add a caption..."
          className="mt-2 w-full text-center text-sm text-gray-500 dark:text-gray-400 bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-blue-500"
          disabled={readOnly}
        />
      )}

      {/* Alt text input (only visible when selected) */}
      {isSelected && !readOnly && (
        <input
          type="text"
          value={localAlt}
          onChange={handleAltChange}
          placeholder="Add alt text..."
          className="mt-1 w-full text-center text-xs text-gray-400 dark:text-gray-500 bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      )}

      {/* Action buttons */}
      {isSelected && !readOnly && (
        <div className="absolute top-2 right-2 bg-white dark:bg-gray-800 shadow-md rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center p-1">
            {/* Alignment buttons */}
            <button
              className={cn(
                "p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700",
                localAlignment === "left" && "bg-gray-100 dark:bg-gray-700"
              )}
              onClick={() => handleAlignmentChange("left")}
              title="Align left"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h10M4 18h16"
                />
              </svg>
            </button>

            <button
              className={cn(
                "p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700",
                localAlignment === "center" && "bg-gray-100 dark:bg-gray-700"
              )}
              onClick={() => handleAlignmentChange("center")}
              title="Align center"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M7 12h10M4 18h16"
                />
              </svg>
            </button>

            <button
              className={cn(
                "p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700",
                localAlignment === "right" && "bg-gray-100 dark:bg-gray-700"
              )}
              onClick={() => handleAlignmentChange("right")}
              title="Align right"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M10 12h10M4 18h16"
                />
              </svg>
            </button>

            <button
              className={cn(
                "p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700",
                localAlignment === "full" && "bg-gray-100 dark:bg-gray-700"
              )}
              onClick={() => handleAlignmentChange("full")}
              title="Full width"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {/* Change image button */}
            <button
              className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ml-1"
              onClick={() => fileInputRef.current?.click()}
              title="Change image"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
            </button>

            {/* Paste from clipboard button */}
            <button
              className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={handlePaste}
              title="Paste from clipboard"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Hidden file input for image upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileUpload}
        disabled={readOnly}
      />
    </div>
  );
};

export default ImageBlock;
