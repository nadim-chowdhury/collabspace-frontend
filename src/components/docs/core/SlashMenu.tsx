// import React, { useState, useEffect, useRef } from "react";
// import { BlockType } from "@/types/document";
// import { cn } from "@/lib/utils";

// interface SlashMenuProps {
//   position: { x: number; y: number };
//   onSelect: (blockType: BlockType) => void;
//   onClose: () => void;
//   filter: string;
//   onFilterChange: (filter: string) => void;
// }

// interface CommandOption {
//   type: BlockType;
//   label: string;
//   description: string;
//   icon: React.ReactNode;
// }

// /**
//  * SlashMenu component for selecting block types in the editor
//  */
// const SlashMenu: React.FC<SlashMenuProps> = ({
//   position,
//   onSelect,
//   onClose,
//   filter,
//   onFilterChange,
// }) => {
//   const [selectedIndex, setSelectedIndex] = useState(0);
//   const menuRef = useRef<HTMLDivElement>(null);
//   const inputRef = useRef<HTMLInputElement>(null);

//   // Define available commands
//   const commands: CommandOption[] = [
//     {
//       type: "text",
//       label: "Text",
//       description: "Just start writing with plain text",
//       icon: <span className="text-lg">T</span>,
//     },
//     {
//       type: "heading",
//       label: "Heading 1",
//       description: "Big section heading",
//       icon: <span className="text-xl font-bold">H1</span>,
//     },
//     {
//       type: "heading",
//       label: "Heading 2",
//       description: "Medium section heading",
//       icon: <span className="text-lg font-bold">H2</span>,
//     },
//     {
//       type: "heading",
//       label: "Heading 3",
//       description: "Small section heading",
//       icon: <span className="text-base font-bold">H3</span>,
//     },
//     {
//       type: "list-item",
//       label: "Bulleted List",
//       description: "Create a simple bulleted list",
//       icon: <span className="text-lg">•</span>,
//     },
//     {
//       type: "list-item",
//       label: "Numbered List",
//       description: "Create a numbered list",
//       icon: <span className="text-lg">1.</span>,
//     },
//     {
//       type: "toggle",
//       label: "Toggle List",
//       description: "Toggles to show and hide content",
//       icon: <span className="text-lg">▸</span>,
//     },
//     {
//       type: "divider",
//       label: "Divider",
//       description: "Visual separator between blocks",
//       icon: <span className="text-lg">―</span>,
//     },
//     {
//       type: "code",
//       label: "Code",
//       description: "Code snippets with syntax highlighting",
//       icon: <span className="text-lg">{`</>`}</span>,
//     },
//   ];

//   // Filter commands based on search input
//   const filteredCommands = commands.filter(
//     (command) =>
//       command.label.toLowerCase().includes(filter.toLowerCase()) ||
//       command.description.toLowerCase().includes(filter.toLowerCase())
//   );

//   // Focus input when menu opens
//   useEffect(() => {
//     setTimeout(() => {
//       inputRef.current?.focus();
//     }, 10);
//   }, []);

//   // Handle click outside to close menu
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
//         onClose();
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [onClose]);

//   // Handle keyboard navigation
//   const handleKeyDown = (e: React.KeyboardEvent) => {
//     switch (e.key) {
//       case "ArrowDown":
//         e.preventDefault();
//         setSelectedIndex((prevIndex) =>
//           prevIndex < filteredCommands.length - 1 ? prevIndex + 1 : prevIndex
//         );
//         break;
//       case "ArrowUp":
//         e.preventDefault();
//         setSelectedIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
//         break;
//       case "Enter":
//         e.preventDefault();
//         if (filteredCommands[selectedIndex]) {
//           onSelect(filteredCommands[selectedIndex].type);
//         }
//         break;
//       case "Escape":
//         e.preventDefault();
//         onClose();
//         break;
//       case "/":
//         // Prevent re-triggering slash menu
//         e.stopPropagation();
//         break;
//       default:
//         break;
//     }
//   };

//   // Handle input change
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     onFilterChange(e.target.value);
//     setSelectedIndex(0); // Reset selection on filter change
//   };

//   // Calculate menu position
//   const menuStyle: React.CSSProperties = {
//     position: "absolute",
//     left: `${position.x}px`,
//     top: `${position.y + 5}px`,
//     zIndex: 1000,
//   };

//   return (
//     <div
//       ref={menuRef}
//       className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg overflow-hidden w-64"
//       style={menuStyle}
//       onKeyDown={handleKeyDown}
//     >
//       <div className="p-2 border-b border-gray-200 dark:border-gray-700">
//         <input
//           ref={inputRef}
//           type="text"
//           className="w-full p-1 text-sm bg-transparent outline-none"
//           placeholder="Type to filter..."
//           value={filter}
//           onChange={handleInputChange}
//         />
//       </div>

