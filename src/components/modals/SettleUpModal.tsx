'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { X, Upload, CheckCircle, DollarSign, Users } from 'lucide-react'

interface Roommate {
  id: string
  name: string
  balance: number
  avatar?: string
}

interface SettleUpModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (roommateId: string, amount: number, proofFile?: File) => void
  roommates: Roommate[]
  currentUserId: string
}

export const SettleUpModal: React.FC<SettleUpModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  roommates,
  currentUserId
}) => {
  const [selectedRoommate, setSelectedRoommate] = useState<string>('')
  const [settleAmount, setSettleAmount] = useState<number>(0)
  const [proofFile, setProofFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  // Filter roommates who owe money to current user
  const roommatesWhoOwe = roommates.filter(roommate => 
    roommate.id !== currentUserId && roommate.balance > 0
  )

  const handleRoommateSelect = (roommateId: string) => {
    setSelectedRoommate(roommateId)
    const roommate = roommates.find(r => r.id === roommateId)
    if (roommate) {
      setSettleAmount(roommate.balance)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setProofFile(file)
    }
  }

  const handleConfirm = async () => {
    if (!selectedRoommate || settleAmount <= 0) return

    setIsUploading(true)
    try {
      await onConfirm(selectedRoommate, settleAmount, proofFile || undefined)
      onClose()
      // Reset form
      setSelectedRoommate('')
      setSettleAmount(0)
      setProofFile(null)
    } catch (error) {
      console.error('Error settling up:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const getBalanceColor = (balance: number) => {
    return balance >= 0 ? 'text-green-600' : 'text-red-600'
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Settle Up</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg" title="Close modal">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Select Roommate */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Who owes you money?</h3>
            <div className="space-y-2">
              {roommatesWhoOwe.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users size={48} className="mx-auto mb-2 text-gray-300" />
                  <p>No one owes you money right now!</p>
                </div>
              ) : (
                roommatesWhoOwe.map((roommate) => (
                  <button
                    key={roommate.id}
                    onClick={() => handleRoommateSelect(roommate.id)}
                    className={`w-full p-4 rounded-lg border-2 transition-colors ${
                      selectedRoommate === roommate.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                          {roommate.name[0]}
                        </div>
                        <div className="text-left">
                          <h4 className="font-medium text-gray-900">{roommate.name}</h4>
                          <p className="text-sm text-gray-500">Owes you money</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${getBalanceColor(roommate.balance)}`}>
                          ${roommate.balance.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Amount */}
          {selectedRoommate && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Settlement Amount</h3>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="number"
                  step="0.01"
                  value={settleAmount}
                  onChange={(e) => setSettleAmount(parseFloat(e.target.value) || 0)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Enter the amount you&apos;re settling for
              </p>
            </div>
          )}

          {/* Proof Upload */}
          {selectedRoommate && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Upload Proof (Optional)</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 mb-4">
                  Upload a screenshot of your payment (e-transfer, Venmo, etc.)
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="proof-upload"
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('proof-upload')?.click()}
                >
                  Choose File
                </Button>
                {proofFile && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center space-x-2">
                      <CheckCircle size={16} className="text-green-600" />
                      <span className="text-sm text-green-800">{proofFile.name}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Summary */}
          {selectedRoommate && (
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">Settlement Summary</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-700">Settling with:</span>
                  <span className="font-medium text-blue-900">
                    {roommates.find(r => r.id === selectedRoommate)?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Amount:</span>
                  <span className="font-medium text-blue-900">${settleAmount.toFixed(2)}</span>
                </div>
                {proofFile && (
                  <div className="flex justify-between">
                    <span className="text-blue-700">Proof:</span>
                    <span className="font-medium text-blue-900">Uploaded</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={!selectedRoommate || settleAmount <= 0 || isUploading}
          >
            {isUploading ? 'Processing...' : 'Confirm Settlement'}
          </Button>
        </div>
      </div>
    </div>
  )
}
