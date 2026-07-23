'use client';

import React from 'react';
import Sidebar from '@/components/Sidebar';
import { usePathname } from 'next/navigation';

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // If the pathname is strictly '/chat', we are on the contact list empty state
  const isChatActive = pathname !== '/chat';

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <div className="w-full max-w-[1600px] mx-auto h-full flex shadow-xl shadow-black/5 bg-white relative">
        <div className={`h-full w-full md:w-auto shrink-0 ${isChatActive ? 'hidden md:block' : 'block'}`}>
          <Sidebar />
        </div>
        <main className={`flex-1 h-full bg-gray-50 relative ${isChatActive ? 'block' : 'hidden md:block'}`}>
          {children}
        </main>
      </div>
    </div>
  );
}
