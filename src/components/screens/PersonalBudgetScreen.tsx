'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  PieChart, 
  Calendar,
  Plus,
  Filter
} from 'lucide-react'

interface Transaction {
  id: string
  date: string
  description: string
  amount: number
  category: string
  type: 'income' | 'expense'
  isShared: boolean
}

interface BudgetCategory {
  id: string
  name: string
  budget: number
  spent: number
  color: string
}

export const PersonalBudgetScreen: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const [transactions] = useState<Transaction[]>([
    {
      id: '1',
      date: '2024-01-15',
      description: 'Salary',
      amount: 2500.00,
      category: 'Income',
      type: 'income',
      isShared: false
    },
    {
      id: '2',
      date: '2024-01-14',
      description: 'Groceries',
      amount: -85.50,
      category: 'Food',
      type: 'expense',
      isShared: true
    },
    {
      id: '3',
      date: '2024-01-13',
      description: 'Rent',
      amount: -800.00,
      category: 'Housing',
      type: 'expense',
      isShared: true
    },
    {
      id: '4',
      date: '2024-01-12',
      description: 'Coffee',
      amount: -4.50,
      category: 'Food',
      type: 'expense',
      isShared: false
    },
    {
      id: '5',
      date: '2024-01-11',
      description: 'Utilities',
      amount: -120.00,
      category: 'Utilities',
      type: 'expense',
      isShared: true
    }
  ])

  const [budgetCategories] = useState<BudgetCategory[]>([
    { id: '1', name: 'Food', budget: 300, spent: 90, color: 'bg-red-500' },
    { id: '2', name: 'Housing', budget: 800, spent: 800, color: 'bg-blue-500' },
    { id: '3', name: 'Utilities', budget: 150, spent: 120, color: 'bg-green-500' },
    { id: '4', name: 'Entertainment', budget: 200, spent: 45, color: 'bg-purple-500' },
    { id: '5', name: 'Transportation', budget: 100, spent: 25, color: 'bg-yellow-500' }
  ])

  const getTotalIncome = () => {
    return transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
  }

  const getTotalExpenses = () => {
    return Math.abs(transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0))
  }

  const getNetIncome = () => {
    return getTotalIncome() - getTotalExpenses()
  }

  const getSharedExpenses = () => {
    return Math.abs(transactions
      .filter(t => t.type === 'expense' && t.isShared)
      .reduce((sum, t) => sum + t.amount, 0))
  }

  // const getPersonalExpenses = () => {
  //   return Math.abs(transactions
  //     .filter(t => t.type === 'expense' && !t.isShared)
  //     .reduce((sum, t) => sum + t.amount, 0))
  // }

  const filteredTransactions = selectedCategory === 'all' 
    ? transactions
    : transactions.filter(t => t.category === selectedCategory)

  const categories = ['all', ...Array.from(new Set(transactions.map(t => t.category)))]

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Personal Budget</h1>
        <Button variant="primary" className="flex items-center space-x-2">
          <Plus size={20} />
          <span>Add Transaction</span>
        </Button>
      </div>

      {/* Period Selector */}
      <div className="flex bg-gray-100 rounded-lg p-1">
        {(['week', 'month', 'year'] as const).map((period) => (
          <button
            key={period}
            onClick={() => setSelectedPeriod(period)}
            className={`flex-1 py-2 px-4 rounded-md transition-colors capitalize ${
              selectedPeriod === period
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {period}
          </button>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Income</p>
              <p className="text-2xl font-bold text-green-600">${getTotalIncome().toFixed(2)}</p>
            </div>
            <TrendingUp size={24} className="text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-red-600">${getTotalExpenses().toFixed(2)}</p>
            </div>
            <TrendingDown size={24} className="text-red-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Net Income</p>
              <p className={`text-2xl font-bold ${getNetIncome() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${getNetIncome().toFixed(2)}
              </p>
            </div>
            <DollarSign size={24} className={getNetIncome() >= 0 ? 'text-green-600' : 'text-red-600'} />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Shared Expenses</p>
              <p className="text-2xl font-bold text-blue-600">${getSharedExpenses().toFixed(2)}</p>
            </div>
            <PieChart size={24} className="text-blue-600" />
          </div>
        </div>
      </div>

      {/* Budget Categories */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Budget Categories</h2>
        <div className="space-y-3">
          {budgetCategories.map((category) => {
            const percentage = (category.spent / category.budget) * 100
            const isOverBudget = category.spent > category.budget
            
            return (
              <div key={category.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{category.name}</span>
                  <span className="text-sm text-gray-600">
                    ${category.spent.toFixed(2)} / ${category.budget.toFixed(2)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${category.color} ${
                      isOverBudget ? 'bg-red-500' : ''
                    }`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  ></div>
                </div>
                {isOverBudget && (
                  <p className="text-xs text-red-600">
                    Over budget by ${(category.spent - category.budget).toFixed(2)}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex items-center space-x-4">
        <Filter size={20} className="text-gray-600" />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category === 'all' ? 'All Categories' : category}
            </option>
          ))}
        </select>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-8">
              <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No transactions found</p>
            </div>
          ) : (
            filteredTransactions.map((transaction) => (
              <div key={transaction.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.type === 'income' 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {transaction.type === 'income' ? (
                        <TrendingUp size={20} />
                      ) : (
                        <TrendingDown size={20} />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{transaction.description}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span>{transaction.category}</span>
                        {transaction.isShared && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            Shared
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
