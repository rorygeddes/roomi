'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, 
  MessageCircle, 
  Plus, 
  TrendingUp, 
  Gavel, 
  Info,
  Calendar,
  DollarSign
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navigationItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Chats', href: '/chats', icon: MessageCircle },
  { name: 'Plus', href: '/plus', icon: Plus },
  { name: 'Events', href: '/events', icon: Calendar },
  { name: 'Budget', href: '/budget', icon: DollarSign },
  { name: 'Leaderboard', href: '/leaderboard', icon: TrendingUp },
  { name: 'Rules', href: '/rules', icon: Gavel },
  { name: 'Info', href: '/info', icon: Info },
]

export const BottomNavigation: React.FC = () => {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex flex-col items-center py-2 px-3 rounded-lg transition-colors',
                isActive 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              <Icon size={20} />
              <span className="text-xs mt-1 font-medium">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