//       <div className="max-h-60 overflow-y-auto">
//         {filteredCommands.length > 0 ? (
//           filteredCommands.map((command, index) => (
//             <div
//               key={`${command.type}-${command.label}`}
//               className={cn(
//                 "flex items-start p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800",
//                 selectedIndex === index && "bg-gray-100 dark:bg-gray-800"
//               )}
//               onClick={() => onSelect(command.type)}
//               onMouseEnter={() => setSelectedIndex(index)}
//             >
//               <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded mr-2">
//                 {command.icon}
//               </div>
//               <div>
//                 <div className="font-medium">{command.label}</div>
//                 <div className="text-xs text-gray-500 dark:text-gray-400">
//                   {command.description}
//                 </div>
//               </div>
//             </div>
//           ))
//         ) : (
//           <div className="p-3 text-center text-gray-500 dark:text-gray-400">
//             No commands found
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SlashMenu;


import React, { useState, useEffect, useRef } from "react";
import { BlockType } from "@/types/models/docBlock";

interface SlashCommand {
  name: string;
  type: BlockType;
  icon: string; // In real implementation, we'd use proper icons
  description: string;
}

interface SlashMenuProps {
  position: { x: number; y: number };
  query: string;
  onSelect: (type: BlockType) => void;
  onClose: () => void;
}

const SlashMenu: React.FC<SlashMenuProps> = ({
  position,
  query,
  onSelect,
  onClose,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  // List of available commands
  const commands: SlashCommand[] = [
    {
      name: "Text",
      type: "text",
      icon: "T",
      description: "Just start writing with plain text.",
    },
    {
      name: "Heading 1",
      type: "heading_1",
      icon: "H1",
      description: "Big section heading.",
    },
    {
      name: "Heading 2",
      type: "heading_2",
      icon: "H2",
      description: "Medium section heading.",
    },
    {
      name: "Heading 3",
      type: "heading_3",
      icon: "H3",
      description: "Small section heading.",
    },
    {
      name: "Bulleted List",
      type: "bulleted_list",
      icon: "•",
      description: "Create a simple bulleted list.",
    },
    {
      name: "Numbered List",
      type: "numbered_list",
      icon: "1.",
      description: "Create a list with numbering.",
    },
    {
      name: "Checklist",
      type: "checklist",
      icon: "☑",
      description: "Track tasks with a to-do list.",
    },
    {
      name: "Toggle",
      type: "toggle",
      icon: "▸",
      description: "Collapsible content block.",
    },
    {
      name: "Code",
      type: "code",
      icon: "<>",
      description: "Capture a code snippet.",
    },
  ];

  // Filter commands based on search query
  const filteredCommands = query
    ? commands.filter(
        (cmd) =>
          cmd.name.toLowerCase().includes(query.toLowerCase()) ||
          cmd.description.toLowerCase().includes(query.toLowerCase())
      )
    : commands;

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.stopPropagation();

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < filteredCommands.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
          break;
        case "Enter":
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            onSelect(filteredCommands[selectedIndex].type);
          }
          break;
        case "Escape":
          e.preventDefault();
          onClose();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, filteredCommands, onSelect, onClose]);

  // Scroll selected item into view
  useEffect(() => {
    if (menuRef.current) {
      const selectedElement = menuRef.current.querySelector(
        `[data-index="${selectedIndex}"]`
      );
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: "nearest" });
      }
    }
  }, [selectedIndex]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // Reset selected index when filtered results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  if (filteredCommands.length === 0) {
    return (
      <div
        ref={menuRef}
        className="slash-menu"
        style={{
          position: "absolute",
          left: position.x,
          top: position.y,
          backgroundColor: "#fff",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          borderRadius: "4px",
          width: "300px",
          maxHeight: "400px",
          overflow: "auto",
          zIndex: 1000,
          border: "1px solid #e2e8f0",
        }}
      >
        <div
          className="no-results"
          style={{ padding: "12px", color: "#6b7280" }}
        >
          No results found
        </div>
      </div>
    );
  }

  return (
    <div
      ref={menuRef}
      className="slash-menu"
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        backgroundColor: "#fff",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        borderRadius: "4px",
        width: "300px",
        maxHeight: "400px",
        overflow: "auto",
        zIndex: 1000,
        border: "1px solid #e2e8f0",
      }}
    >
      {query && (
        <div
          className="search-header"
          style={{ padding: "8px 12px", borderBottom: "1px solid #e2e8f0" }}
        >
          Results for "{query}"
        </div>
      )}

      <div className="commands-list">
        {filteredCommands.map((command, index) => (
          <div
            key={command.type}
            data-index={index}
            className={`command-item ${
              selectedIndex === index ? "selected" : ""
            }`}
            style={{
              padding: "8px 12px",
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              backgroundColor:
                selectedIndex === index ? "#f1f5f9" : "transparent",
            }}
            onClick={() => onSelect(command.type)}
            onMouseEnter={() => setSelectedIndex(index)}
          >
            <div
              className="command-icon"
              style={{
                width: "24px",
                height: "24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "12px",
                backgroundColor: "#e2e8f0",
                borderRadius: "4px",
                fontSize: "14px",
              }}
            >
              {command.icon}
            </div>
            <div className="command-details" style={{ flex: 1 }}>
              <div className="command-name" style={{ fontWeight: 500 }}>
                {command.name}
              </div>
              <div
                className="command-description"
                style={{ fontSize: "12px", color: "#6b7280" }}
              >
                {command.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SlashMenu;