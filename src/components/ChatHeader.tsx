'use client';

import React from 'react';
import { Contact } from '@/types';
import { ArrowLeft, MoreVertical, Phone, Video } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface ChatHeaderProps {
  contact: Contact;
}

export default function ChatHeader({ contact }: ChatHeaderProps) {
  const router = useRouter();

  return (
    <div className="h-20 px-4 py-2 flex items-center justify-between bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-10 shadow-sm">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => router.push('/chat')}
          className="md:hidden p-2 -ml-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-indigo-400 to-purple-500 shadow-sm cursor-pointer">
          {contact.avatar ? (
            <Image src={contact.avatar} alt={contact.name} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white font-semibold text-lg">
              {contact.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        
        <div className="cursor-pointer group">
          <h2 className="text-gray-900 font-bold group-hover:text-indigo-600 transition-colors">{contact.name}</h2>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse"></span>
            <p className="text-xs text-gray-500 font-medium">Online</p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2 sm:gap-4 text-gray-500">
        <button className="p-2.5 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all hidden sm:block">
          <Video className="w-5 h-5" />
        </button>
        <button className="p-2.5 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all hidden sm:block">
          <Phone className="w-5 h-5" />
        </button>
        <button className="p-2.5 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
