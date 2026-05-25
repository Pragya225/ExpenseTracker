import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from './AuthContext'
import { v4 as uuid } from 'uuid'

const TransactionContext = createContext(null)

const CATEGORIES = {
  income: ['Salary', 'Freelance', 'Investment', 'Gift', 'Other Income'],
  expense: ['Food & Dining', 'Transport', 'Housing', 'Healthcare', 'Entertainment', 'Shopping', 'Education', 'Utilities', 'Travel', 'Other']
}

export function TransactionProvider({ children }) {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState([])
  const [budget, setBudget] = useState({ monthly: 0, categories: {} })

  const storageKey = user ? `ss_tx_${user.id}` : null
  const budgetKey = user ? `ss_budget_${user.id}` : null

  useEffect(() => {
    if (!storageKey) { setTransactions([]); return }
    try {
      const stored = localStorage.getItem(storageKey)
      setTransactions(stored ? JSON.parse(stored) : [])
    } catch { setTransactions([]) }
  }, [storageKey])

  useEffect(() => {
    if (!budgetKey) { setBudget({ monthly: 0, categories: {} }); return }
    try {
      const stored = localStorage.getItem(budgetKey)
      setBudget(stored ? JSON.parse(stored) : { monthly: 0, categories: {} })
    } catch { setBudget({ monthly: 0, categories: {} }) }
  }, [budgetKey])

  const save = useCallback((txs) => {
    if (storageKey) localStorage.setItem(storageKey, JSON.stringify(txs))
    setTransactions(txs)
  }, [storageKey])

  const saveBudget = useCallback((b) => {
    if (budgetKey) localStorage.setItem(budgetKey, JSON.stringify(b))
    setBudget(b)
  }, [budgetKey])

  const addTransaction = (tx) => {
    const newTx = { ...tx, id: uuid(), createdAt: new Date().toISOString() }
    const updated = [newTx, ...transactions]
    save(updated)
    return newTx
  }

  const updateTransaction = (id, data) => {
    const updated = transactions.map(t => t.id === id ? { ...t, ...data } : t)
    save(updated)
  }

  const deleteTransaction = (id) => {
    const updated = transactions.filter(t => t.id !== id)
    save(updated)
  }

  const updateBudget = (data) => saveBudget({ ...budget, ...data })

  // Computed values
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  const balance = totalIncome - totalExpenses
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome * 100) : 0

  // This month
  const now = new Date()
  const thisMonthTx = transactions.filter(t => {
    const d = new Date(t.date)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })
  const monthlyExpenses = thisMonthTx.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  const monthlyIncome = thisMonthTx.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const remainingBudget = budget.monthly - monthlyExpenses
  const budgetUsedPct = budget.monthly > 0 ? Math.min((monthlyExpenses / budget.monthly) * 100, 100) : 0

  return (
    <TransactionContext.Provider value={{
      transactions, addTransaction, updateTransaction, deleteTransaction,
      budget, updateBudget,
      totalIncome, totalExpenses, balance, savingsRate,
      monthlyExpenses, monthlyIncome, remainingBudget, budgetUsedPct,
      categories: CATEGORIES
    }}>
      {children}
    </TransactionContext.Provider>
  )
}

export const useTransactions = () => useContext(TransactionContext)

