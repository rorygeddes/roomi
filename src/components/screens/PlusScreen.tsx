'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { TransactionReviewModal } from '@/components/modals/TransactionReviewModal'
import { 
  Camera, 
  Image, 
  Mic, 
  Calendar, 
  CheckSquare,
  Upload
} from 'lucide-react'
import { ParsedTransaction, parseTransactionFromText, parseTransactionFromImage, transcribeAudio } from '@/lib/openai'
import { generateBatchId } from '@/lib/utils'

export const PlusScreen: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [parsedTransactions, setParsedTransactions] = useState<ParsedTransaction[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const roommates = [
    { id: '1', name: 'Alex' },
    { id: '2', name: 'Sam' },
    { id: '3', name: 'Jordan' },
    { id: '4', name: 'Rory' }
  ]

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
    setError(null)
  }

  const handleFileUpload = async (file: File) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const reader = new FileReader()
      reader.onload = async (e) => {
        const base64 = e.target?.result as string
        const base64Data = base64.split(',')[1] // Remove data:image/jpeg;base64, prefix
        
        const transactions = await parseTransactionFromImage(base64Data)
        setParsedTransactions(transactions)
        setShowReviewModal(true)
        setIsLoading(false)
      }
      reader.readAsDataURL(file)
    } catch (err) {
      setError('Failed to parse image. Please try again.')
      setIsLoading(false)
    }
  }

  const handleVoiceInput = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      const audioChunks: BlobPart[] = []
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data)
      }
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' })
        const transcription = await transcribeAudio(audioBlob)
        const transactions = await parseTransactionFromText(transcription)
        setParsedTransactions(transactions)
        setShowReviewModal(true)
        setIsLoading(false)
      }
      
      mediaRecorder.start()
      
      // Stop recording after 10 seconds (or add a stop button)
      setTimeout(() => {
        mediaRecorder.stop()
        stream.getTracks().forEach(track => track.stop())
      }, 10000)
      
    } catch (err) {
      setError('Failed to record audio. Please try again.')
      setIsLoading(false)
    }
  }

  const handleTransactionAccept = (transactions: ParsedTransaction[], selectedRoommates: string[]) => {
    // Generate batch ID for this transaction group
    const batchId = generateBatchId()
    
    // TODO: Save transactions to database with batch ID
    console.log('Accepted transactions:', transactions)
    console.log('Selected roommates:', selectedRoommates)
    console.log('Batch ID:', batchId)
    
    // Show success message
    alert(`✅ Transactions accepted! Batch ID: ${batchId}`)
    
    // Reset state
    setShowReviewModal(false)
    setParsedTransactions([])
    setSelectedOption(null)
  }

  return (
    <div className="p-4 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">Add Something</h1>
        <p className="text-gray-600 mt-1">Choose how you&apos;d like to add an expense or activity</p>
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
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleFileUpload(file)
            }}
            className="hidden"
            id="file-upload"
            title="Upload receipt or transaction image"
          />
          <Button 
            variant="primary"
            onClick={() => document.getElementById('file-upload')?.click()}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : (selectedOption === 'camera' ? 'Open Camera' : 'Choose Image')}
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
          <Button 
            variant="primary" 
            className="bg-red-500 hover:bg-red-600"
            onClick={handleVoiceInput}
            disabled={isLoading}
          >
            {isLoading ? 'Recording...' : 'Start Recording'}
          </Button>
        </div>
      ) : null}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Transaction Review Modal */}
      <TransactionReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        onAccept={handleTransactionAccept}
        transactions={parsedTransactions}
        roommates={roommates}
      />
    </div>
  )
}
