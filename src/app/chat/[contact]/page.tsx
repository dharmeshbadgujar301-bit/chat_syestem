'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useChatStore } from '@/store/chatStore';
import ChatHeader from '../../../components/ChatHeader';
import ChatMessages from '../../../components/ChatMessages';
import MessageInput from '../../../components/MessageInput';

export default function ContactChatPage() {
  const params = useParams();
  const router = useRouter();
  const { contacts, activeContactId, setActiveContactId } = useChatStore();
  
  const contactId = params.contact as string;
  const contact = contacts.find(c => c.id === contactId);

  useEffect(() => {
    if (contacts.length > 0) {
      if (contact) {
        if (activeContactId !== contact.id) {
          setActiveContactId(contact.id);
        }
      } else {
        router.push('/chat'); // Redirect if contact doesn't exist
      }
    }
  }, [contactId, contact, contacts.length, activeContactId, setActiveContactId, router]);

  // Handle the case during initial client hydration where contacts might be empty
  if (!contact) {
    return <div className="h-full flex items-center justify-center bg-gray-50">Loading...</div>;
  }

  return (
    <div className="flex flex-col h-full bg-[#EFEAE2]">
      <ChatHeader contact={contact} />
      <ChatMessages contactId={contact.id} />
      <MessageInput contactId={contact.id} />
    </div>
  );
}
