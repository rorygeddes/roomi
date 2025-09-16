'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { 
  DollarSign, 
  Calendar, 
  Gavel, 
  TrendingUp,
  CheckCircle,
  Clock,
  Users
} from 'lucide-react'
import { getGreeting, formatCurrency } from '@/lib/utils'

interface Roommate {
  id: string
  name: string
  balance: number
  avatar?: string
}

interface Task {
  id: string
  type: 'payment' | 'chore' | 'cooking' | 'event'
  title: string
  due?: string
  icon: React.ReactNode
}

interface FeaturedEvent {
  id: string
  title: string
  date: string
  attendees: number
  cost?: number
}

export const HomeScreen: React.FC = () => {
  const [greeting, setGreeting] = useState('')
  const [userBalance, setUserBalance] = useState(-45.50)
  const [roommates, setRoommates] = useState<Roommate[]>([
    { id: '1', name: 'Alex', balance: 23.75 },
    { id: '2', name: 'Sam', balance: -12.30 },
    { id: '3', name: 'Jordan', balance: 8.90 },
  ])

  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', type: 'payment', title: 'Pay Alex $23.75', icon: <DollarSign size={16} /> },
    { id: '2', type: 'chore', title: 'Take out trash', icon: <CheckCircle size={16} /> },
    { id: '3', type: 'cooking', title: 'Cook dinner tonight', icon: <Clock size={16} /> },
  ])

  const [featuredEvent, setFeaturedEvent] = useState<FeaturedEvent>({
    id: '1',
    title: 'Pizza Night 🍕',
    date: 'Tonight at 7 PM',
    attendees: 3,
    cost: 45
  })

  useEffect(() => {
    setGreeting(getGreeting())
  }, [])

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'payment': return '💸'
      case 'chore': return '🧹'
      case 'cooking': return '🍳'
      case 'event': return '🎉'
      default: return '📋'
    }
  }

  const getBalanceColor = (balance: number) => {
    return balance >= 0 ? 'text-green-600' : 'text-red-600'
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          {greeting || "Good morning! Happy Monday!"}
        </h1>
        <p className="text-gray-600 mt-1">Let's make today great!</p>
      </div>

      {/* Daily Tasks Bubble */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Today's Tasks</h2>
        <div className="space-y-2">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-center space-x-3 p-2 rounded-lg bg-gray-50">
              <span className="text-lg">{getTaskIcon(task.type)}</span>
              <span className="flex-1 text-gray-700">{task.title}</span>
              {task.due && <span className="text-sm text-gray-500">{task.due}</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Balances */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Balances</h2>
          <div className={`text-2xl font-bold ${getBalanceColor(userBalance)}`}>
            {formatCurrency(Math.abs(userBalance))}
            <span className="text-sm font-normal ml-1">
              {userBalance >= 0 ? 'owed to you' : 'you owe'}
            </span>
          </div>
        </div>
        
        <div className="space-y-2">
          {roommates.map((roommate) => (
            <div key={roommate.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {roommate.name[0]}
                </div>
                <span className="font-medium text-gray-900">{roommate.name}</span>
              </div>
              <span className={`font-semibold ${getBalanceColor(roommate.balance)}`}>
                {formatCurrency(Math.abs(roommate.balance))}
                <span className="text-xs font-normal ml-1">
                  {roommate.balance >= 0 ? 'owes you' : 'you owe'}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Event */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-4 text-white">
        <h2 className="text-lg font-semibold mb-2">Featured Event</h2>
        <div className="space-y-2">
          <h3 className="text-xl font-bold">{featuredEvent.title}</h3>
          <p className="text-blue-100">{featuredEvent.date}</p>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <Users size={16} />
              <span>{featuredEvent.attendees} going</span>
            </div>
            {featuredEvent.cost && (
              <div className="flex items-center space-x-1">
                <DollarSign size={16} />
                <span>{formatCurrency(featuredEvent.cost)} total</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-3">
        <Button 
          variant="primary" 
          className="flex flex-col items-center py-4 space-y-2"
        >
          <DollarSign size={24} />
          <span className="text-sm">Settle Up</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="flex flex-col items-center py-4 space-y-2"
        >
          <Calendar size={24} />
          <span className="text-sm">Add Event</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="flex flex-col items-center py-4 space-y-2"
        >
          <Gavel size={24} />
          <span className="text-sm">House Rules</span>
        </Button>
      </div>
    </div>
  )
}
