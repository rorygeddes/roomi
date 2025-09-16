'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Calendar, List, Plus, Users, DollarSign, Clock, MapPin } from 'lucide-react'

interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  cost: number
  participants: string[]
  createdBy: string
  createdAt: Date
}

interface Roommate {
  id: string
  name: string
  avatar?: string
}

export const EventsScreen: React.FC = () => {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list')
  const [selectedDate, setSelectedDate] = useState<string>('')

  const roommates: Roommate[] = [
    { id: '1', name: 'Alex' },
    { id: '2', name: 'Sam' },
    { id: '3', name: 'Jordan' },
    { id: '4', name: 'Rory' }
  ]

  const [events] = useState<Event[]>([
    {
      id: '1',
      title: 'Pizza Night',
      description: 'Friday night pizza and movie',
      date: '2024-01-15',
      time: '19:00',
      location: 'Living Room',
      cost: 25.00,
      participants: ['1', '2', '3', '4'],
      createdBy: '1',
      createdAt: new Date('2024-01-10')
    },
    {
      id: '2',
      title: 'Escape Room',
      description: 'Team building escape room challenge',
      date: '2024-01-20',
      time: '14:00',
      location: 'Downtown Escape Room',
      cost: 60.00,
      participants: ['1', '2', '4'],
      createdBy: '2',
      createdAt: new Date('2024-01-12')
    },
    {
      id: '3',
      title: 'House Cleaning',
      description: 'Monthly deep clean',
      date: '2024-01-25',
      time: '10:00',
      location: 'Entire House',
      cost: 0,
      participants: ['1', '2', '3', '4'],
      createdBy: '3',
      createdAt: new Date('2024-01-14')
    }
  ])

  const getParticipantNames = (participantIds: string[]) => {
    return participantIds.map(id => roommates.find(r => r.id === id)?.name || 'Unknown')
  }

  const getCostPerPerson = (cost: number, participantCount: number) => {
    return participantCount > 0 ? cost / participantCount : 0
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const getEventIcon = (title: string) => {
    if (title.toLowerCase().includes('pizza') || title.toLowerCase().includes('food')) {
      return '🍕'
    } else if (title.toLowerCase().includes('escape') || title.toLowerCase().includes('room')) {
      return '🔍'
    } else if (title.toLowerCase().includes('clean') || title.toLowerCase().includes('chore')) {
      return '🧹'
    } else if (title.toLowerCase().includes('party') || title.toLowerCase().includes('night')) {
      return '🎉'
    }
    return '📅'
  }

  const filteredEvents = selectedDate 
    ? events.filter(event => event.date === selectedDate)
    : events

  const sortedEvents = filteredEvents.sort((a, b) => 
    new Date(a.date + 'T' + a.time).getTime() - new Date(b.date + 'T' + b.time).getTime()
  )

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Events & Calendar</h1>
        <Button variant="primary" className="flex items-center space-x-2">
          <Plus size={20} />
          <span>Add Event</span>
        </Button>
      </div>

      {/* View Toggle */}
      <div className="flex bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setViewMode('list')}
          className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-colors ${
            viewMode === 'list'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <List size={20} />
          <span>List View</span>
        </button>
        <button
          onClick={() => setViewMode('calendar')}
          className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-colors ${
            viewMode === 'calendar'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Calendar size={20} />
          <span>Calendar View</span>
        </button>
      </div>

      {/* Date Filter */}
      <div className="flex items-center space-x-4">
        <label className="text-sm font-medium text-gray-700">Filter by date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {selectedDate && (
          <Button
            variant="outline"
            onClick={() => setSelectedDate('')}
            className="text-sm"
          >
            Clear Filter
          </Button>
        )}
      </div>

      {/* Events List */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          {sortedEvents.length === 0 ? (
            <div className="text-center py-12">
              <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">
                {selectedDate ? 'No events on this date' : 'No events scheduled yet'}
              </p>
            </div>
          ) : (
            sortedEvents.map((event) => (
              <div key={event.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">{getEventIcon(event.title)}</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                      <p className="text-gray-600 text-sm mt-1">{event.description}</p>
                      
                      <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar size={16} />
                          <span>{formatDate(event.date)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock size={16} />
                          <span>{formatTime(event.time)}</span>
                        </div>
                        {event.location && (
                          <div className="flex items-center space-x-1">
                            <MapPin size={16} />
                            <span>{event.location}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-4 mt-2 text-sm">
                        <div className="flex items-center space-x-1">
                          <Users size={16} className="text-blue-600" />
                          <span className="text-blue-600">
                            {event.participants.length} participants
                          </span>
                        </div>
                        {event.cost > 0 && (
                          <div className="flex items-center space-x-1">
                            <DollarSign size={16} className="text-green-600" />
                            <span className="text-green-600">
                              ${getCostPerPerson(event.cost, event.participants.length).toFixed(2)} per person
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="mt-3">
                        <div className="flex flex-wrap gap-2">
                          {getParticipantNames(event.participants).map((name, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                            >
                              {name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      Join
                    </Button>
                    <Button variant="outline" size="sm">
                      Not Going
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="text-center py-12">
            <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">Calendar view coming soon!</p>
            <p className="text-sm text-gray-400 mt-2">
              For now, use the list view to see all events
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
