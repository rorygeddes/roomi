'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { X, Check, Users, CheckCircle, AlertCircle } from 'lucide-react'
import { ParsedTransaction } from '@/lib/openai'

interface TransactionReviewModalProps {
  isOpen: boolean
  transactions: ParsedTransaction[]
  roommates: Array<{ id: string; name: string }>
  onAccept: (transactions: ParsedTransaction[], selectedRoommates: string[]) => void
  onClose: () => void
}

export const TransactionReviewModal: React.FC<TransactionReviewModalProps> = ({
  isOpen,
  transactions,
  roommates,
  onAccept,
  onClose
}) => {
  const [editedTransactions, setEditedTransactions] = useState(transactions)
  const [selectedRoommates, setSelectedRoommates] = useState<string[]>(roommates.map(r => r.id))

  const handleTransactionEdit = (index: number, field: keyof ParsedTransaction, value: string | number) => {
    const updated = [...editedTransactions]
    updated[index] = { ...updated[index], [field]: value }
    setEditedTransactions(updated)
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-600'
    if (confidence >= 0.7) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 0.9) return <CheckCircle size={16} className="text-green-600" />
    if (confidence >= 0.7) return <AlertCircle size={16} className="text-yellow-600" />
    return <AlertCircle size={16} className="text-red-600" />
  }

  const handleRoommateToggle = (roommateId: string) => {
    setSelectedRoommates(prev => 
      prev.includes(roommateId) 
        ? prev.filter(id => id !== roommateId)
        : [...prev, roommateId]
    )
  }

  const handleAccept = () => {
    onAccept(editedTransactions, selectedRoommates)
  }

  const totalAmount = editedTransactions.reduce((sum, t) => sum + t.amount, 0)
  const splitAmount = selectedRoommates.length > 0 ? totalAmount / selectedRoommates.length : 0

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Review Transactions</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg" title="Close modal">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Transactions Table */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Transactions</h3>
            <div className="space-y-3">
              {editedTransactions.map((transaction, index) => (
                <div key={transaction.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="grid grid-cols-4 gap-3 mb-3">
                    <div>
                      <label className="text-xs font-medium text-gray-700 mb-1 block">Date</label>
                      <input
                        type="date"
                        value={transaction.date}
                        onChange={(e) => handleTransactionEdit(index, 'date', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        title="Transaction date"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-700 mb-1 block">Description</label>
                      <input
                        type="text"
                        value={transaction.description}
                        onChange={(e) => handleTransactionEdit(index, 'description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Description"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-700 mb-1 block">Amount</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          step="0.01"
                          value={transaction.amount}
                          onChange={(e) => handleTransactionEdit(index, 'amount', parseFloat(e.target.value) || 0)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Amount"
                        />
                        <div className="flex items-center space-x-1">
                          {getConfidenceIcon(transaction.confidence)}
                          <span className={`text-xs ${getConfidenceColor(transaction.confidence)}`}>
                            {Math.round(transaction.confidence * 100)}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-700 mb-1 block">Category</label>
                      <select
                        value={transaction.category || 'Miscellaneous'}
                        onChange={(e) => handleTransactionEdit(index, 'category', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        title="Transaction category"
                      >
                        <option value="Rent">🏠 Rent</option>
                        <option value="Groceries">🛒 Groceries</option>
                        <option value="Utilities">💡 Utilities</option>
                        <option value="Internet">🌐 Internet</option>
                        <option value="Fun/Entertainment">🎉 Fun/Entertainment</option>
                        <option value="Household Items">🧹 Household Items</option>
                        <option value="Miscellaneous">🔖 Miscellaneous</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Roommate Selection */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Split with Roommates</h3>
            <div className="grid grid-cols-2 gap-2">
              {roommates.map((roommate) => (
                <button
                  key={roommate.id}
                  onClick={() => handleRoommateToggle(roommate.id)}
                  className={`flex items-center space-x-2 p-3 rounded-lg border transition-colors ${
                    selectedRoommates.includes(roommate.id)
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                    selectedRoommates.includes(roommate.id)
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {selectedRoommates.includes(roommate.id) && (
                      <Check size={12} className="text-white" />
                    )}
                  </div>
                  <span className="font-medium">{roommate.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Users size={20} className="text-gray-600" />
              <h3 className="font-semibold text-gray-900">Split Summary</h3>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Total Amount:</span>
                <span className="font-medium">${totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Split Between:</span>
                <span className="font-medium">{selectedRoommates.length} roommates</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Each Person Owes:</span>
                <span>${splitAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-4 border-t border-gray-200">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleAccept}
            disabled={selectedRoommates.length === 0}
          >
            Accept & Split
          </Button>
        </div>
      </div>
    </div>
  )
}
