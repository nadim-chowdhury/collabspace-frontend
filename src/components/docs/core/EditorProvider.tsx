// import React, {
//   createContext,
//   useContext,
//   useReducer,
//   useEffect,
//   useMemo,
//   useCallback,
// } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { v4 as uuidv4 } from "uuid";
// import { useParams } from "next/navigation";
// import { useSocket } from "@/hooks/useSocket";
// import { useDebounce } from "@/hooks/useDebounce";
// import { updateDoc, fetchDoc } from "@/redux/slices/docSlice";
// import { BlockType, Block, DocumentData } from "@/types/document";

// // Types for editor state and context
// interface EditorState {
//   blocks: Block[];
//   selectedBlockId: string | null;
//   focusedBlockId: string | null;
//   isDirty: boolean;
//   isLoading: boolean;
//   error: string | null;
//   docTitle: string;
//   collaborators: {
//     id: string;
//     name: string;
//     avatar: string;
//     cursorPosition: { blockId: string; offset: number } | null;
//   }[];
// }

// interface EditorAction {
//   type: string;
//   payload?: any;
// }

// interface EditorContextType {
//   state: EditorState;
//   addBlock: (type: BlockType, content?: any, position?: number) => void;
//   updateBlock: (id: string, content: any) => void;
//   deleteBlock: (id: string) => void;
//   moveBlock: (id: string, direction: "up" | "down") => void;
//   splitBlock: (id: string, offset: number) => void;
//   mergeBlocks: (targetId: string, sourceId: string) => void;
//   selectBlock: (id: string | null) => void;
//   focusBlock: (id: string | null) => void;
//   setDocTitle: (title: string) => void;
//   convertBlockType: (id: string, newType: BlockType) => void;
//   indentBlock: (id: string) => void;
//   outdentBlock: (id: string) => void;
// }

// // Initial state for the editor
// const initialState: EditorState = {
//   blocks: [],
//   selectedBlockId: null,
//   focusedBlockId: null,
//   isDirty: false,
//   isLoading: true,
//   error: null,
//   docTitle: "Untitled",
//   collaborators: [],
// };

// // Create the context
// const EditorContext = createContext<EditorContextType | undefined>(undefined);

// // Reducer for handling editor state
// const editorReducer = (
//   state: EditorState,
//   action: EditorAction
// ): EditorState => {
//   switch (action.type) {
//     case "SET_DOCUMENT":
//       return {
//         ...state,
//         blocks: action.payload.blocks || [],
//         docTitle: action.payload.title || "Untitled",
//         isLoading: false,
//         error: null,
//         isDirty: false,
//       };

//     case "SET_LOADING":
//       return {
//         ...state,
//         isLoading: action.payload,
//       };

//     case "SET_ERROR":
//       return {
//         ...state,
//         error: action.payload,
//         isLoading: false,
//       };

//     case "ADD_BLOCK": {
//       const { type, content, position } = action.payload;
//       const newBlock: Block = {
//         id: uuidv4(),
//         type,
//         content: content || getDefaultContentForType(type),
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString(),
//         indent: 0,
//       };

//       const newBlocks = [...state.blocks];

//       if (position !== undefined) {
//         newBlocks.splice(position, 0, newBlock);
//       } else if (state.selectedBlockId) {
//         // Add after the selected block
//         const selectedIndex = newBlocks.findIndex(
//           (block) => block.id === state.selectedBlockId
//         );
//         if (selectedIndex >= 0) {
//           newBlocks.splice(selectedIndex + 1, 0, newBlock);
//         } else {
//           newBlocks.push(newBlock);
//         }
//       } else {
//         newBlocks.push(newBlock);
//       }

//       return {
//         ...state,
//         blocks: newBlocks,
//         selectedBlockId: newBlock.id,
//         focusedBlockId: newBlock.id,
//         isDirty: true,
//       };
//     }

//     case "UPDATE_BLOCK": {
//       const { id, content } = action.payload;
//       const newBlocks = state.blocks.map((block) =>
//         block.id === id
//           ? { ...block, content, updatedAt: new Date().toISOString() }
//           : block
//       );

//       return {
//         ...state,
//         blocks: newBlocks,
//         isDirty: true,
//       };
//     }

//     case "DELETE_BLOCK": {
//       const blockId = action.payload;
//       const blockIndex = state.blocks.findIndex(
//         (block) => block.id === blockId
//       );

//       if (blockIndex === -1 || state.blocks.length <= 1) {
//         return state; // Don't delete if it's the only block
//       }

