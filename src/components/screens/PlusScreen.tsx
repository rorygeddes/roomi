'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { 
  Camera, 
  Image, 
  Mic, 
  Calendar, 
  CheckSquare,
  Upload
} from 'lucide-react'

export const PlusScreen: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  const transactionOptions = [
    { id: 'camera', label: 'Camera', icon: Camera, description: 'Snap receipt' },
    { id: 'gallery', label: 'Gallery', icon: Image, description: 'Pick image' },
    { id: 'voice', label: 'Voice', icon: Mic, description: 'Dictate expense' },
  ]

  const otherOptions = [
    { id: 'event', label: 'Add Event', icon: Calendar, description: 'Create event' },
    { id: 'chore', label: 'Add Chore', icon: CheckSquare, description: 'Assign chore' },
  ]

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId)
    // Handle the selected option
    console.log('Selected option:', optionId)
  }

  return (
    <div className="p-4 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">Add Something</h1>
        <p className="text-gray-600 mt-1">Choose how you'd like to add an expense or activity</p>
      </div>

      {/* Transaction Options */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Add Transaction</h2>
        <div className="grid grid-cols-1 gap-3">
          {transactionOptions.map((option) => {
            const Icon = option.icon
            return (
              <Button
                key={option.id}
                variant="outline"
                className="flex items-center justify-start p-4 h-auto"
                onClick={() => handleOptionSelect(option.id)}
              >
                <Icon size={24} className="mr-4 text-blue-600" />
                <div className="text-left">
                  <div className="font-medium">{option.label}</div>
                  <div className="text-sm text-gray-500">{option.description}</div>
                </div>
              </Button>
            )
          })}
        </div>
      </div>

      {/* Other Options */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Add Activity</h2>
        <div className="grid grid-cols-1 gap-3">
          {otherOptions.map((option) => {
            const Icon = option.icon
            return (
              <Button
                key={option.id}
                variant="outline"
                className="flex items-center justify-start p-4 h-auto"
                onClick={() => handleOptionSelect(option.id)}
              >
                <Icon size={24} className="mr-4 text-green-600" />
                <div className="text-left">
                  <div className="font-medium">{option.label}</div>
                  <div className="text-sm text-gray-500">{option.description}</div>
                </div>
              </Button>
            )
          })}
        </div>
      </div>

      {/* Upload Area (when camera/gallery selected) */}
      {selectedOption === 'camera' || selectedOption === 'gallery' ? (
        <div className="bg-white rounded-xl p-6 border-2 border-dashed border-gray-300 text-center">
          <Upload size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {selectedOption === 'camera' ? 'Take a Photo' : 'Select Image'}
          </h3>
          <p className="text-gray-500 mb-4">
            {selectedOption === 'camera' 
              ? 'Point your camera at a receipt or bill' 
              : 'Choose an image from your gallery'
            }
          </p>
          <Button variant="primary">
            {selectedOption === 'camera' ? 'Open Camera' : 'Choose Image'}
          </Button>
        </div>
      ) : null}

      {/* Voice Input (when voice selected) */}
      {selectedOption === 'voice' ? (
        <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
          <Mic size={48} className="mx-auto text-blue-600 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Voice Input</h3>
          <p className="text-gray-500 mb-4">
            Dictate your expense details
          </p>
          <Button variant="primary" className="bg-red-500 hover:bg-red-600">
            Start Recording
          </Button>
        </div>
      ) : null}
    </div>
  )
}
