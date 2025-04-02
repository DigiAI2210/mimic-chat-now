
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus, MessageSquare, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Conversation {
  id: string;
  title: string;
}

interface ChatSidebarProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onNewConversation: () => void;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  isMobile: boolean;
  isOpen: boolean;
  onToggle: () => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  conversations,
  activeConversationId,
  onNewConversation,
  onSelectConversation,
  onDeleteConversation,
  isMobile,
  isOpen,
  onToggle
}) => {
  // If it's mobile and not open, don't render content
  if (isMobile && !isOpen) {
    return null;
  }

  return (
    <div 
      className={cn(
        "bg-chatgpt-sidebar-bg text-white flex flex-col h-screen w-72 transition-all duration-300",
        isMobile && "fixed left-0 top-0 z-50",
        isMobile && !isOpen && "transform -translate-x-full"
      )}
    >
      <div className="p-3">
        <Button 
          variant="outline" 
          className="w-full justify-start gap-3 bg-transparent text-white border border-white/20 hover:bg-chatgpt-sidebar-hover"
          onClick={onNewConversation}
        >
          <Plus size={16} />
          New chat
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {conversations.map((conversation) => (
          <div 
            key={conversation.id}
            className={cn(
              "flex items-center gap-2 px-3 py-3 hover:bg-chatgpt-sidebar-hover cursor-pointer group",
              activeConversationId === conversation.id && "bg-chatgpt-sidebar-hover"
            )}
            onClick={() => onSelectConversation(conversation.id)}
          >
            <MessageSquare size={16} />
            <div className="flex-1 text-sm truncate">{conversation.title}</div>
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteConversation(conversation.id);
              }}
            >
              <Trash2 size={16} />
            </Button>
          </div>
        ))}
      </div>

      <div className="p-3 border-t border-white/20">
        <div className="text-sm text-gray-400">
          Free Research Preview
        </div>
      </div>
    </div>
  );
};
