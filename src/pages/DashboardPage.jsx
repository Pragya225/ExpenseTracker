import { useState } from 'react'
import { useTransactions } from '../context/TransactionContext'
import { useAuth } from '../context/AuthContext'
import TransactionModal from '../components/Transactions/TransactionModal'
import '../styles/dashboard.css'

const fmt = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)

const CATEGORY_ICONS = {
  'Food & Dining': '🍽️', 'Transport': '🚗', 'Housing': '🏠', 'Healthcare': '⚕️',
  'Entertainment': '🎬', 'Shopping': '🛍️', 'Education': '📚', 'Utilities': '⚡',
  'Travel': '✈️', 'Other': '📦', 'Salary': '💼', 'Freelance': '💻',
  'Investment': '📈', 'Gift': '🎁', 'Other Income': '💰'
}

export default function DashboardPage() {
  const { user } = useAuth()
  const { transactions, totalIncome, totalExpenses, balance, savingsRate, monthlyExpenses, monthlyIncome, budget } = useTransactions()
  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState('expense')

  const recent = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5)

  const openModal = (type) => { setModalType(type); setModalOpen(true) }

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 18) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="dashboard">
      {/* Greeting */}
      <div className="dashboard-greeting">
        <div>
          <h2 className="greeting-text">{greeting()}, {user?.name?.split(' ')[0]} 👋</h2>
          <p className="greeting-sub">Here's your financial snapshot</p>
        </div>
        <div className="dashboard-actions">
          <button className="btn-add btn-income" onClick={() => openModal('income')}>+ Add Income</button>
          <button className="btn-add btn-expense" onClick={() => openModal('expense')}>+ Add Expense</button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="stat-grid">
        <div className="stat-card stat-balance">
          <div className="stat-icon stat-icon-balance">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Balance</span>
            <span className="stat-value">{fmt(balance)}</span>
            <span className="stat-sub">All time net</span>
          </div>
        </div>

        <div className="stat-card stat-income">
          <div className="stat-icon stat-icon-income">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Income</span>
            <span className="stat-value stat-value-green">{fmt(totalIncome)}</span>
            <span className="stat-sub">This month: {fmt(monthlyIncome)}</span>
          </div>
        </div>

        <div className="stat-card stat-expense">
          <div className="stat-icon stat-icon-expense">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Expenses</span>
            <span className="stat-value stat-value-red">{fmt(totalExpenses)}</span>
            <span className="stat-sub">This month: {fmt(monthlyExpenses)}</span>
          </div>
        </div>

        <div className="stat-card stat-savings">
          <div className="stat-icon stat-icon-savings">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div className="stat-info">
            <span className="stat-label">Savings Rate</span>
            <span className="stat-value stat-value-accent">{savingsRate.toFixed(1)}%</span>
            <span className="stat-sub">{savingsRate >= 20 ? 'Great savings!' : 'Try to save more'}</span>
          </div>
        </div>
      </div>

      {/* Budget Banner */}
      {budget.monthly > 0 && (
        <div className={`budget-banner ${monthlyExpenses > budget.monthly ? 'budget-over' : ''}`}>
          <div className="budget-banner-info">
            <span className="budget-banner-label">
              {monthlyExpenses > budget.monthly ? '⚠️ Over budget this month' : '📊 Monthly Budget'}
            </span>
            <span className="budget-banner-val">{fmt(budget.monthly - monthlyExpenses)} remaining of {fmt(budget.monthly)}</span>
          </div>
          <div className="budget-banner-bar">
            <div className="budget-banner-fill" style={{ width: `${Math.min((monthlyExpenses / budget.monthly) * 100, 100)}%` }} />
          </div>
        </div>
      )}

      {/* Recent Transactions */}
      <div className="section-header">
        <h3 className="section-title">Recent Transactions</h3>
        <span className="section-count">{transactions.length} total</span>
      </div>

      {recent.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">💸</div>
          <p className="empty-title">No transactions yet</p>
          <p className="empty-sub">Add your first income or expense to get started</p>
          <button className="btn-add btn-expense" onClick={() => openModal('expense')}>+ Add Transaction</button>
        </div>
      ) : (
        <div className="tx-list card">
          {recent.map((tx, i) => (
            <div key={tx.id} className="tx-row" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="tx-cat-icon">{CATEGORY_ICONS[tx.category] || '💳'}</div>
              <div className="tx-details">
                <span className="tx-cat">{tx.category}</span>
                <span className="tx-note">{tx.notes || tx.date}</span>
              </div>
              <div className="tx-right">
                <span className={`tx-amount ${tx.type === 'income' ? 'tx-income' : 'tx-expense'}`}>
                  {tx.type === 'income' ? '+' : '-'}{fmt(tx.amount)}
                </span>
                <span className="tx-date">{new Date(tx.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && <TransactionModal type={modalType} onClose={() => setModalOpen(false)} />}
    </div>
  )
}