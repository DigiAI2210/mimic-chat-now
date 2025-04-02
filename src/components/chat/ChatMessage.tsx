
import React from 'react';
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type MessageRole = 'user' | 'assistant' | 'system';

interface ChatMessageProps {
  role: MessageRole;
  content: string;
  isLoading?: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  role,
  content,
  isLoading = false
}) => {
  // Determine the CSS class based on the role
  const messageClass = role === 'user' ? 'chat-message-user' : 'chat-message-assistant';
  
  // Determine the avatar content/image based on the role
  const avatarContent = role === 'user'
    ? <div className="bg-gray-600 h-full w-full flex items-center justify-center text-white">U</div>
    : <div className="bg-emerald-600 h-full w-full flex items-center justify-center text-white">AI</div>;

  return (
    <div className={cn("py-8 px-4 md:px-8 flex w-full", messageClass)}>
      <div className="max-w-3xl mx-auto w-full flex gap-4 md:gap-6">
        <div className="flex-shrink-0 pt-1">
          <Avatar className="h-6 w-6">
            {avatarContent}
          </Avatar>
        </div>
        <div className="flex-1 space-y-2 overflow-hidden">
          <div className="font-medium">
            {role === 'user' ? 'You' : 'ChatGPT'}
          </div>
          {isLoading ? (
            <div className="gpt-thinking-dots flex">
              <div></div>
              <div></div>
              <div></div>
            </div>
          ) : (
            <div className="prose prose-sm max-w-none">
              {content}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
