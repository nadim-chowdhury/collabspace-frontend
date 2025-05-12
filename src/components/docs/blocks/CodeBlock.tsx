import React, { useState, useEffect, useRef } from "react";
import { useBlockOperations } from "@/hooks/docs/useBlockOperations";
import { cn } from "@/lib/utils";

// List of supported languages
const SUPPORTED_LANGUAGES = [
  "javascript",
  "typescript",
  "jsx",
  "tsx",
  "html",
  "css",
  "scss",
  "python",
  "rust",
  "go",
  "java",
  "c",
  "cpp",
  "csharp",
  "php",
  "ruby",
  "swift",
  "kotlin",
  "sql",
  "json",
  "yaml",
  "markdown",
  "bash",
  "plaintext",
];

interface CodeBlockProps {
  id: string;
  content: string;
  language?: string;
  caption?: string;
  onUpdate: (id: string, content: string, metadata?: any) => void;
  onKeyDown?: (e: React.KeyboardEvent, id: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  readOnly?: boolean;
  isSelected?: boolean;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  id,
  content,
  language = "plaintext",
  caption = "",
  onUpdate,
  onKeyDown,
  onFocus,
  onBlur,
  readOnly = false,
  isSelected = false,
}) => {
  const [localContent, setLocalContent] = useState<string>(content);
  const [localLanguage, setLocalLanguage] = useState<string>(language);
  const [localCaption, setLocalCaption] = useState<string>(caption);
  const [showLanguageSelector, setShowLanguageSelector] =
    useState<boolean>(false);
  const { splitBlock } = useBlockOperations();
  const codeRef = useRef<HTMLPreElement>(null);
  const captionRef = useRef<HTMLInputElement>(null);

  // Update local state when props change
  useEffect(() => {
    setLocalContent(content);
    setLocalLanguage(language);
    setLocalCaption(caption);
  }, [content, language, caption]);

  // Handle code content changes
  const handleContentChange = (e: React.FormEvent<HTMLPreElement>) => {
    const newContent = e.currentTarget.textContent || "";
    setLocalContent(newContent);
    onUpdate(id, newContent, {
      language: localLanguage,
      caption: localCaption,
    });
  };

  // Handle language changes
  const handleLanguageChange = (newLanguage: string) => {
    setLocalLanguage(newLanguage);
    setShowLanguageSelector(false);
    onUpdate(id, localContent, {
      language: newLanguage,
      caption: localCaption,
    });
  };

  // Handle caption changes
  const handleCaptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCaption = e.target.value;
    setLocalCaption(newCaption);
    onUpdate(id, localContent, {
      language: localLanguage,
      caption: newCaption,
    });
  };

  // Handle special keyboard commands
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Tab key inside code block should insert spaces instead of changing focus
    if (e.key === "Tab") {
      e.preventDefault();

      // Get current selection
      const selection = window.getSelection();
      const range = selection?.getRangeAt(0);

      if (range) {
        // Insert 2 spaces at cursor position
        const spaces = "  ";
        const textNode = document.createTextNode(spaces);
        range.insertNode(textNode);

        // Move cursor after the inserted spaces
        range.setStartAfter(textNode);
        range.collapse(true);
        selection?.removeAllRanges();
        selection?.addRange(range);

        // Update content
        const newContent = codeRef.current?.textContent || "";
        setLocalContent(newContent);
        onUpdate(id, newContent, {
          language: localLanguage,
          caption: localCaption,
        });
      }
      return;
    }

    // Escape key to exit code editing mode
    if (e.key === "Escape") {
      codeRef.current?.blur();
      return;
    }

    // Forward the event to parent if needed
    if (onKeyDown) {
      onKeyDown(e, id);
    }
  };

  // Copy code to clipboard
  const handleCopyCode = () => {
    if (localContent) {
      navigator.clipboard.writeText(localContent);
      // Could show a temporary success message here
    }
  };

  return (
    <div className="my-2">
      <div className="rounded-md overflow-hidden border border-gray-200 dark:border-gray-700">
        {/* Code block header */}
        <div className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <button
                className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                onClick={() => setShowLanguageSelector((prev) => !prev)}
                disabled={readOnly}
              >
                {localLanguage || "plaintext"}
              </button>

              {/* Language selector dropdown */}
              {showLanguageSelector && (
                <div className="absolute z-10 mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto">
                  <div className="py-1">
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <button
                        key={lang}
                        className={cn(
                          "block px-4 py-2 text-sm w-full text-left",
                          lang === localLanguage
                            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                            : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                        )}
                        onClick={() => handleLanguageChange(lang)}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Copy code button */}
          <button
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            onClick={handleCopyCode}
          >
            Copy
          </button>
        </div>

        {/* Code content */}
        <pre
          ref={codeRef}
          contentEditable={!readOnly}
          suppressContentEditableWarning
          className={cn(
            "px-4 py-3 bg-gray-50 dark:bg-gray-900 overflow-auto text-sm font-mono",
            "focus:outline-none focus:ring-1 focus:ring-blue-500 focus:ring-opacity-50",
            "whitespace-pre"
          )}
          onInput={handleContentChange}
          onKeyDown={handleKeyDown}
          onFocus={onFocus}
          onBlur={onBlur}
          spellCheck={false}
          data-language={localLanguage}
        >
          {localContent}
        </pre>
      </div>

      {/* Caption input */}
      {(isSelected || localCaption) && (
        <div className="mt-1 flex justify-center">
          <input
            ref={captionRef}
            type="text"
            value={localCaption}
            onChange={handleCaptionChange}
            placeholder="Add caption..."
            className="text-sm text-center text-gray-500 dark:text-gray-400 w-full bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-blue-500 focus:ring-opacity-50"
            disabled={readOnly}
          />
        </div>
      )}
    </div>
  );
};

export default CodeBlock;
