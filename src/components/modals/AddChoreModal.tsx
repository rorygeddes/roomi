'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { X, Calendar, Users, CheckSquare } from 'lucide-react'

interface Roommate {
  id: string
  name: string
  avatar?: string
}

interface AddChoreModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (chore: {
    title: string
    description: string
    assigneeId: string
    dueDate: string
    points: number
  }) => void
  roommates: Roommate[]
}

export const AddChoreModal: React.FC<AddChoreModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  roommates
}) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [assigneeId, setAssigneeId] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [points, setPoints] = useState(5)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !assigneeId || !dueDate) return

    onAdd({
      title,
      description,
      assigneeId,
      dueDate,
      points
    })

    // Reset form
    setTitle('')
    setDescription('')
    setAssigneeId('')
    setDueDate('')
    setPoints(5)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Add Chore</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg" title="Close modal">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chore Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Take out trash"
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
              placeholder="Additional details..."
              rows={3}
            />
          </div>

          {/* Assignee */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assign to *
            </label>
            <div className="space-y-2">
              {roommates.map((roommate) => (
                <button
                  key={roommate.id}
                  type="button"
                  onClick={() => setAssigneeId(roommate.id)}
                  className={`w-full p-3 rounded-lg border-2 transition-colors ${
                    assigneeId === roommate.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {roommate.name[0]}
                    </div>
                    <span className="font-medium text-gray-900">{roommate.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Due Date *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Points */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Points Value
            </label>
            <div className="flex items-center space-x-3">
              <CheckSquare className="text-gray-400" size={20} />
              <input
                type="number"
                min="1"
                max="20"
                value={points}
                onChange={(e) => setPoints(parseInt(e.target.value) || 5)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-500">points</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Points awarded when chore is completed
            </p>
          </div>

          {/* Summary */}
          {title && assigneeId && dueDate && (
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">Chore Summary</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-700">Title:</span>
                  <span className="font-medium text-blue-900">{title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Assigned to:</span>
                  <span className="font-medium text-blue-900">
                    {roommates.find(r => r.id === assigneeId)?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Due:</span>
                  <span className="font-medium text-blue-900">
                    {new Date(dueDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Points:</span>
                  <span className="font-medium text-blue-900">{points}</span>
                </div>
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
            disabled={!title || !assigneeId || !dueDate}
          >
            Add Chore
          </Button>
        </div>
      </div>
    </div>
  )
}