//       const newBlocks = [...state.blocks];
//       newBlocks.splice(blockIndex, 1);

//       // Select the previous or next block
//       const newSelectedId =
//         newBlocks[blockIndex - 1]?.id || newBlocks[blockIndex]?.id || null;

//       return {
//         ...state,
//         blocks: newBlocks,
//         selectedBlockId: newSelectedId,
//         focusedBlockId: newSelectedId,
//         isDirty: true,
//       };
//     }

//     case "MOVE_BLOCK": {
//       const { id, direction } = action.payload;
//       const blockIndex = state.blocks.findIndex((block) => block.id === id);

//       if (
//         blockIndex === -1 ||
//         (direction === "up" && blockIndex === 0) ||
//         (direction === "down" && blockIndex === state.blocks.length - 1)
//       ) {
//         return state;
//       }

//       const newBlocks = [...state.blocks];
//       const blockToMove = newBlocks[blockIndex];
//       const offset = direction === "up" ? -1 : 1;

//       // Swap blocks
//       newBlocks.splice(blockIndex, 1);
//       newBlocks.splice(blockIndex + offset, 0, blockToMove);

//       return {
//         ...state,
//         blocks: newBlocks,
//         isDirty: true,
//       };
//     }

//     case "SPLIT_BLOCK": {
//       const { id, offset } = action.payload;
//       const blockIndex = state.blocks.findIndex((block) => block.id === id);

//       if (blockIndex === -1) {
//         return state;
//       }

//       const currentBlock = state.blocks[blockIndex];
//       const currentContent = currentBlock.content;

//       // Only split text blocks for now
//       if (
//         currentBlock.type !== "text" &&
//         currentBlock.type !== "heading" &&
//         currentBlock.type !== "list-item"
//       ) {
//         return state;
//       }

//       const firstHalf = currentContent.text.substring(0, offset);
//       const secondHalf = currentContent.text.substring(offset);

//       const updatedCurrentBlock = {
//         ...currentBlock,
//         content: { ...currentContent, text: firstHalf },
//         updatedAt: new Date().toISOString(),
//       };

//       const newBlock: Block = {
//         id: uuidv4(),
//         type: currentBlock.type,
//         content: { ...currentContent, text: secondHalf },
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString(),
//         indent: currentBlock.indent,
//       };

//       const newBlocks = [...state.blocks];
//       newBlocks[blockIndex] = updatedCurrentBlock;
//       newBlocks.splice(blockIndex + 1, 0, newBlock);

//       return {
//         ...state,
//         blocks: newBlocks,
//         selectedBlockId: newBlock.id,
//         focusedBlockId: newBlock.id,
//         isDirty: true,
//       };
//     }

//     case "MERGE_BLOCKS": {
//       const { targetId, sourceId } = action.payload;
//       const targetIndex = state.blocks.findIndex(
//         (block) => block.id === targetId
//       );
//       const sourceIndex = state.blocks.findIndex(
//         (block) => block.id === sourceId
//       );

//       if (targetIndex === -1 || sourceIndex === -1) {
//         return state;
//       }

//       const targetBlock = state.blocks[targetIndex];
//       const sourceBlock = state.blocks[sourceIndex];

//       // Only merge compatible block types
//       if (!areBlockTypesCompatible(targetBlock.type, sourceBlock.type)) {
//         return state;
//       }

//       // Merge content (simplified for text blocks)
//       const mergedContent = mergeBlockContent(targetBlock, sourceBlock);

//       const updatedTargetBlock = {
//         ...targetBlock,
//         content: mergedContent,
//         updatedAt: new Date().toISOString(),
//       };

//       const newBlocks = [...state.blocks];
//       newBlocks[targetIndex] = updatedTargetBlock;
//       newBlocks.splice(sourceIndex, 1);

//       return {
//         ...state,
//         blocks: newBlocks,
//         selectedBlockId: targetId,
//         focusedBlockId: targetId,
//         isDirty: true,
//       };
//     }

//     case "SELECT_BLOCK":
//       return {
//         ...state,
//         selectedBlockId: action.payload,
//       };

//     case "FOCUS_BLOCK":
//       return {
//         ...state,
//         focusedBlockId: action.payload,
//       };

//     case "SET_DOC_TITLE":
//       return {
//         ...state,
//         docTitle: action.payload,
//         isDirty: true,
//       };

//     case "CONVERT_BLOCK_TYPE": {
//       const { id, newType } = action.payload;
//       const blockIndex = state.blocks.findIndex((block) => block.id === id);

