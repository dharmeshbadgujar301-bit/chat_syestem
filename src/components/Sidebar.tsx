'use client';

import React, { useState, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useChatStore } from '@/store/chatStore';
import ContactItem from './ContactItem';
import AddContactModal from './AddContactModal';
import ContextMenu, { ContextMenuPosition } from './ContextMenu';
import { MessageSquare, Search, UserPlus } from 'lucide-react';

export default function Sidebar() {
  const router = useRouter();
  const params = useParams();
  const { contacts, chatHistory, addContact } = useChatStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState('');
  
  const [contextMenu, setContextMenu] = useState<{
    isOpen: boolean;
    position: ContextMenuPosition;
    contactId: string | null;
  }>({
    isOpen: false,
    position: { x: 0, y: 0 },
    contactId: null,
  });

  const activeContactId = params.contact as string;

  const filteredContacts = useMemo(() => {
    return contacts.filter(contact => 
      contact.name.toLowerCase().includes(localSearch.toLowerCase())
    );
  }, [contacts, localSearch]);

  const handleAddContact = (name: string) => {
    addContact(name);
    setIsModalOpen(false);
    const newContactId = name.toLowerCase().replace(/\s+/g, '-');
    router.push(`/chat/${newContactId}`);
  };

  return (
    <div className="w-full md:w-[350px] lg:w-[400px] h-full bg-white flex flex-col border-r border-gray-100 z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      {/* Sidebar Header */}
      <div className="h-20 px-6 flex items-center justify-between bg-white border-b border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3 tracking-tight">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          Chats
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="p-2.5 text-indigo-600 hover:text-white hover:bg-indigo-600 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
          title="Add Contact"
        >
          <UserPlus className="w-5 h-5" />
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-4 bg-white border-b border-gray-50">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-3 bg-gray-50 border-transparent rounded-2xl text-sm placeholder-gray-400 text-gray-900 focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300 outline-none"
            placeholder="Search name"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Contact List */}
      <div className="flex-1 overflow-y-auto bg-white scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        {filteredContacts.length > 0 ? (
          <div className="px-3 py-2 space-y-1">
            {filteredContacts.map(contact => {
              const messages = chatHistory[contact.id] || [];
              const lastMessage = messages.length > 0 ? messages[messages.length - 1] : undefined;
              
              return (
                <ContactItem
                  key={contact.id}
                  contact={contact}
                  lastMessage={lastMessage}
                  isActive={activeContactId === contact.id}
                  onClick={() => router.push(`/chat/${contact.id}`)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setContextMenu({
                      isOpen: true,
                      position: { x: e.clientX, y: e.clientY },
                      contactId: contact.id,
                    });
                  }}
                />
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 p-6 text-center animate-in fade-in duration-500">
            <div className="w-16 h-16 mb-4 rounded-full bg-gray-50 flex items-center justify-center">
              <Search className="w-6 h-6 text-gray-300" />
            </div>
            <p className="text-gray-600 font-medium mb-1">No contacts found</p>
            <p className="text-sm">Try a different search or add a new contact.</p>
          </div>
        )}
      </div>

      <AddContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddContact}
      />

      <ContextMenu
        isOpen={contextMenu.isOpen}
        position={contextMenu.position}
        contactId={contextMenu.contactId}
        onClose={() => setContextMenu({ ...contextMenu, isOpen: false })}
      />
    </div>
  );
}
