'use client'

import React, { useState } from 'react'
import { Trophy, Award, Calendar } from 'lucide-react'

interface LeaderboardEntry {
  id: string
  name: string
  points: number
  avatar?: string
  badges: string[]
}

export const LeaderboardScreen: React.FC = () => {
  const [cycle, setCycle] = useState<'weekly' | 'monthly'>('weekly')

  const leaderboardData: LeaderboardEntry[] = [
    { id: '1', name: 'Alex', points: 45, badges: ['🏆', '⭐', '💪'] },
    { id: '2', name: 'Rory', points: 32, badges: ['⭐', '💪'] },
    { id: '3', name: 'Jordan', points: 28, badges: ['⭐'] },
    { id: '4', name: 'Sam', points: -5, badges: [] },
  ]

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return '🥇'
      case 1: return '🥈'
      case 2: return '🥉'
      default: return `${index + 1}`
    }
  }

  const getPointsColor = (points: number) => {
    if (points >= 30) return 'text-green-600'
    if (points >= 0) return 'text-blue-600'
    return 'text-red-600'
  }

  const getBackgroundColor = (index: number) => {
    if (index === 0) return 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200'
    if (index === leaderboardData.length - 1) return 'bg-gradient-to-r from-red-50 to-red-100 border-red-200'
    return 'bg-white border-gray-200'
  }

  return (
    <div className="p-4 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">Leaderboard</h1>
        <p className="text-gray-600 mt-1">Roommate of the Week competition</p>
      </div>

      {/* Cycle Toggle */}
      <div className="flex bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setCycle('weekly')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            cycle === 'weekly' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Weekly
        </button>
        <button
          onClick={() => setCycle('monthly')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            cycle === 'monthly' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Monthly
        </button>
      </div>

      {/* Highlights */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl p-4 text-white text-center">
          <Trophy size={32} className="mx-auto mb-2" />
          <h3 className="font-bold text-lg">Roommate of the Week</h3>
          <p className="text-yellow-100">{leaderboardData[0]?.name}</p>
        </div>
        <div className="bg-gradient-to-r from-red-400 to-red-500 rounded-xl p-4 text-white text-center">
          <Award size={32} className="mx-auto mb-2" />
          <h3 className="font-bold text-lg">Forfeit Roommate</h3>
          <p className="text-red-100">{leaderboardData[leaderboardData.length - 1]?.name}</p>
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="space-y-3">
        {leaderboardData.map((entry, index) => (
          <div 
            key={entry.id} 
            className={`rounded-xl p-4 border-2 ${getBackgroundColor(index)}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-2xl font-bold text-gray-600">
                  {getRankIcon(index)}
                </div>
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-lg font-bold">
                  {entry.name[0]}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{entry.name}</h3>
                  <div className="flex items-center space-x-1">
                    {entry.badges.map((badge, badgeIndex) => (
                      <span key={badgeIndex} className="text-lg">{badge}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-2xl font-bold ${getPointsColor(entry.points)}`}>
                  {entry.points > 0 ? '+' : ''}{entry.points}
                </div>
                <div className="text-sm text-gray-500">points</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Points System Info */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-3">How Points Work</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-green-600">✓ Paying on time</span>
            <span className="font-medium">+10 points</span>
          </div>
          <div className="flex justify-between">
            <span className="text-green-600">✓ Completing chores</span>
            <span className="font-medium">+5 points</span>
          </div>
          <div className="flex justify-between">
            <span className="text-green-600">✓ Cooking meals</span>
            <span className="font-medium">+8 points</span>
          </div>
          <div className="flex justify-between">
            <span className="text-red-600">✗ Skipping chores</span>
            <span className="font-medium">-5 points</span>
          </div>
          <div className="flex justify-between">
            <span className="text-red-600">✗ Late payments</span>
            <span className="font-medium">-10 points</span>
          </div>
        </div>
      </div>

      {/* Cycle Info */}
      <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
        <div className="flex items-center space-x-2 mb-2">
          <Calendar size={20} className="text-blue-600" />
          <h3 className="font-semibold text-blue-900">Current Cycle</h3>
        </div>
        <p className="text-blue-700 text-sm">
          {cycle === 'weekly' 
            ? 'Weekly cycle resets every Sunday at midnight'
            : 'Monthly cycle resets on the 1st of each month'
          }
        </p>
        <p className="text-blue-600 text-xs mt-1">
          Next reset: {cycle === 'weekly' ? 'Sunday' : 'Dec 1st'}
        </p>
      </div>
    </div>
  )
}
