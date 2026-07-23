import React from 'react';
import { Message } from '@/types';
import { format } from 'date-fns';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isMe = message.sender === 'me';
  const time = format(new Date(message.timestamp), 'h:mm a');

  return (
    <div className={twMerge(clsx("flex w-full mb-4", { "justify-end": isMe }))}>
      <div 
        className={twMerge(
          clsx(
            "max-w-[85%] sm:max-w-[75%] md:max-w-[65%] rounded-2xl px-4 py-2 shadow-sm relative group animate-in slide-in-from-bottom-2 duration-300",
            {
              "bg-indigo-600 text-white rounded-tr-sm shadow-indigo-600/20": isMe,
              "bg-white text-gray-800 rounded-tl-sm border border-gray-100": !isMe
            }
          )
        )}
      >
        {message.attachment && (
          <div className="mb-2 rounded-xl overflow-hidden shadow-sm relative w-full h-auto max-h-[300px] flex items-center justify-center bg-black/5">
            <img 
              src={message.attachment} 
              alt="Attachment" 
              className="max-w-full max-h-[300px] object-cover rounded-xl"
            />
          </div>
        )}
        {message.text && (
          <p className="text-[15px] leading-relaxed whitespace-pre-wrap break-words">
            {message.text}
          </p>
        )}
        <div className="flex justify-end items-center mt-1 space-x-1.5">
          <span className={twMerge(clsx("text-[10px]", {
            "text-indigo-200": isMe,
            "text-gray-400": !isMe
          }))}>
            {time}
          </span>
          {isMe && (
            <span className="text-indigo-200">
              <svg viewBox="0 0 16 15" width="14" height="13" className="fill-current">
                <path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z" />
              </svg>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
