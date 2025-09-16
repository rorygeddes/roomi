import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: string = 'CAD'): string {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: currency,
  }).format(amount)
}

export function formatDate(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export function getGreeting(): string {
  const hour = new Date().getHours()
  const day = new Date().toLocaleDateString('en-CA', { weekday: 'long' })
  
  if (hour < 12) {
    return `Good morning! Happy ${day}!`
  } else if (hour < 17) {
    return `Good afternoon! Happy ${day}!`
  } else {
    return `Good evening! Happy ${day}!`
  }
}

export function generateBatchId(): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substr(2, 5)
  return `B${timestamp}${random}`.toUpperCase()
}
