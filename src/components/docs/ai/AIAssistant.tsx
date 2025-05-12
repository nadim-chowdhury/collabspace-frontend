import React, { useState, useEffect } from "react";
import { X, Send, Sparkles } from "lucide-react";

// Define types for AI interactions
export interface AIMessage {
  id: string;
  type: "user" | "ai" | "system";
  content: string;
  timestamp: Date;
}

interface AIAssistantProps {
  documentId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function AIAssistant({ documentId, isOpen, onClose }: AIAssistantProps) {
  console.log(" AIAssistant ~ documentId:", documentId);
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Initial welcome message
  useEffect(() => {
    if (isOpen) {
      setMessages([
        {
          id: "welcome",
          type: "system",
          content: "How can I help you with this document?",
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage: AIMessage = {
      id: `user-${Date.now()}`,
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Simulate AI response (replace with actual AI API call)
      const aiResponse: AIMessage = {
        id: `ai-${Date.now()}`,
        type: "ai",
        content: `I understand you want help with: "${inputMessage}". Here's a potential suggestion...`,
        timestamp: new Date(),
      };

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("AI assistant error:", error);
      const errorMessage: AIMessage = {
        id: `error-${Date.now()}`,
        type: "system",
        content: "Sorry, there was an error processing your request.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key for sending messages
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md h-[600px] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Sparkles className="text-blue-600" />
            <h2 className="text-lg font-semibold">AI Assistant</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-600 hover:bg-gray-100 p-2 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        {/* Message Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`p-3 rounded-lg max-w-[80%] ${
                message.type === "user"
                  ? "bg-blue-100 text-blue-800 self-end ml-auto"
                  : message.type === "ai"
                  ? "bg-gray-100 text-gray-800 self-start"
                  : "bg-gray-50 text-gray-600 text-center"
              }`}
            >
              {message.content}
            </div>
          ))}
          {isLoading && (
            <div className="p-3 bg-gray-100 text-gray-800 rounded-lg self-start">
              Thinking...
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t flex items-center space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask the AI assistant..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="bg-blue-500 text-white p-2 rounded-full disabled:opacity-50 hover:bg-blue-600"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
