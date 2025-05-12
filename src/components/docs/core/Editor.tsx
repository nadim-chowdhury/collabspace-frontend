import React, { useEffect, useRef, useState, KeyboardEvent } from 'react';
import { useEditor } from './EditorProvider';
import BlockRenderer from './core/BlockRenderer';
import SlashMenu from './core/SlashMenu';
import { BlockType } from '@/types/document';
import { cn } from '@/lib/utils';
import { useParams } from 'next/navigation';
import CollaboratorsBar from './collaboration/CollaboratorsBar';

interface EditorProps {
  className?: string;
}

/**
 * Main document editor component that handles rendering blocks and managing editor interactions
 */
const Editor: React.FC<EditorProps> = ({ className }) => {
  const {
    state,
    addBlock,
    deleteBlock,
    selectBlock,
    focusBlock,
    updateBlock,
    splitBlock,
    mergeBlocks,
    indentBlock,
    outdentBlock,
  }
  
  // Render the editor with blocks
  return (
    <div 
      className={cn("editor-container max-w-4xl mx-auto py-8 px-4", className)}
      ref={editorRef}
      onKeyDown={handleKeyDown}
    >
      {/* Document title */}
      <div className="mb-8">
        <h1
          className="text-4xl font-bold outline-none"
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => {
            const newTitle = e.currentTarget.textContent || 'Untitled';
            if (newTitle !== docTitle) {
              // setDocTitle from context
              // This is already defined in the EditorProvider
            }
          }}
          dangerouslySetInnerHTML={{ __html: docTitle || 'Untitled' }}
        />
      </div>
      
      {/* Collaborators bar */}
      <CollaboratorsBar collaborators={collaborators} />
      
      {/* Blocks */}
      <div className="editor-blocks space-y-1">
        {blocks.map((block) => (
          <BlockRenderer
            key={block.id}
            block={block}
            isSelected={selectedBlockId === block.id}
            isFocused={focusedBlockId === block.id}
            onChange={(content) => handleBlockChange(block.id, content)}
            onKeyDown={(e) => handleBlockKeyDown(e, block.id)}
            registerRef={(ref) => registerBlockRef(block.id, ref)}
            onSelect={() => selectBlock(block.id)}
            onFocus={() => focusBlock(block.id)}
          />
        ))}
      </div>
      
      {/* Slash menu */}
      {showSlashMenu && (
        <SlashMenu
          position={slashMenuPosition}
          onSelect={handleSlashCommand}
          onClose={closeSlashMenu}
          filter={slashMenuFilter}
          onFilterChange={updateSlashMenuFilter}
        />
      )}
    </div>
  ); = useEditor();
  
  const { blocks, selectedBlockId, focusedBlockId, isLoading, error, collaborators, docTitle } = state;
  const editorRef = useRef<HTMLDivElement>(null);
  const blocksRef = useRef<{ [key: string]: HTMLDivElement }>({});
  
  // Slash menu state
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashMenuPosition, setSlashMenuPosition] = useState({ x: 0, y: 0 });
  const [slashMenuBlockId, setSlashMenuBlockId] = useState<string | null>(null);
  const [slashMenuFilter, setSlashMenuFilter] = useState('');
  
  const { docId } = useParams<{ docId: string }>();
  
  // Handle errors and loading state
    // Handle block content change
  const handleBlockChange = (blockId: string, content: any) => {
    updateBlock(blockId, content);
  };
  
  // Handle slash command selection
  const handleSlashCommand = (blockType: BlockType) => {
    if (slashMenuBlockId) {
      // Convert the current block to the selected type
      // For simplicity, we'll just replace the current block
      deleteBlock(slashMenuBlockId);
      addBlock(blockType, undefined, blocks.findIndex(b => b.id === slashMenuBlockId));
    }
    
    setShowSlashMenu(false);
    setSlashMenuBlockId(null);
  };
  
  // Close slash menu
  const closeSlashMenu = () => {
    setShowSlashMenu(false);
    setSlashMenuBlockId(null);
  };
  
  // Update slash menu filter
  const updateSlashMenuFilter = (filter: string) => {
    setSlashMenuFilter(filter);
  };
  
  if (error) {
    return (
      <div className="p-8 text-center">
        <h3 className="text-xl font-medium mb-2">Error loading document</h3>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="animate-pulse">Loading document...</div>
      </div>
    );
  }
  
  // Register block ref
  const registerBlockRef = (id: string, ref: HTMLDivElement | null) => {
    if (ref) {
      blocksRef.current[id] = ref;
    } else {
      delete blocksRef.current[id];
    }
  };
  
  // Focus the block element when focusedBlockId changes
  useEffect(() => {
    if (focusedBlockId && blocksRef.current[focusedBlockId]) {
      // Focus the content editable element inside the block
      const contentEditable = blocksRef.current[focusedBlockId].querySelector('[contenteditable="true"]');
      if (contentEditable instanceof HTMLElement) {
        contentEditable.focus();
        
        // Place cursor at the end of text
        const selection = window.getSelection();
        const range = document.createRange();
        
        if (selection && contentEditable.childNodes.length > 0) {
          const lastNode = contentEditable.childNodes[contentEditable.childNodes.length - 1];
          range.selectNodeContents(lastNode);
          range.collapse(false); // collapse to end
          selection.removeAllRanges();
          selection.addRange(range);
        } else if (selection) {
          // If no child nodes, just focus
          range.selectNodeContents(contentEditable);
          range.collapse(false);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }
    }
  }, [focusedBlockId]);
  
  // Global keyboard navigation handler
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!selectedBlockId) return;
    
    const currentIndex = blocks.findIndex(block => block.id === selectedBlockId);
    if (currentIndex === -1) return;
    
    // Arrow up/down navigation
    if (e.key === 'ArrowUp' && !e.shiftKey && !e.metaKey && !e.ctrlKey) {
      e.preventDefault();
      if (currentIndex > 0) {
        selectBlock(blocks[currentIndex - 1].id);
        focusBlock(blocks[currentIndex - 1].id);
      }
    }
    
    if (e.key === 'ArrowDown' && !e.shiftKey && !e.metaKey && !e.ctrlKey) {
      e.preventDefault();
      if (currentIndex < blocks.length - 1) {
        selectBlock(blocks[currentIndex + 1].id);
        focusBlock(blocks[currentIndex + 1].id);
      }
    }
  };
  
  // Helper to check if block is empty
  const isEmptyBlock = (block: any) => {
    if (!block || !block.content) return true;
    
    if (block.type === 'text' || block.type === 'heading' || block.type === 'list-item') {
      return !block.content.text || block.content.text.trim() === '';
    }
    
    return false;
  };
  
  // Get the current text selection offset
  const getSelectionOffset = (): number => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return 0;
    
    const range = selection.getRangeAt(0);
    return range.startOffset;
  };
  
  // Handle block keyboard events
  const handleBlockKeyDown = (e: KeyboardEvent<HTMLDivElement>, blockId: string) => {
    const block = blocks.find(b => b.id === blockId);
    if (!block) return;
    
    const blockIndex = blocks.findIndex(b => b.id === blockId);
    const isFirstBlock = blockIndex === 0;
    const isLastBlock = blockIndex === blocks.length - 1;
    
    // Handle slash command
    if (e.key === '/' && getSelectionOffset() === 0) {
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      setSlashMenuPosition({ x: rect.left, y: rect.bottom });
      setSlashMenuBlockId(blockId);
      setShowSlashMenu(true);
      setSlashMenuFilter('');
      e.preventDefault();
      return;
    }
    
    // Handle Enter to create a new block
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      
      // Get current selection offset
      const offset = getSelectionOffset();
      
      // If text, split the block at cursor position
      if (block.type === 'text' || block.type === 'heading' || block.type === 'list-item') {
        splitBlock(blockId, offset);
      } else {
        // Add a new block after the current one
        const newIndex = blockIndex + 1;
        addBlock('text', undefined, newIndex);
      }
      return;
    }
    
    // Handle Shift+Enter for line break within the same block
    if (e.key === 'Enter' && e.shiftKey) {
      // Handled by contentEditable
      return;
    }
    
    // Handle Backspace at beginning to merge with previous block
    if (e.key === 'Backspace' && getSelectionOffset() === 0 && !isFirstBlock) {
      e.preventDefault();
      const prevBlockId = blocks[blockIndex - 1].id;
      mergeBlocks(prevBlockId, blockId);
      return;
    }
    
    // Handle Tab for indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      if (e.shiftKey) {
        outdentBlock(blockId);
      } else {
        indentBlock(blockId);
      }
      return;
    }
    
    // Handle Backspace on empty block to delete it
    if (e.key === 'Backspace' && isEmptyBlock(block) && blocks.length > 1) {
      e.preventDefault();
      const newFocusId = isFirstBlock
        ? blocks[blockIndex + 1]?.id
        : blocks[blockIndex - 1]?.id;
      
      deleteBlock(blockId);
      if (newFocusId) {
        selectBlock(newFocusId);
        focusBlock(newFocusId);
      }
      return;
    }}}