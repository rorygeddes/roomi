'use client'

import { useState, useEffect, useCallback } from 'react'
import { Notification } from '@/components/notifications/NotificationCenter'

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  // Load notifications from localStorage on mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem('roomi-notifications')
    if (savedNotifications) {
      const parsed = JSON.parse(savedNotifications).map((n: Record<string, unknown>) => ({
        ...n,
        timestamp: new Date(n.timestamp as string)
      }))
      setNotifications(parsed)
      setUnreadCount(parsed.filter((n: Notification) => !n.read).length)
    }
  }, [])

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('roomi-notifications', JSON.stringify(notifications))
    setUnreadCount(notifications.filter(n => !n.read).length)
  }, [notifications])

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      read: false
    }
    
    setNotifications(prev => [newNotification, ...prev])
  }, [])

  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    )
  }, [])

  const clearAll = useCallback(() => {
    setNotifications([])
  }, [])

  const clearRead = useCallback(() => {
    setNotifications(prev => prev.filter(notification => !notification.read))
  }, [])

  // Helper functions for common notification types
  const notifyExpenseAdded = useCallback((amount: number, description: string, roommates: string[]) => {
    addNotification({
      type: 'expense',
      title: 'New Expense Added',
      message: `$${amount.toFixed(2)} for ${description} split with ${roommates.length} roommates`
    })
  }, [addNotification])

  const notifyChoreAssigned = useCallback((choreTitle: string, assignee: string) => {
    addNotification({
      type: 'chore',
      title: 'New Chore Assigned',
      message: `"${choreTitle}" assigned to ${assignee}`
    })
  }, [addNotification])

  const notifyEventCreated = useCallback((eventTitle: string, date: string, participants: string[]) => {
    addNotification({
      type: 'event',
      title: 'New Event Created',
      message: `"${eventTitle}" on ${date} with ${participants.length} participants`
    })
  }, [addNotification])

  const notifyPaymentSettled = useCallback((amount: number, roommate: string) => {
    addNotification({
      type: 'payment',
      title: 'Payment Settled',
      message: `$${amount.toFixed(2)} settled with ${roommate}`
    })
  }, [addNotification])

  const notifyLeaderboardUpdate = useCallback((winner: string, points: number) => {
    addNotification({
      type: 'leaderboard',
      title: 'Leaderboard Updated',
      message: `${winner} is now leading with ${points} points!`
    })
  }, [addNotification])

  const notifyNudge = useCallback((from: string, message: string) => {
    addNotification({
      type: 'nudge',
      title: `Nudge from ${from}`,
      message: message
    })
  }, [addNotification])

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    clearAll,
    clearRead,
    // Helper functions
    notifyExpenseAdded,
    notifyChoreAssigned,
    notifyEventCreated,
    notifyPaymentSettled,
    notifyLeaderboardUpdate,
    notifyNudge
  }
}
