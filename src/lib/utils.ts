import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Batch ID system for transaction tracking
let batchCounter = 1

export function generateBatchId(): string {
  return `B${batchCounter++}`
}

export function getCurrentBatchCounter(): number {
  return batchCounter
}

export function setBatchCounter(counter: number): void {
  batchCounter = counter
}

// Greeting system
export function getGreeting(): string {
  const hour = new Date().getHours()
  const day = new Date().toLocaleDateString('en-US', { weekday: 'long' })
  
  if (hour < 12) {
    return `Good morning! Happy ${day}!`
  } else if (hour < 17) {
    return `Good afternoon! Happy ${day}!`
  } else {
    return `Good evening! Happy ${day}!`
  }
}

// Currency formatting
export function formatCurrency(amount: number, currency: string = 'CAD'): string {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: currency,
  }).format(amount)
}

// Date formatting
export function formatDate(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}