//       if (blockIndex === -1) {
//         return state;
//       }

//       const block = state.blocks[blockIndex];
//       const convertedContent = convertBlockContent(
//         block.content,
//         block.type,
//         newType
//       );

//       const updatedBlock: Block = {
//         ...block,
//         type: newType,
//         content: convertedContent,
//         updatedAt: new Date().toISOString(),
//       };

//       const newBlocks = [...state.blocks];
//       newBlocks[blockIndex] = updatedBlock;

//       return {
//         ...state,
//         blocks: newBlocks,
//         isDirty: true,
//       };
//     }

//     case "INDENT_BLOCK": {
//       const blockId = action.payload;
//       const blockIndex = state.blocks.findIndex(
//         (block) => block.id === blockId
//       );

//       if (blockIndex <= 0) {
//         return state; // Can't indent first block
//       }

//       const prevBlock = state.blocks[blockIndex - 1];
//       const currentBlock = state.blocks[blockIndex];

//       // Only allow indent if previous block has same or more indent
//       if (prevBlock.indent < currentBlock.indent + 1) {
//         const maxIndent = 3; // Limit indentation level
//         const newBlocks = [...state.blocks];
//         newBlocks[blockIndex] = {
//           ...currentBlock,
//           indent: Math.min(currentBlock.indent + 1, maxIndent),
//           updatedAt: new Date().toISOString(),
//         };

//         return {
//           ...state,
//           blocks: newBlocks,
//           isDirty: true,
//         };
//       }

//       return state;
//     }

//     case "OUTDENT_BLOCK": {
//       const blockId = action.payload;
//       const blockIndex = state.blocks.findIndex(
//         (block) => block.id === blockId
//       );

//       if (blockIndex === -1) {
//         return state;
//       }

//       const currentBlock = state.blocks[blockIndex];

//       // Only outdent if indent > 0
//       if (currentBlock.indent > 0) {
//         const newBlocks = [...state.blocks];
//         newBlocks[blockIndex] = {
//           ...currentBlock,
//           indent: currentBlock.indent - 1,
//           updatedAt: new Date().toISOString(),
//         };

//         return {
//           ...state,
//           blocks: newBlocks,
//           isDirty: true,
//         };
//       }

//       return state;
//     }

//     case "SET_COLLABORATORS":
//       return {
//         ...state,
//         collaborators: action.payload,
//       };

//     case "UPDATE_COLLABORATOR_CURSOR": {
//       const { userId, position } = action.payload;
//       const newCollaborators = state.collaborators.map((c) =>
//         c.id === userId ? { ...c, cursorPosition: position } : c
//       );

//       return {
//         ...state,
//         collaborators: newCollaborators,
//       };
//     }

//     default:
//       return state;
//   }
// };

// // Helper functions
// const getDefaultContentForType = (type: BlockType) => {
//   switch (type) {
//     case "text":
//       return { text: "", format: {} };
//     case "heading":
//       return { text: "", level: 2, format: {} };
//     case "list-item":
//       return { text: "", checked: false, format: {} };
//     case "toggle":
//       return { text: "", isOpen: false, children: [], format: {} };
//     default:
//       return { text: "", format: {} };
//   }
// };

// const areBlockTypesCompatible = (
//   type1: BlockType,
//   type2: BlockType
// ): boolean => {
//   // For now, only allowing merge of same block types
//   return type1 === type2;
// };

// const mergeBlockContent = (targetBlock: Block, sourceBlock: Block) => {
//   // Simple merge for text-based blocks
//   if (
//     targetBlock.type === "text" ||
//     targetBlock.type === "heading" ||
//     targetBlock.type === "list-item"
//   ) {
//     return {
//       ...targetBlock.content,
//       text: targetBlock.content.text + sourceBlock.content.text,
//     };
//   }

//   // For toggle blocks, merge the content and append the children
//   if (targetBlock.type === "toggle") {
//     return {
//       ...targetBlock.content,
//       text: targetBlock.content.text + sourceBlock.content.text,
//       children: [
//         ...targetBlock.content.children,
//         ...sourceBlock.content.children,
//       ],
//     };
//   }

//   return targetBlock.content;
// };

