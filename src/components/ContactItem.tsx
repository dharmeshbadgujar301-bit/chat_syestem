import React from 'react';
import { Contact, Message } from '@/types';
import { format } from 'date-fns';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import Image from 'next/image';

interface ContactItemProps {
  contact: Contact;
  lastMessage?: Message;
  isActive: boolean;
  onClick: () => void;
  onContextMenu?: (e: React.MouseEvent) => void;
}

export default function ContactItem({ contact, lastMessage, isActive, onClick, onContextMenu }: ContactItemProps) {
  const formattedTime = lastMessage?.timestamp 
    ? format(new Date(lastMessage.timestamp), 'h:mm a') 
    : '';

  return (
    <div
      onClick={onClick}
      onContextMenu={(e) => {
        if (onContextMenu) {
          e.preventDefault();
          onContextMenu(e);
        }
      }}
      className={twMerge(
        clsx(
          'flex items-center gap-4 p-3 rounded-2xl cursor-pointer transition-all duration-300 group',
          {
            'bg-indigo-50 shadow-sm border border-indigo-100': isActive,
            'hover:bg-gray-50 border border-transparent': !isActive,
          }
        )
      )}
    >
      <div className="relative flex-shrink-0 w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-indigo-400 to-purple-500 shadow-sm">
        {contact.avatar ? (
          <Image src={contact.avatar} alt={contact.name} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white font-semibold text-lg">
            {contact.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline mb-1">
          <h3 className={twMerge(
            clsx("font-semibold truncate transition-colors", {
              "text-indigo-900": isActive,
              "text-gray-800 group-hover:text-gray-900": !isActive,
            })
          )}>
            {contact.name}
          </h3>
          {formattedTime && (
            <span className={twMerge(
              clsx("text-xs flex-shrink-0 ml-2 font-medium", {
                "text-indigo-500": isActive || (contact.unreadCount && contact.unreadCount > 0),
                "text-gray-400": !isActive && (!contact.unreadCount || contact.unreadCount === 0),
              })
            )}>
              {formattedTime}
            </span>
          )}
        </div>
        
        <div className="flex justify-between items-center gap-2">
          <p className={twMerge(
            clsx("text-sm truncate", {
              "text-indigo-600/80": isActive,
              "text-gray-500": !isActive,
              "font-medium text-gray-800": !isActive && contact.unreadCount && contact.unreadCount > 0
            })
          )}>
            {lastMessage?.text || 'No messages yet'}
          </p>
          
          {contact.unreadCount && contact.unreadCount > 0 ? (
            <span className="flex-shrink-0 bg-indigo-600 text-white text-[10px] font-bold h-5 min-w-[20px] px-1.5 rounded-full flex items-center justify-center shadow-sm">
              {contact.unreadCount}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
