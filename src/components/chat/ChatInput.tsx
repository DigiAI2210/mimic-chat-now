
import React, { useState, KeyboardEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendIcon } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  disabled = false
}) => {
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <div className="relative">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message ChatGPT..."
          className="min-h-12 py-3 pr-12 resize-none rounded-lg border border-chatgpt-prompt-border shadow-sm focus:border-chatgpt-prompt-focus focus:ring-1 focus:ring-chatgpt-prompt-focus"
          disabled={disabled}
        />
        <Button
          type="submit"
          size="icon"
          className="absolute bottom-1.5 right-1.5 h-8 w-8 rounded-md bg-chatgpt-button-primary hover:bg-chatgpt-button-primary-hover text-white"
          onClick={handleSendMessage}
          disabled={!message.trim() || disabled}
        >
          <SendIcon className="h-4 w-4" />
        </Button>
      </div>
      <div className="mt-2 text-xs text-center text-gray-500">
        ChatGPT can make mistakes. Consider checking important information.
      </div>
    </div>
  );
};