// const convertBlockContent = (
//   content: any,
//   fromType: BlockType,
//   toType: BlockType
// ) => {
//   // Handle common conversions
//   switch (toType) {
//     case "text":
//       return { text: content.text || "", format: content.format || {} };
//     case "heading":
//       return {
//         text: content.text || "",
//         level: 2,
//         format: content.format || {},
//       };
//     case "list-item":
//       return {
//         text: content.text || "",
//         checked: false,
//         format: content.format || {},
//       };
//     case "toggle":
//       return {
//         text: content.text || "",
//         isOpen: false,
//         children: [],
//         format: content.format || {},
//       };
//     default:
//       return content;
//   }
// };

// // EditorProvider component
// export const EditorProvider: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const [state, dispatch] = useReducer(editorReducer, initialState);
//   const reduxDispatch = useDispatch();
//   const { docId } = useParams<{ docId: string }>();
//   const socket = useSocket();
//   const debouncedState = useDebounce(state, 1000);

//   // Fetch document on mount
//   useEffect(() => {
//     if (!docId) return;

//     dispatch({ type: "SET_LOADING", payload: true });

//     // Fetch document from Redux
//     reduxDispatch(fetchDoc(docId))
//       .unwrap()
//       .then((doc: DocumentData) => {
//         dispatch({
//           type: "SET_DOCUMENT",
//           payload: {
//             blocks: doc.blocks || [createDefaultBlock()],
//             title: doc.title,
//           },
//         });
//       })
//       .catch((error: any) => {
//         console.error("Failed to fetch document:", error);
//         dispatch({ type: "SET_ERROR", payload: error.message });

//         // Create a default document with one empty text block
//         dispatch({
//           type: "SET_DOCUMENT",
//           payload: {
//             blocks: [createDefaultBlock()],
//             title: "Untitled",
//           },
//         });
//       });
//   }, [docId, reduxDispatch]);

//   // Save changes when state changes
//   useEffect(() => {
//     if (!docId || !debouncedState.isDirty) return;

//     const docData = {
//       id: docId,
//       title: debouncedState.docTitle,
//       blocks: debouncedState.blocks,
//       updatedAt: new Date().toISOString(),
//     };

//     reduxDispatch(updateDoc(docData));

//     // Emit socket event for real-time collaboration
//     if (socket) {
//       socket.emit("doc:update", {
//         docId,
//         blocks: debouncedState.blocks,
//         title: debouncedState.docTitle,
//       });
//     }
//   }, [debouncedState, docId, reduxDispatch, socket]);

//   // Socket event listeners for real-time collaboration
//   useEffect(() => {
//     if (!socket || !docId) return;

//     const handleDocUpdate = (data: any) => {
//       if (data.docId !== docId) return;

//       dispatch({
//         type: "SET_DOCUMENT",
//         payload: {
//           blocks: data.blocks,
//           title: data.title,
//         },
//       });
//     };

//     const handleCollaboratorJoin = (data: any) => {
//       if (data.docId !== docId) return;
//       dispatch({ type: "SET_COLLABORATORS", payload: data.collaborators });
//     };

//     const handleCollaboratorLeave = (data: any) => {
//       if (data.docId !== docId) return;
//       dispatch({ type: "SET_COLLABORATORS", payload: data.collaborators });
//     };

//     const handleCursorUpdate = (data: any) => {
//       if (data.docId !== docId) return;
//       dispatch({
//         type: "UPDATE_COLLABORATOR_CURSOR",
//         payload: { userId: data.userId, position: data.position },
//       });
//     };

//     socket.on("doc:update", handleDocUpdate);
//     socket.on("collaborator:join", handleCollaboratorJoin);
//     socket.on("collaborator:leave", handleCollaboratorLeave);
//     socket.on("cursor:update", handleCursorUpdate);

//     // Join the document room
//     socket.emit("doc:join", { docId });

//     return () => {
//       socket.off("doc:update", handleDocUpdate);
//       socket.off("collaborator:join", handleCollaboratorJoin);
//       socket.off("collaborator:leave", handleCollaboratorLeave);
//       socket.off("cursor:update", handleCursorUpdate);

//       // Leave the document room
//       socket.emit("doc:leave", { docId });
//     };
//   }, [socket, docId]);

//   // Create action functions
//   const addBlock = useCallback(
//     (type: BlockType, content?: any, position?: number) => {
//       dispatch({
//         type: "ADD_BLOCK",
//         payload: { type, content, position },
//       });
//     },
//     []
//   );

//   const updateBlock = useCallback((id: string, content: any) => {
//     dispatch({
//       type: "UPDATE_BLOCK",
//       payload: { id, content },
//     });
//   }, []);

//   const deleteBlock = useCallback((id: string) => {
//     dispatch({
//       type: "DELETE_BLOCK",
//       payload: id,
//     });
//   }, []);

