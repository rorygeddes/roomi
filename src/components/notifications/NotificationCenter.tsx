'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { X, Bell, CheckCircle, DollarSign, Calendar, CheckSquare, Users, Trophy } from 'lucide-react'

export interface Notification {
  id: string
  type: 'expense' | 'chore' | 'event' | 'payment' | 'nudge' | 'leaderboard'
  title: string
  message: string
  timestamp: Date
  read: boolean
  actionUrl?: string
  metadata?: Record<string, unknown>
}

interface NotificationCenterProps {
  isOpen: boolean
  onClose: () => void
  notifications: Notification[]
  onMarkAsRead: (notificationId: string) => void
  onClearAll: () => void
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onClearAll
}) => {
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'expense': return <DollarSign size={20} className="text-green-600" />
      case 'chore': return <CheckSquare size={20} className="text-blue-600" />
      case 'event': return <Calendar size={20} className="text-purple-600" />
      case 'payment': return <CheckCircle size={20} className="text-green-600" />
      case 'nudge': return <Users size={20} className="text-orange-600" />
      case 'leaderboard': return <Trophy size={20} className="text-yellow-600" />
      default: return <Bell size={20} className="text-gray-600" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'expense': return 'border-l-green-500 bg-green-50'
      case 'chore': return 'border-l-blue-500 bg-blue-50'
      case 'event': return 'border-l-purple-500 bg-purple-50'
      case 'payment': return 'border-l-green-500 bg-green-50'
      case 'nudge': return 'border-l-orange-500 bg-orange-50'
      case 'leaderboard': return 'border-l-yellow-500 bg-yellow-50'
      default: return 'border-l-gray-500 bg-gray-50'
    }
  }

  const filteredNotifications = notifications.filter(notification => 
    filter === 'all' || !notification.read
  )

  const unreadCount = notifications.filter(n => !n.read).length

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Bell size={24} className="text-gray-700" />
            <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                {unreadCount}
              </span>
            )}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg" title="Close notifications">
            <X size={20} />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 py-3 px-4 text-sm font-medium ${
              filter === 'all'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`flex-1 py-3 px-4 text-sm font-medium ${
              filter === 'unread'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Unread ({unreadCount})
          </button>
        </div>

        {/* Notifications List */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">
                {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-l-4 ${getNotificationColor(notification.type)} ${
                    !notification.read ? 'bg-white' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className={`text-sm font-medium ${
                          !notification.read ? 'text-gray-900' : 'text-gray-600'
                        }`}>
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        {notification.timestamp.toLocaleString()}
                      </p>
                    </div>
                    {!notification.read && (
                      <button
                        onClick={() => onMarkAsRead(notification.id)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
            <Button variant="outline" onClick={onClearAll}>
              Clear All
            </Button>
            <Button variant="primary" onClick={onClose}>
              Done
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
