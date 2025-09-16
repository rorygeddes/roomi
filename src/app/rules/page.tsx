'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Plus, Edit, Trash2, Shield } from 'lucide-react'

interface HouseRule {
  id: string
  title: string
  description: string
  updatedAt: string
  createdBy: string
}

export default function Rules() {
  const [rules, setRules] = useState<HouseRule[]>([
    {
      id: '1',
      title: 'Kitchen Cleanup',
      description: 'Clean up after yourself immediately after cooking. Dishes must be done within 2 hours.',
      updatedAt: '2024-01-15',
      createdBy: 'Alex'
    },
    {
      id: '2',
      title: 'Quiet Hours',
      description: 'No loud music or TV after 11 PM on weekdays, 1 AM on weekends.',
      updatedAt: '2024-01-10',
      createdBy: 'Rory'
    },
    {
      id: '3',
      title: 'Guest Policy',
      description: 'Let roommates know 24 hours in advance if you\'re having guests over.',
      updatedAt: '2024-01-08',
      createdBy: 'Jordan'
    }
  ])

  const [isCommissionerMode, setIsCommissionerMode] = useState(false)
  const [showAddRule, setShowAddRule] = useState(false)

  return (
    <div className="p-4 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">House Rules</h1>
        <p className="text-gray-600 mt-1">Shared agreements for the house</p>
      </div>

      {/* Commissioner Mode Toggle */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield size={24} className="text-blue-600" />
            <div>
              <h3 className="font-semibold text-gray-900">Commissioner Mode</h3>
              <p className="text-sm text-gray-500">Only house leader can edit rules</p>
            </div>
          </div>
          <button
            onClick={() => setIsCommissionerMode(!isCommissionerMode)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isCommissionerMode ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isCommissionerMode ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Add Rule Button */}
      <Button 
        variant="primary" 
        className="w-full flex items-center justify-center space-x-2"
        onClick={() => setShowAddRule(true)}
      >
        <Plus size={20} />
        <span>Add New Rule</span>
      </Button>

      {/* Rules List */}
      <div className="space-y-4">
        {rules.map((rule) => (
          <div key={rule.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-gray-900 text-lg">{rule.title}</h3>
              {!isCommissionerMode && (
                <div className="flex space-x-2">
                  <button className="p-1 text-gray-400 hover:text-blue-600">
                    <Edit size={16} />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-red-600">
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>
            <p className="text-gray-700 mb-3">{rule.description}</p>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Created by {rule.createdBy}</span>
              <span>Updated {rule.updatedAt}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {rules.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Shield size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No rules yet</h3>
          <p className="text-gray-500 mb-4">Add your first house rule to get started</p>
          <Button variant="primary" onClick={() => setShowAddRule(true)}>
            Add First Rule
          </Button>
        </div>
      )}
    </div>
  )
}
