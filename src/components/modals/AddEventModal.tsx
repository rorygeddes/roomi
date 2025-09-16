'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { X, Calendar, Users, DollarSign, Clock } from 'lucide-react'

interface Roommate {
  id: string
  name: string
  avatar?: string
}

interface AddEventModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (event: {
    title: string
    description: string
    date: string
    time: string
    location: string
    cost: number
    participants: string[]
  }) => void
  roommates: Roommate[]
}

export const AddEventModal: React.FC<AddEventModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  roommates
}) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [location, setLocation] = useState('')
  const [cost, setCost] = useState(0)
  const [participants, setParticipants] = useState<string[]>([])

  const handleParticipantToggle = (roommateId: string) => {
    setParticipants(prev => 
      prev.includes(roommateId)
        ? prev.filter(id => id !== roommateId)
        : [...prev, roommateId]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !date || !time || participants.length === 0) return

    onAdd({
      title,
      description,
      date,
      time,
      location,
      cost,
      participants
    })

    // Reset form
    setTitle('')
    setDescription('')
    setDate('')
    setTime('')
    setLocation('')
    setCost(0)
    setParticipants([])
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Add Event</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg" title="Close modal">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Pizza Night, House Party"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="What's this event about?"
              rows={3}
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time *
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Living room, Local restaurant"
            />
          </div>

          {/* Cost */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Total Cost
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="number"
                step="0.01"
                min="0"
                value={cost}
                onChange={(e) => setCost(parseFloat(e.target.value) || 0)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Cost will be split among participants
            </p>
          </div>

          {/* Participants */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Participants *
            </label>
            <div className="space-y-2">
              {roommates.map((roommate) => (
                <button
                  key={roommate.id}
                  type="button"
                  onClick={() => handleParticipantToggle(roommate.id)}
                  className={`w-full p-3 rounded-lg border-2 transition-colors ${
                    participants.includes(roommate.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                      participants.includes(roommate.id)
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {participants.includes(roommate.id) && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {roommate.name[0]}
                    </div>
                    <span className="font-medium text-gray-900">{roommate.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Summary */}
          {title && date && time && participants.length > 0 && (
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">Event Summary</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-700">Event:</span>
                  <span className="font-medium text-blue-900">{title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">When:</span>
                  <span className="font-medium text-blue-900">
                    {new Date(date).toLocaleDateString()} at {time}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Participants:</span>
                  <span className="font-medium text-blue-900">{participants.length}</span>
                </div>
                {cost > 0 && (
                  <div className="flex justify-between">
                    <span className="text-blue-700">Cost per person:</span>
                    <span className="font-medium text-blue-900">
                      ${(cost / participants.length).toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            onClick={handleSubmit}
            disabled={!title || !date || !time || participants.length === 0}
          >
            Create Event
          </Button>
        </div>
      </div>
    </div>
  )
}
