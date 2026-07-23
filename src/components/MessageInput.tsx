'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Smile, Paperclip, Send, Mic, MicOff, X } from 'lucide-react';
import { useChatStore } from '@/store/chatStore';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';

interface MessageInputProps {
  contactId: string;
}

export default function MessageInput({ contactId }: MessageInputProps) {
  const [text, setText] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [attachment, setAttachment] = useState<{ url: string; file: File } | null>(null);
  
  const { sendMessage } = useChatStore();
  
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  // Web Speech API references
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    inputRef.current?.focus();
    setShowEmoji(false);
    setAttachment(null);
  }, [contactId]);

  // Handle outside click for Emoji Picker
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmoji(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Initialize Speech Recognition
  useEffect(() => {
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            setText((prev) => prev + transcript + ' ');
          } else {
            currentTranscript += transcript;
          }
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert("Microphone is not supported in this browser.");
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (e) {
        console.error("Recording error", e);
      }
    }
  };

  const handleSend = () => {
    if (text.trim() || attachment) {
      sendMessage(contactId, text.trim(), attachment?.url);
      setText('');
      setAttachment(null);
      inputRef.current?.focus();
      setShowEmoji(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setText((prev) => prev + emojiData.emoji);
    inputRef.current?.focus();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a temporary object URL for preview and sending
      const url = URL.createObjectURL(file);
      setAttachment({ url, file });
    }
  };

  const removeAttachment = () => {
    setAttachment(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="relative flex flex-col w-full bg-gray-50 border-t border-gray-200">
      
      {/* Emoji Picker Popover */}
      {showEmoji && (
        <div ref={emojiPickerRef} className="absolute bottom-[75px] left-4 z-50 animate-in fade-in slide-in-from-bottom-2">
          <EmojiPicker onEmojiClick={onEmojiClick} searchDisabled skinTonesDisabled />
        </div>
      )}

      {/* Attachment Preview Area */}
      {attachment && (
        <div className="px-4 pt-3 pb-1 flex items-center">
          <div className="relative inline-block">
            <img 
              src={attachment.url} 
              alt="Attachment preview" 
              className="h-20 w-auto rounded-lg border border-gray-200 shadow-sm object-cover"
            />
            <button 
              onClick={removeAttachment}
              className="absolute -top-2 -right-2 bg-gray-800 text-white p-1 rounded-full hover:bg-gray-700 transition-colors shadow-md"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Main Input Bar */}
      <div className="min-h-[64px] px-4 py-2 flex items-end gap-3 w-full pb-3">
        
        <button 
          onClick={() => setShowEmoji(!showEmoji)}
          className={`p-2 transition-colors rounded-full mb-1 ${showEmoji ? 'text-indigo-600 bg-indigo-50' : 'text-gray-500 hover:text-indigo-600 hover:bg-gray-200'}`}
        >
          <Smile className="w-6 h-6" />
        </button>
        
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="p-2 text-gray-500 hover:text-indigo-600 transition-colors rounded-full hover:bg-gray-200 hidden sm:block mb-1"
        >
          <Paperclip className="w-5 h-5" />
        </button>
        
        {/* Hidden File Input */}
        <input 
          type="file" 
          ref={fileInputRef} 
          accept="image/*" 
          className="hidden" 
          onChange={handleFileChange}
        />
        
        <div className={`flex-1 bg-white rounded-3xl border ${isRecording ? 'border-red-300 ring-2 ring-red-100' : 'border-gray-200'} shadow-sm flex items-center px-4 min-h-[44px] focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-300 transition-all`}>
          {isRecording && (
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse mr-2"></span>
          )}
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isRecording ? "Listening..." : "Type a message..."}
            className="w-full bg-transparent outline-none text-gray-900 placeholder-gray-400 text-base py-2.5"
          />
        </div>
        
        {(text.trim() || attachment) ? (
          <button 
            onClick={handleSend}
            className="p-3 bg-indigo-600 text-white hover:bg-indigo-700 transition-colors rounded-full shadow-sm shadow-indigo-600/30 animate-in zoom-in-95 mb-0.5"
          >
            <Send className="w-5 h-5 ml-0.5" />
          </button>
        ) : (
          <button 
            onClick={toggleRecording}
            className={`p-3 transition-colors rounded-full shadow-sm mb-0.5 ${isRecording ? 'bg-red-500 text-white hover:bg-red-600 shadow-red-500/30 animate-pulse' : 'bg-gray-100 text-gray-500 hover:text-indigo-600 hover:bg-gray-200'}`}
          >
            {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
        )}
      </div>
    </div>
  );
}
