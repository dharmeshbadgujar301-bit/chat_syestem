import { Contact, ChatHistory } from '@/types';

export const initialContacts: Contact[] = [
  { id: '1', name: 'Rahul' },
  { id: '2', name: 'Priya' },
  { id: '3', name: 'Amit' },
  { id: '4', name: 'Karan' },
];

export const initialChatHistory: ChatHistory = {
  '1': [
    { id: 'm1', text: 'Hey Rahul! How are you?', timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), sender: 'me' },
    { id: 'm2', text: 'Hi! I am doing great. What about you?', timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), sender: 'contact' },
    { id: 'm3', text: 'All good here, working on a Next.js project.', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), sender: 'me' },
  ],
  '2': [
    { id: 'm4', text: 'Are we still meeting at 5?', timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), sender: 'contact' },
    { id: 'm5', text: 'Yes, see you there!', timestamp: new Date(Date.now() - 1000 * 60 * 110).toISOString(), sender: 'me' },
  ],
  '3': [
    { id: 'm6', text: 'Did you check the new design?', timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(), sender: 'me' },
    { id: 'm7', text: 'Not yet, will do it shortly.', timestamp: new Date(Date.now() - 1000 * 60 * 200).toISOString(), sender: 'contact' },
  ],
  '4': [
    { id: 'm8', text: 'Bro, can you send the document?', timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), sender: 'contact' },
  ]
};
