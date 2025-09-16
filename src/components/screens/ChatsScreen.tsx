'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { 
  MessageCircle, 
  Users, 
  Phone, 
  Mail,
  Pin,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react'

interface ChatMessage {
  id: string
  sender: string
  content: string
  timestamp: string
  type: 'text' | 'expense' | 'event' | 'system'
}

export const ChatsScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'group' | 'dm' | 'landlord'>('group')

  const groupMessages: ChatMessage[] = [
    { id: '1', sender: 'Alex', content: 'Pizza night tonight? 🍕', timestamp: '2:30 PM', type: 'text' },
    { id: '2', sender: 'Sam', content: 'Yes! Count me in', timestamp: '2:32 PM', type: 'text' },
    { id: '3', sender: 'System', content: 'Rory added a new expense: Groceries - $45.50', timestamp: '2:35 PM', type: 'expense' },
    { id: '4', sender: 'Jordan', content: 'I\'ll pick up the pizza!', timestamp: '2:40 PM', type: 'text' },
  ]

  const directMessages = [
    { id: '1', name: 'Alex', lastMessage: 'Thanks for covering groceries!', timestamp: '2:35 PM', balance: 23.75 },
    { id: '2', name: 'Sam', lastMessage: 'See you at pizza night', timestamp: '2:32 PM', balance: -12.30 },
    { id: '3', name: 'Jordan', lastMessage: 'I\'ll grab the pizza', timestamp: '2:40 PM', balance: 8.90 },
  ]

  const landlordInfo = {
    name: 'Mike Johnson',
    phone: '(555) 123-4567',
    email: 'mike@rentalproperty.com',
    notes: 'Prefers text messages for maintenance requests'
  }

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'expense': return '💸'
      case 'event': return '🎉'
      case 'system': return '🔔'
      default: return '💬'
    }
  }

  const getBalanceColor = (balance: number) => {
    return balance >= 0 ? 'text-green-600' : 'text-red-600'
  }

  return (
    <div className="p-4 space-y-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">Chats</h1>
        <p className="text-gray-600 mt-1">Stay connected with your roommates</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('group')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'group' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Group
        </button>
        <button
          onClick={() => setActiveTab('dm')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'dm' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Direct
        </button>
        <button
          onClick={() => setActiveTab('landlord')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'landlord' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Landlord
        </button>
      </div>

      {/* Group Chat */}
      {activeTab === 'group' && (
        <div className="space-y-4">
          {/* Pinned Messages */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <Pin size={16} className="text-yellow-600" />
              <span className="text-sm font-medium text-yellow-800">Pinned</span>
            </div>
            <div className="text-sm text-yellow-700">
              <div>Wi-Fi Password: Roomie2024!</div>
              <div>Rent due: 1st of every month</div>
            </div>
          </div>

          {/* Messages */}
          <div className="space-y-3">
            {groupMessages.map((message) => (
              <div key={message.id} className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {message.sender[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-gray-900">{message.sender}</span>
                      <span className="text-xs text-gray-500">{message.timestamp}</span>
                      <span className="text-sm">{getMessageIcon(message.type)}</span>
                    </div>
                    <p className="text-gray-700">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Poll */}
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <h3 className="font-medium text-gray-900 mb-3">Pizza tonight? 🍕</h3>
            <div className="flex space-x-3">
              <Button variant="outline" size="sm" className="flex items-center space-x-2">
                <ThumbsUp size={16} />
                <span>Yes (3)</span>
              </Button>
              <Button variant="outline" size="sm" className="flex items-center space-x-2">
                <ThumbsDown size={16} />
                <span>No (0)</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Direct Messages */}
      {activeTab === 'dm' && (
        <div className="space-y-3">
          {directMessages.map((dm) => (
            <div key={dm.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                    {dm.name[0]}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{dm.name}</h3>
                    <p className="text-sm text-gray-500">{dm.lastMessage}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">{dm.timestamp}</p>
                  <p className={`text-sm font-medium ${getBalanceColor(dm.balance)}`}>
                    {dm.balance >= 0 ? `+$${dm.balance.toFixed(2)}` : `-$${Math.abs(dm.balance).toFixed(2)}`}
                  </p>
                </div>
              </div>
              {dm.balance !== 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <Button variant="outline" size="sm" className="w-full">
                    Nudge for Payment
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Landlord Chat */}
      {activeTab === 'landlord' && (
        <div className="space-y-4">
          {/* Landlord Info */}
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <h3 className="font-medium text-gray-900 mb-3">Landlord Contact</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium">{landlordInfo.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Phone:</span>
                <span className="font-medium">{landlordInfo.phone}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{landlordInfo.email}</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-500 mb-3">{landlordInfo.notes}</p>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <Phone size={16} />
                  <span>Call</span>
                </Button>
                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <MessageCircle size={16} />
                  <span>Text</span>
                </Button>
                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <Mail size={16} />
                  <span>Email</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <h3 className="font-medium text-gray-900 mb-3">Recent Messages</h3>
            <div className="text-center py-8 text-gray-500">
              <MessageCircle size={48} className="mx-auto mb-2 text-gray-300" />
              <p>No messages yet</p>
              <p className="text-sm">Start a conversation with your landlord</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
