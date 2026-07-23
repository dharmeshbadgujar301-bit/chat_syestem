import React from 'react';
import { MessageSquareDashed } from 'lucide-react';

export default function EmptyState() {
  return (
    <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-gray-50 h-full border-l border-gray-200">
      <div className="bg-white p-6 rounded-full shadow-sm mb-6 border border-gray-100">
        <MessageSquareDashed className="w-16 h-16 text-gray-300" />
      </div>
      <h2 className="text-2xl font-light text-gray-700 mb-2">WhatsApp for Web</h2>
      <p className="text-gray-500 text-center max-w-sm">
        Select a conversation from the sidebar or start a new one to begin messaging.
      </p>
      <div className="mt-10 pt-6 border-t border-gray-200 flex items-center justify-center space-x-2 text-sm text-gray-400 w-64">
        <span className="flex-1 border-t border-gray-200"></span>
        <span>End-to-end encrypted</span>
        <span className="flex-1 border-t border-gray-200"></span>
      </div>
    </div>
  );
}
