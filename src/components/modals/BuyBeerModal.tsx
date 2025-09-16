'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { X, Beer, Pizza, Coffee, DollarSign } from 'lucide-react'

interface Roommate {
  id: string
  name: string
  balance: number
  avatar?: string
}

interface BuyBeerModalProps {
  isOpen: boolean
  onClose: () => void
  onConvert: (roommateId: string, funAmount: number, funType: 'beer' | 'pizza' | 'coffee') => void
  roommates: Roommate[]
  currentUserId: string
  houseSettings: {
    beerValue: number
    pizzaValue: number
    coffeeValue: number
  }
}

export const BuyBeerModal: React.FC<BuyBeerModalProps> = ({
  isOpen,
  onClose,
  onConvert,
  roommates,
  currentUserId,
  houseSettings
}) => {
  const [selectedRoommate, setSelectedRoommate] = useState<string>('')
  const [funType, setFunType] = useState<'beer' | 'pizza' | 'coffee'>('beer')
  const [funAmount, setFunAmount] = useState<number>(1)

  // Filter roommates who owe money to current user
  const roommatesWhoOwe = roommates.filter(roommate => 
    roommate.id !== currentUserId && roommate.balance > 0
  )

  const getFunTypeIcon = (type: string) => {
    switch (type) {
      case 'beer': return <Beer size={20} />
      case 'pizza': return <Pizza size={20} />
      case 'coffee': return <Coffee size={20} />
      default: return <Beer size={20} />
    }
  }

  const getFunTypeValue = (type: string) => {
    switch (type) {
      case 'beer': return houseSettings.beerValue
      case 'pizza': return houseSettings.pizzaValue
      case 'coffee': return houseSettings.coffeeValue
      default: return houseSettings.beerValue
    }
  }

  const getFunTypeLabel = (type: string) => {
    switch (type) {
      case 'beer': return 'Beers'
      case 'pizza': return 'Pizzas'
      case 'coffee': return 'Coffees'
      default: return 'Beers'
    }
  }

  const getTotalValue = () => {
    return funAmount * getFunTypeValue(funType)
  }

  const getMaxAmount = () => {
    if (!selectedRoommate) return 0
    const roommate = roommates.find(r => r.id === selectedRoommate)
    if (!roommate) return 0
    return Math.floor(roommate.balance / getFunTypeValue(funType))
  }

  const handleConvert = () => {
    if (!selectedRoommate || funAmount <= 0) return

    onConvert(selectedRoommate, funAmount, funType)
    onClose()
    
    // Reset form
    setSelectedRoommate('')
    setFunAmount(1)
    setFunType('beer')
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
          <h2 className="text-xl font-bold text-gray-900">Buy You a Beer</h2>
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
                  <Beer size={48} className="mx-auto mb-2 text-gray-300" />
                  <p>No one owes you money right now!</p>
                </div>
              ) : (
                roommatesWhoOwe.map((roommate) => (
                  <button
                    key={roommate.id}
                    onClick={() => setSelectedRoommate(roommate.id)}
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

          {/* Fun Type Selection */}
          {selectedRoommate && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">What should they buy you?</h3>
              <div className="grid grid-cols-3 gap-3">
                {(['beer', 'pizza', 'coffee'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setFunType(type)}
                    className={`p-4 rounded-lg border-2 transition-colors ${
                      funType === type
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      {getFunTypeIcon(type)}
                      <span className="text-sm font-medium capitalize">{type}</span>
                      <span className="text-xs text-gray-500">
                        ${getFunTypeValue(type).toFixed(2)} each
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Amount */}
          {selectedRoommate && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">How many?</h3>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setFunAmount(Math.max(1, funAmount - 1))}
                  className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                >
                  -
                </button>
                <div className="flex-1 text-center">
                  <div className="text-3xl font-bold text-gray-900">{funAmount}</div>
                  <div className="text-sm text-gray-500">{getFunTypeLabel(funType)}</div>
                </div>
                <button
                  onClick={() => setFunAmount(Math.min(getMaxAmount(), funAmount + 1))}
                  className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                >
                  +
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Max: {getMaxAmount()} {getFunTypeLabel(funType).toLowerCase()}
              </p>
            </div>
          )}

          {/* Conversion Summary */}
          {selectedRoommate && funAmount > 0 && (
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 text-white">
              <h3 className="font-semibold mb-2">Conversion Summary</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Instead of paying:</span>
                  <span className="font-medium">${getTotalValue().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>They can buy you:</span>
                  <span className="font-medium">{funAmount} {getFunTypeLabel(funType).toLowerCase()}</span>
                </div>
                <div className="flex justify-between font-semibold border-t border-blue-400 pt-2">
                  <span>Remaining balance:</span>
                  <span>
                    ${(roommates.find(r => r.id === selectedRoommate)?.balance || 0 - getTotalValue()).toFixed(2)}
                  </span>
                </div>
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
            onClick={handleConvert}
            disabled={!selectedRoommate || funAmount <= 0}
          >
            Convert to {getFunTypeLabel(funType)}
          </Button>
        </div>
      </div>
    </div>
  )
}