//   const moveBlock = useCallback((id: string, direction: "up" | "down") => {
//     dispatch({
//       type: "MOVE_BLOCK",
//       payload: { id, direction },
//     });
//   }, []);

//   const splitBlock = useCallback((id: string, offset: number) => {
//     dispatch({
//       type: "SPLIT_BLOCK",
//       payload: { id, offset },
//     });
//   }, []);

//   const mergeBlocks = useCallback((targetId: string, sourceId: string) => {
//     dispatch({
//       type: "MERGE_BLOCKS",
//       payload: { targetId, sourceId },
//     });
//   }, []);

//   const selectBlock = useCallback((id: string | null) => {
//     dispatch({
//       type: "SELECT_BLOCK",
//       payload: id,
//     });
//   }, []);

//   const focusBlock = useCallback((id: string | null) => {
//     dispatch({
//       type: "FOCUS_BLOCK",
//       payload: id,
//     });
//   }, []);

//   const setDocTitle = useCallback((title: string) => {
//     dispatch({
//       type: "SET_DOC_TITLE",
//       payload: title,
//     });
//   }, []);

//   const convertBlockType = useCallback((id: string, newType: BlockType) => {
//     dispatch({
//       type: "CONVERT_BLOCK_TYPE",
//       payload: { id, newType },
//     });
//   }, []);

//   const indentBlock = useCallback((id: string) => {
//     dispatch({
//       type: "INDENT_BLOCK",
//       payload: id,
//     });
//   }, []);

//   const outdentBlock = useCallback((id: string) => {
//     dispatch({
//       type: "OUTDENT_BLOCK",
//       payload: id,
//     });
//   }, []);

//   // Create a default block
//   const createDefaultBlock = (): Block => ({
//     id: uuidv4(),
//     type: "text",
//     content: { text: "", format: {} },
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//     indent: 0,
//   });

//   // Memoize the context value
//   const contextValue = useMemo(
//     () => ({
//       state,
//       addBlock,
//       updateBlock,
//       deleteBlock,
//       moveBlock,
//       splitBlock,
//       mergeBlocks,
//       selectBlock,
//       focusBlock,
//       setDocTitle,
//       convertBlockType,
//       indentBlock,
//       outdentBlock,
//     }),
//     [
//       state,
//       addBlock,
//       updateBlock,
//       deleteBlock,
//       moveBlock,
//       splitBlock,
//       mergeBlocks,
//       selectBlock,
//       focusBlock,
//       setDocTitle,
//       convertBlockType,
//       indentBlock,
//       outdentBlock,
//     ]
//   );

//   return (
//     <EditorContext.Provider value={contextValue}>
//       {children}
//     </EditorContext.Provider>
//   );
// };

// // Custom hook for using the editor context
// export const useEditor = () => {
//   const context = useContext(EditorContext);
//   if (context === undefined) {
//     throw new Error("useEditor must be used within an EditorProvider");
//   }
//   return context;
// };

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { v4 as uuidv4 } from "uuid"; // You'll need to install this package
import { Block, BlockId, TextBlock } from "@/types/models/docBlock";

// Define the Editor Context interface
interface EditorContextType {
  // Document state
  blocks: Block[];
  currentBlockId: BlockId | null;

  // Block operations
  addBlock: (blockType: Block["type"], afterId?: BlockId) => BlockId;
  updateBlock: (
    blockId: BlockId,
    updates: Partial<Omit<Block, "id" | "type">>
  ) => void;
  deleteBlock: (blockId: BlockId) => void;

  // Selection operations
  setCurrentBlock: (blockId: BlockId | null) => void;
  moveBlockUp: (blockId: BlockId) => void;
  moveBlockDown: (blockId: BlockId) => void;

  // Document operations
  saveDocument: () => Promise<void>;
}

// Create the context with a default undefined value
const EditorContext = createContext<EditorContextType | undefined>(undefined);

// Props for the EditorProvider component
interface EditorProviderProps {
  children: ReactNode;
  initialBlocks?: Block[];
  documentId?: string;
}

