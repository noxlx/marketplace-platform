'use client';

import { useState } from 'react';

interface Message {
  id: string;
  sender: string;
  content: string;
  time: string;
  isOwn: boolean;
}

interface Conversation {
  id: string;
  name: string;
  listing: string;
  lastMessage: string;
  avatar: string;
  unread: number;
}

const CONVERSATIONS: Conversation[] = [
  {
    id: '1',
    name: 'Ahmed Al-Rashid',
    listing: 'iPhone 13 Pro',
    lastMessage: 'Is this still available?',
    avatar: 'A',
    unread: 1,
  },
  {
    id: '2',
    name: 'Fatima Hassan',
    listing: 'Apartment for Rent',
    lastMessage: 'Thanks for the info!',
    avatar: 'F',
    unread: 0,
  },
  {
    id: '3',
    name: 'Mohammed Karim',
    listing: 'Used Toyota',
    lastMessage: 'Can you go down to 50k?',
    avatar: 'M',
    unread: 0,
  },
];

const MESSAGES: Message[] = [
  {
    id: '1',
    sender: 'Ahmed Al-Rashid',
    content: 'Hi, is this iPhone still available?',
    time: '10:30 AM',
    isOwn: false,
  },
  {
    id: '2',
    sender: 'You',
    content: 'Yes, it is! Excellent condition, barely used.',
    time: '10:32 AM',
    isOwn: true,
  },
  {
    id: '3',
    sender: 'Ahmed Al-Rashid',
    content: 'Can you do any negotiation on the price?',
    time: '10:35 AM',
    isOwn: false,
  },
];

export default function Chat() {
  const [selectedConversation, setSelectedConversation] = useState('1');
  const [messageText, setMessageText] = useState('');

  const handleSendMessage = () => {
    if (messageText.trim()) {
      // Add message
      setMessageText('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Messages</h1>

        <div className="grid lg:grid-cols-3 gap-6 h-96 lg:h-auto">
          {/* Conversation List */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow overflow-hidden">
            <div className="divide-y max-h-96 overflow-y-auto lg:max-h-none lg:h-full">
              {CONVERSATIONS.map(conv => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv.id)}
                  className={`w-full text-left p-4 hover:bg-gray-50 transition ${
                    selectedConversation === conv.id ? 'bg-teal-50 border-l-4 border-teal-600' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold">
                      {conv.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{conv.name}</h3>
                      <p className="text-xs text-gray-500 truncate">{conv.listing}</p>
                      <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                    </div>
                    {conv.unread > 0 && (
                      <div className="w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {conv.unread}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow overflow-hidden flex flex-col">
            {/* Header */}
            <div className="border-b p-4 bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold">
                  A
                </div>
                <div>
                  <h3 className="font-semibold">Ahmed Al-Rashid</h3>
                  <p className="text-sm text-gray-500">About iPhone 13 Pro</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {MESSAGES.map(msg => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md ${msg.isOwn ? 'bg-teal-600' : 'bg-gray-100'} ${msg.isOwn ? 'text-white' : 'text-gray-900'} rounded-lg p-3`}>
                    <p>{msg.content}</p>
                    <p className={`text-xs mt-1 ${msg.isOwn ? 'text-teal-100' : 'text-gray-500'}`}>{msg.time}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="border-t p-4 bg-gray-50">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition font-medium"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
