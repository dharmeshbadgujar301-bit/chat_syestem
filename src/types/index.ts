export interface Message {
  id: string;
  text: string;
  timestamp: string;
  sender: 'me' | 'contact';
  attachment?: string;
}

export interface Contact {
  id: string;
  name: string;
  avatar?: string;
  unreadCount?: number;
}

export interface ChatHistory {
  [contactId: string]: Message[];
}
