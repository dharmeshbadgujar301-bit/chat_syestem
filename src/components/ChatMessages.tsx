'use client';

import React, { useEffect, useRef, useMemo } from 'react';
import { useChatStore } from '@/store/chatStore';
import MessageBubble from './MessageBubble';
import { format, isToday, isYesterday } from 'date-fns';
import { Message } from '@/types';

interface ChatMessagesProps {
  contactId: string;
}

export default function ChatMessages({ contactId }: ChatMessagesProps) {
  const { chatHistory } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const messages = chatHistory[contactId] || [];

  const groupedMessages = useMemo(() => {
    const groups: { dateLabel: string, messages: Message[] }[] = [];
    
    messages.forEach(msg => {
      const date = new Date(msg.timestamp);
      let dateLabel = '';
      if (isToday(date)) {
        dateLabel = 'Today';
      } else if (isYesterday(date)) {
        dateLabel = 'Yesterday';
      } else {
        dateLabel = format(date, 'MMMM d, yyyy');
      }

      const lastGroup = groups[groups.length - 1];
      if (lastGroup && lastGroup.dateLabel === dateLabel) {
        lastGroup.messages.push(msg);
      } else {
        groups.push({ dateLabel, messages: [msg] });
      }
    });

    return groups;
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gradient-to-b from-[#EFEAE2] to-[#f4f1ec] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full opacity-60">
          <div className="bg-yellow-100 text-yellow-800 text-xs py-1.5 px-4 rounded-xl shadow-sm text-center max-w-sm">
            Messages are end-to-end encrypted. No one outside of this chat, not even us, can read or listen to them.
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {groupedMessages.map((group, groupIdx) => (
            <React.Fragment key={group.dateLabel + groupIdx}>
              <div className="flex justify-center mb-6 mt-4 first:mt-0">
                <span className="bg-white/60 text-gray-500 text-xs py-1 px-3 rounded-lg shadow-sm backdrop-blur-sm">
                  {group.dateLabel}
                </span>
              </div>
              {group.messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
            </React.Fragment>
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
}
