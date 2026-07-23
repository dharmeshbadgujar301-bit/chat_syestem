import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Contact, Message, ChatHistory } from '../types';

interface ChatState {
  contacts: Contact[];
  chatHistory: ChatHistory;
  activeContactId: string | null;
  setActiveContactId: (id: string | null) => void;
  addContact: (name: string) => void;
  sendMessage: (contactId: string, text: string, attachment?: string) => void;
  markAsRead: (contactId: string) => void;
  deleteChat: (contactId: string) => void;
  clearChat: (contactId: string) => void;
  toggleUnread: (contactId: string) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      contacts: [],
      chatHistory: {},
      activeContactId: null,

      setActiveContactId: (id) => {
        set({ activeContactId: id });
        if (id) {
          get().markAsRead(id);
        }
      },

      addContact: (name) => {
        const id = name.toLowerCase().replace(/\s+/g, '-');
        set((state) => {
          if (state.contacts.some(c => c.id === id)) {
            return state; // Duplicate contact check
          }
          const newContact: Contact = {
            id,
            name,
            avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${name}`,
            unreadCount: 0,
          };
          return {
            contacts: [...state.contacts, newContact],
            chatHistory: { ...state.chatHistory, [id]: [] }
          };
        });
      },

      sendMessage: (contactId, text, attachment) => {
        const newMessage: Message = {
          id: Date.now().toString(),
          text,
          timestamp: new Date().toISOString(),
          sender: 'me',
          attachment,
        };

        set((state) => {
          const currentHistory = state.chatHistory[contactId] || [];
          return {
            chatHistory: {
              ...state.chatHistory,
              [contactId]: [...currentHistory, newMessage],
            },
          };
        });
        
        // Simulate a reply after a short delay
        setTimeout(() => {
          const replyMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: `This is a simulated reply to: "${text}"`,
            timestamp: new Date().toISOString(),
            sender: 'contact',
          };
          
          set((state) => {
            const history = state.chatHistory[contactId] || [];
            const isActive = state.activeContactId === contactId;
            
            // Update unread count if contact is not active
            const updatedContacts = state.contacts.map(c => 
              c.id === contactId 
                ? { ...c, unreadCount: isActive ? 0 : (c.unreadCount || 0) + 1 }
                : c
            );

            return {
              chatHistory: {
                ...state.chatHistory,
                [contactId]: [...history, replyMessage],
              },
              contacts: updatedContacts,
            };
          });
        }, 1500);
      },

      markAsRead: (contactId) => {
        set((state) => ({
          contacts: state.contacts.map(c => 
            c.id === contactId ? { ...c, unreadCount: 0 } : c
          )
        }));
      },

      deleteChat: (contactId) => {
        set((state) => {
          const newContacts = state.contacts.filter(c => c.id !== contactId);
          const newHistory = { ...state.chatHistory };
          delete newHistory[contactId];
          return {
            contacts: newContacts,
            chatHistory: newHistory,
            activeContactId: state.activeContactId === contactId ? null : state.activeContactId
          };
        });
      },

      clearChat: (contactId) => {
        set((state) => ({
          chatHistory: {
            ...state.chatHistory,
            [contactId]: []
          }
        }));
      },

      toggleUnread: (contactId) => {
        set((state) => ({
          contacts: state.contacts.map(c => 
            c.id === contactId 
              ? { ...c, unreadCount: c.unreadCount && c.unreadCount > 0 ? 0 : 1 }
              : c
          )
        }));
      },
    }),
    {
      name: 'whatsapp-clone-storage',
    }
  )
);
