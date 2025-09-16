'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Phone, Mail, MessageCircle, Settings, DollarSign } from 'lucide-react'

export default function Info() {
  const [landlordInfo] = useState({
    name: 'Mike Johnson',
    phone: '(555) 123-4567',
    email: 'mike@rentalproperty.com',
    notes: 'Prefers text messages for maintenance requests'
  })

  const [houseSettings] = useState({
    beerValue: 6.00,
    pizzaValue: 15.00,
    currency: 'CAD',
    batchIdCounter: 'B42'
  })

  return (
    <div className="p-4 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">House Info</h1>
        <p className="text-gray-600 mt-1">Landlord details and house settings</p>
      </div>

      {/* Landlord Section */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Landlord Contact</h2>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Name:</span>
            <span className="font-medium">{landlordInfo.name}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Phone:</span>
            <span className="font-medium">{landlordInfo.phone}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Email:</span>
            <span className="font-medium">{landlordInfo.email}</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-500 mb-3">{landlordInfo.notes}</p>
          <div className="grid grid-cols-3 gap-2">
            <Button variant="outline" size="sm" className="flex items-center justify-center space-x-1">
              <Phone size={16} />
              <span>Call</span>
            </Button>
            <Button variant="outline" size="sm" className="flex items-center justify-center space-x-1">
              <MessageCircle size={16} />
              <span>Text</span>
            </Button>
            <Button variant="outline" size="sm" className="flex items-center justify-center space-x-1">
              <Mail size={16} />
              <span>Email</span>
            </Button>
          </div>
        </div>
      </div>

      {/* House Settings */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <div className="flex items-center space-x-2 mb-4">
          <Settings size={20} className="text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">House Settings</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Beer Value:</span>
            <span className="font-medium">${houseSettings.beerValue.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Pizza Value:</span>
            <span className="font-medium">${houseSettings.pizzaValue.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Currency:</span>
            <span className="font-medium">{houseSettings.currency}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Last Batch ID:</span>
            <span className="font-medium">{houseSettings.batchIdCounter}</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <Button variant="outline" size="sm" className="w-full">
            Edit Settings
          </Button>
        </div>
      </div>

      {/* Fun Currency Example */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-4 text-white">
        <div className="flex items-center space-x-2 mb-3">
          <DollarSign size={20} />
          <h3 className="font-semibold">Buy You a Beer</h3>
        </div>
        <p className="text-blue-100 mb-3">
          Current conversion: 1 beer = ${houseSettings.beerValue.toFixed(2)}
        </p>
        <p className="text-sm text-blue-200">
          Example: If someone owes you $12, they can pay you back with 2 beers instead!
        </p>
      </div>

      {/* Future Features */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-3">Coming Soon</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <div>• Maintenance request logging</div>
          <div>• Linked house documents (lease, bills)</div>
          <div>• Property management integration</div>
        </div>
      </div>
    </div>
  )
}
