
import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { ChatSidebar } from './ChatSidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

// Mock response generation
const mockResponses = [
  "I'm an AI assistant created by OpenAI. How can I help you today?",
  "That's an interesting question. Let me think about it...",
  "Based on my understanding, there are several approaches to consider.",
  "I'd be happy to help you with that. Could you provide more details?",
  "While I don't have personal experiences, I can offer some insights on this topic."
];

// Message type definition
interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// Conversation type definition
interface Conversation {
  id: string;
  title: string;
  messages: Message[];
}

// Default initial conversation
const defaultConversation: Conversation = {
  id: '1',
  title: 'Welcome to ChatGPT',
  messages: [{
    id: 'initial',
    role: 'assistant',
    content: "Hello! I'm ChatGPT, a large language model trained by OpenAI. How can I assist you today?"
  }]
};

export const ChatUI: React.FC = () => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [conversations, setConversations] = useState<Conversation[]>([defaultConversation]);
  const [activeConversationId, setActiveConversationId] = useState<string>('1');
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get current conversation with fallback to first conversation or default
  const currentConversation = conversations.find(c => c.id === activeConversationId) || 
                             (conversations.length > 0 ? conversations[0] : defaultConversation);
  
  // Create a new conversation
  const handleNewConversation = () => {
    const newId = uuidv4();
    const newConversation: Conversation = {
      id: newId,
      title: 'New conversation',
      messages: [{
        id: uuidv4(),
        role: 'assistant',
        content: 'How can I help you today?'
      }]
    };
    
    setConversations([...conversations, newConversation]);
    setActiveConversationId(newId);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  // Delete a conversation
  const handleDeleteConversation = (id: string) => {
    const updatedConversations = conversations.filter(conv => conv.id !== id);
    
    if (updatedConversations.length === 0) {
      // If no conversations left, create a new one
      handleNewConversation();
    } else if (id === activeConversationId) {
      // If active conversation was deleted, set the first available one as active
      setActiveConversationId(updatedConversations[0].id);
    }
    
    setConversations(updatedConversations);
  };

  // Select a conversation
  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  // Send a message
  const handleSendMessage = async (message: string) => {
    if (isWaitingForResponse) return;
    
    // Add user message
    const userMessageId = uuidv4();
    const userMessage: Message = {
      id: userMessageId,
      role: 'user',
      content: message
    };
    
    // Update conversation with user message
    const updatedConversations = conversations.map(conv => {
      if (conv.id === activeConversationId) {
        // If this is the first user message, use it as the conversation title
        const shouldUpdateTitle = conv.messages.length === 1 && conv.messages[0].role === 'assistant';
        
        return {
          ...conv,
          title: shouldUpdateTitle ? message.substring(0, 30) + (message.length > 30 ? '...' : '') : conv.title,
          messages: [...conv.messages, userMessage]
        };
      }
      return conv;
    });
    
    setConversations(updatedConversations);
    
    // Simulate typing
    setIsWaitingForResponse(true);
    
    // Simulate AI response after a delay
    setTimeout(() => {
      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      
      const assistantMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: randomResponse
      };
      
      setConversations(prevConversations => 
        prevConversations.map(conv => {
          if (conv.id === activeConversationId) {
            return {
              ...conv,
              messages: [...conv.messages, assistantMessage]
            };
          }
          return conv;
        })
      );
      
      setIsWaitingForResponse(false);
    }, 1500);
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentConversation?.messages, isWaitingForResponse]);

  // If there are no conversations, create a default one
  useEffect(() => {
    if (conversations.length === 0) {
      setConversations([defaultConversation]);
      setActiveConversationId(defaultConversation.id);
    }
  }, [conversations]);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile overlay when sidebar is open */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <ChatSidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onNewConversation={handleNewConversation}
        onSelectConversation={handleSelectConversation}
        onDeleteConversation={handleDeleteConversation}
        isMobile={isMobile}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      
      {/* Main chat area */}
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        {/* Top bar */}
        <div className="h-12 border-b flex items-center px-4">
          {isMobile && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="mr-2"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu size={20} />
            </Button>
          )}
          <div className="font-medium">{currentConversation.title}</div>
        </div>
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          {currentConversation.messages.map(message => (
            <ChatMessage
              key={message.id}
              role={message.role}
              content={message.content}
            />
          ))}
          
          {/* Display typing indicator when waiting for response */}
          {isWaitingForResponse && (
            <ChatMessage
              role="assistant"
              content=""
              isLoading={true}
            />
          )}
          
          {/* This ref is used to scroll to the bottom */}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input area */}
        <div className="border-t bg-white pb-4">
          <ChatInput 
            onSendMessage={handleSendMessage} 
            disabled={isWaitingForResponse}
          />
        </div>
      </div>
    </div>
  );
};
