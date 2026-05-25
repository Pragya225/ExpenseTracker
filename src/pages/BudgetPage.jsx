import { useState } from 'react'
import { useTransactions } from '../context/TransactionContext'
import { useToast } from '../context/ToastContext'
import '../styles/budget.css'

const fmt = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

export default function BudgetPage() {
  const { budget, updateBudget, monthlyExpenses, monthlyIncome, remainingBudget, budgetUsedPct, transactions } = useTransactions()
  const toast = useToast()
  const [editing, setEditing] = useState(false)
  const [inputVal, setInputVal] = useState(budget.monthly || '')

  const now = new Date()
  const currentMonth = MONTHS[now.getMonth()]

  const isOver = monthlyExpenses > budget.monthly && budget.monthly > 0
  const isWarning = budgetUsedPct >= 80 && !isOver

  const handleSave = () => {
    const val = parseFloat(inputVal)
    if (isNaN(val) || val <= 0) { toast.error('Enter a valid budget amount'); return }
    updateBudget({ monthly: val })
    toast.success('Budget updated!')
    setEditing(false)
  }

  // Category spending this month
  const thisMonthExpenses = transactions.filter(t => {
    const d = new Date(t.date)
    return t.type === 'expense' && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })

  const catTotals = {}
  thisMonthExpenses.forEach(t => { catTotals[t.category] = (catTotals[t.category] || 0) + t.amount })
  const catList = Object.entries(catTotals).sort((a, b) => b[1] - a[1])

  return (
    <div className="budget-page">
      {/* Budget Setup */}
      <div className="budget-card card">
        <div className="budget-card-header">
          <div>
            <h3 className="budget-title">Monthly Budget — {currentMonth}</h3>
            <p className="budget-subtitle">Track how much you're spending this month</p>
          </div>
          <button className="budget-edit-btn" onClick={() => { setInputVal(budget.monthly || ''); setEditing(e => !e) }}>
            {editing ? 'Cancel' : (budget.monthly > 0 ? 'Edit Budget' : 'Set Budget')}
          </button>
        </div>

        {editing && (
          <div className="budget-input-row">
            <div className="budget-input-wrap">
              <span className="budget-input-prefix">₹</span>
              <input
                className="budget-input"
                type="number"
                placeholder="Enter monthly budget"
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                autoFocus
              />
            </div>
            <button className="btn-submit btn-submit-expense" onClick={handleSave}>Save Budget</button>
          </div>
        )}

        {budget.monthly > 0 ? (
          <>
            {isOver && (
              <div className="budget-alert budget-alert-danger">
                ⚠️ You're over budget by {fmt(monthlyExpenses - budget.monthly)} this month!
              </div>
            )}
            {isWarning && (
              <div className="budget-alert budget-alert-warning">
                ⚡ You've used {budgetUsedPct.toFixed(0)}% of your budget. Slow down!
              </div>
            )}

            <div className="budget-progress-section">
              <div className="budget-progress-labels">
                <span className="budget-spent-label">Spent: <strong>{fmt(monthlyExpenses)}</strong></span>
                <span className="budget-remain-label" style={{ color: isOver ? 'var(--red)' : 'var(--green)' }}>
                  {isOver ? 'Over by ' : 'Remaining: '}<strong>{fmt(Math.abs(remainingBudget))}</strong>
                </span>
              </div>
              <div className="budget-progress-bar">
                <div
                  className={`budget-progress-fill ${isOver ? 'fill-red' : isWarning ? 'fill-amber' : 'fill-green'}`}
                  style={{ width: `${budgetUsedPct}%` }}
                />
              </div>
              <div className="budget-progress-legend">
                <span className="budget-pct-txt">{budgetUsedPct.toFixed(1)}% used</span>
                <span className="budget-total-txt">Budget: {fmt(budget.monthly)}</span>
              </div>
            </div>

            {/* Stat Row */}
            <div className="budget-stat-row">
              <div className="budget-stat">
                <span className="budget-stat-label">Income</span>
                <span className="budget-stat-val" style={{ color: 'var(--green)' }}>{fmt(monthlyIncome)}</span>
              </div>
              <div className="budget-stat">
                <span className="budget-stat-label">Expenses</span>
                <span className="budget-stat-val" style={{ color: 'var(--red)' }}>{fmt(monthlyExpenses)}</span>
              </div>
              <div className="budget-stat">
                <span className="budget-stat-label">Budget</span>
                <span className="budget-stat-val" style={{ color: 'var(--accent)' }}>{fmt(budget.monthly)}</span>
              </div>
              <div className="budget-stat">
                <span className="budget-stat-label">Savings</span>
                <span className="budget-stat-val" style={{ color: monthlyIncome > monthlyExpenses ? 'var(--green)' : 'var(--red)' }}>
                  {fmt(monthlyIncome - monthlyExpenses)}
                </span>
              </div>
            </div>
          </>
        ) : (
          <div className="budget-empty">
            <div className="budget-empty-icon">🎯</div>
            <p className="budget-empty-title">No budget set</p>
            <p className="budget-empty-sub">Set a monthly budget to track your spending limits</p>
          </div>
        )}
      </div>

      {/* Category Spending */}
      {catList.length > 0 && (
        <div className="card">
          <div className="chart-header">
            <div>
              <h3 className="chart-title">Spending by Category — {currentMonth}</h3>
              <p className="chart-subtitle">{thisMonthExpenses.length} expense transactions this month</p>
            </div>
          </div>
          <div className="cat-spend-list">
            {catList.map(([cat, amt], i) => {
              const pct = budget.monthly > 0 ? (amt / budget.monthly) * 100 : 0
              return (
                <div key={cat} className="cat-spend-row" style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className="cat-spend-top">
                    <span className="cat-spend-name">{cat}</span>
                    <div className="cat-spend-right">
                      {budget.monthly > 0 && <span className="cat-spend-pct">{pct.toFixed(1)}% of budget</span>}
                      <span className="cat-spend-val">{fmt(amt)}</span>
                    </div>
                  </div>
                  {budget.monthly > 0 && (
                    <div className="cat-spend-bar-wrap">
                      <div className="cat-spend-bar" style={{
                        width: `${Math.min(pct, 100)}%`,
                        background: pct > 30 ? 'var(--red)' : pct > 15 ? 'var(--amber)' : 'var(--accent)'
                      }} />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {thisMonthExpenses.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📅</div>
          <p className="empty-title">No expenses this month</p>
          <p className="empty-sub">Start adding expenses to track your budget</p>
        </div>
      )}
    </div>
  )
}