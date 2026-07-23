import React, { useEffect, useRef } from 'react';
import { Archive, BellOff, Pin, Mail, Star, ListPlus, Ban, Trash2, XCircle } from 'lucide-react';
import { useChatStore } from '@/store/chatStore';

export interface ContextMenuPosition {
  x: number;
  y: number;
}

interface ContextMenuProps {
  isOpen: boolean;
  position: ContextMenuPosition;
  contactId: string | null;
  onClose: () => void;
}

export default function ContextMenu({ isOpen, position, contactId, onClose }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const { deleteChat, clearChat, toggleUnread } = useChatStore();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen || !contactId) return null;

  const handleAction = (action: () => void) => {
    action();
    onClose();
  };

  const menuItems = [
    { icon: Archive, label: 'Archive chat', action: () => alert('Archive feature coming soon!') },
    { icon: BellOff, label: 'Mute notifications', action: () => alert('Mute feature coming soon!') },
    { icon: Pin, label: 'Pin chat', action: () => alert('Pin feature coming soon!') },
    { icon: Mail, label: 'Mark as unread/read', action: () => toggleUnread(contactId) },
    { icon: Star, label: 'Add to favourites', action: () => alert('Favourites feature coming soon!') },
    { icon: ListPlus, label: 'Add to list', action: () => alert('Lists feature coming soon!') },
    { divider: true },
    { icon: Ban, label: 'Block', action: () => alert('Block feature coming soon!') },
    { icon: XCircle, label: 'Clear chat', action: () => clearChat(contactId) },
    { icon: Trash2, label: 'Delete chat', action: () => deleteChat(contactId) },
  ];

  // Adjust position to not go off screen
  const style: React.CSSProperties = {
    position: 'fixed',
    top: `${position.y}px`,
    left: `${position.x}px`,
    zIndex: 9999,
  };

  return (
    <div 
      ref={menuRef}
      style={style}
      className="bg-white text-gray-900 rounded-lg shadow-xl py-2 min-w-[220px] text-[15px] animate-in fade-in duration-100 border border-gray-100"
    >
      {menuItems.map((item, idx) => {
        if (item.divider) {
          return <div key={idx} className="border-t border-gray-100 my-2"></div>;
        }

        const Icon = item.icon!;
        return (
          <button
            key={idx}
            onClick={(e) => {
              e.stopPropagation(); // prevent bubbling to the item itself
              handleAction(item.action!);
            }}
            className="w-full flex items-center gap-4 px-5 py-2.5 hover:bg-gray-50 transition-colors text-left"
          >
            <Icon className="w-5 h-5 text-gray-500" />
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