export const EditorProvider: React.FC<EditorProviderProps> = ({
  children,
  initialBlocks = [],
  documentId,
}) => {
  // State for blocks and current selection
  const [blocks, setBlocks] = useState<Block[]>(
    initialBlocks.length > 0 ? initialBlocks : [createDefaultBlock()]
  );
  const [currentBlockId, setCurrentBlockId] = useState<BlockId | null>(
    initialBlocks.length > 0 ? initialBlocks[0].id : blocks[0].id
  );

  // Create a default text block
  function createDefaultBlock(): TextBlock {
    return {
      id: uuidv4(),
      type: "text",
      content: [{ text: "" }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      parentId: null,
    };
  }

  // Create a new block of specified type
  const addBlock = useCallback(
    (blockType: Block["type"], afterId?: BlockId): BlockId => {
      const now = new Date().toISOString();
      let newBlock: Block;

      // Create a new block based on type
      // For now, we'll just handle text blocks and use the default for others
      switch (blockType) {
        case "text":
          newBlock = {
            id: uuidv4(),
            type: "text",
            content: [{ text: "" }],
            createdAt: now,
            updatedAt: now,
            parentId: null,
          };
          break;
        default:
          // For demo purposes, default to text block
          newBlock = {
            id: uuidv4(),
            type: blockType,
            content: [{ text: "" }], // This will cause TypeScript errors for some block types
            createdAt: now,
            updatedAt: now,
            parentId: null,
          } as any; // Using 'any' temporarily until we implement all block types
      }

      setBlocks((prevBlocks) => {
        if (!afterId) {
          // Add to the end if no position specified
          return [...prevBlocks, newBlock];
        }

        // Otherwise insert after the specified block
        const index = prevBlocks.findIndex((block) => block.id === afterId);
        if (index === -1) return [...prevBlocks, newBlock];

        const newBlocks = [...prevBlocks];
        newBlocks.splice(index + 1, 0, newBlock);
        return newBlocks;
      });

      return newBlock.id;
    },
    []
  );

  // Update an existing block
  const updateBlock = useCallback(
    (blockId: BlockId, updates: Partial<Omit<Block, "id" | "type">>) => {
      setBlocks((prevBlocks) =>
        prevBlocks.map((block) =>
          block.id === blockId
            ? {
                ...block,
                ...updates,
                updatedAt: new Date().toISOString(),
              }
            : block
        )
      );
    },
    []
  );

  // Delete a block
  const deleteBlock = useCallback(
    (blockId: BlockId) => {
      setBlocks((prevBlocks) => {
        // Don't delete if it's the only block
        if (prevBlocks.length <= 1) return prevBlocks;

        const index = prevBlocks.findIndex((block) => block.id === blockId);
        if (index === -1) return prevBlocks;

        const newBlocks = [...prevBlocks];
        newBlocks.splice(index, 1);

        // Select the previous block or the next one if this was the first block
        if (currentBlockId === blockId) {
          const newIndex = Math.max(0, index - 1);
          setCurrentBlockId(newBlocks[newIndex].id);
        }

        return newBlocks;
      });
    },
    [currentBlockId]
  );

  // Move a block up in the list
  const moveBlockUp = useCallback((blockId: BlockId) => {
    setBlocks((prevBlocks) => {
      const index = prevBlocks.findIndex((block) => block.id === blockId);
      if (index <= 0) return prevBlocks; // Already at the top

      const newBlocks = [...prevBlocks];
      const temp = newBlocks[index];
      newBlocks[index] = newBlocks[index - 1];
      newBlocks[index - 1] = temp;

      return newBlocks;
    });
  }, []);

  // Move a block down in the list
  const moveBlockDown = useCallback((blockId: BlockId) => {
    setBlocks((prevBlocks) => {
      const index = prevBlocks.findIndex((block) => block.id === blockId);
      if (index === -1 || index >= prevBlocks.length - 1) return prevBlocks; // Not found or already at bottom

      const newBlocks = [...prevBlocks];
      const temp = newBlocks[index];
      newBlocks[index] = newBlocks[index + 1];
      newBlocks[index + 1] = temp;

      return newBlocks;
    });
  }, []);

  // Save the document (placeholder for now)
  const saveDocument = useCallback(async () => {
    console.log("Saving document:", { documentId, blocks });
    // In a real implementation, this would save to your backend
    return Promise.resolve();
  }, [documentId, blocks]);

  // The context value
  const value: EditorContextType = {
    blocks,
    currentBlockId,
    addBlock,
    updateBlock,
    deleteBlock,
    setCurrentBlock: setCurrentBlockId,
    moveBlockUp,
    moveBlockDown,
    saveDocument,
  };

  return (
    <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
  );
};

// Custom hook to use the editor context
export const useEditor = (): EditorContextType => {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error("useEditor must be used within an EditorProvider");
  }
  return context;
};