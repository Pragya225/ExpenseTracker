import { useState, useMemo } from 'react'
import { useTransactions } from '../context/TransactionContext'
import { useToast } from '../context/ToastContext'
import TransactionModal from '../components/Transactions/TransactionModal'
import '../styles/transactions.css'

const fmt = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)

const ICONS = {
  'Food & Dining': '🍽️', 'Transport': '🚗', 'Housing': '🏠', 'Healthcare': '⚕️',
  'Entertainment': '🎬', 'Shopping': '🛍️', 'Education': '📚', 'Utilities': '⚡',
  'Travel': '✈️', 'Other': '📦', 'Salary': '💼', 'Freelance': '💻',
  'Investment': '📈', 'Gift': '🎁', 'Other Income': '💰'
}

export default function TransactionsPage() {
  const { transactions, deleteTransaction, categories } = useTransactions()
  const toast = useToast()
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterCat, setFilterCat] = useState('all')
  const [sortBy, setSortBy] = useState('date-desc')
  const [modalOpen, setModalOpen] = useState(false)
  const [editTx, setEditTx] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const allCats = [...categories.income, ...categories.expense]

  const filtered = useMemo(() => {
    let list = [...transactions]
    if (search) list = list.filter(t => t.category.toLowerCase().includes(search.toLowerCase()) || t.notes?.toLowerCase().includes(search.toLowerCase()))
    if (filterType !== 'all') list = list.filter(t => t.type === filterType)
    if (filterCat !== 'all') list = list.filter(t => t.category === filterCat)
    const [key, dir] = sortBy.split('-')
    list.sort((a, b) => {
      let av = key === 'date' ? new Date(a.date) : key === 'amount' ? a.amount : a.category
      let bv = key === 'date' ? new Date(b.date) : key === 'amount' ? b.amount : b.category
      return dir === 'desc' ? (bv > av ? 1 : -1) : (av > bv ? 1 : -1)
    })
    return list
  }, [transactions, search, filterType, filterCat, sortBy])

  const handleDelete = (tx) => {
    deleteTransaction(tx.id)
    toast.success('Transaction deleted')
    setConfirmDelete(null)
  }

  const handleEdit = (tx) => { setEditTx(tx); setModalOpen(true) }

  const exportCSV = () => {
    const headers = ['Date', 'Type', 'Category', 'Amount', 'Notes']
    const rows = filtered.map(t => [t.date, t.type, t.category, t.amount, t.notes || ''])
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'transactions.csv'; a.click()
    URL.revokeObjectURL(url)
    toast.success('CSV exported!')
  }

  return (
    <div className="tx-page">
      {/* Controls */}
      <div className="tx-controls">
        <div className="search-box">
          <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/><path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          <input className="search-input" type="text" placeholder="Search transactions..." value={search} onChange={e => setSearch(e.target.value)} />
          {search && <button className="search-clear" onClick={() => setSearch('')}>✕</button>}
        </div>
        <div className="filter-group">
          <select className="filter-select" value={filterType} onChange={e => setFilterType(e.target.value)}>
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select className="filter-select" value={filterCat} onChange={e => setFilterCat(e.target.value)}>
            <option value="all">All Categories</option>
            {allCats.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select className="filter-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="amount-desc">Amount ↓</option>
            <option value="amount-asc">Amount ↑</option>
            <option value="category-asc">Category A-Z</option>
          </select>
        </div>
        <div className="tx-header-actions">
          <button className="btn-export" onClick={exportCSV} title="Export CSV">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Export
          </button>
          <button className="btn-add btn-expense" onClick={() => { setEditTx(null); setModalOpen(true) }}>+ Add New</button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="tx-stats-bar">
        <span className="tx-stat"><span className="tx-stat-label">Showing</span> {filtered.length} of {transactions.length}</span>
        <span className="tx-stat"><span className="tx-stat-label">Income</span> <span style={{ color: 'var(--green)' }}>{fmt(filtered.filter(t=>t.type==='income').reduce((s,t)=>s+t.amount,0))}</span></span>
        <span className="tx-stat"><span className="tx-stat-label">Expenses</span> <span style={{ color: 'var(--red)' }}>{fmt(filtered.filter(t=>t.type==='expense').reduce((s,t)=>s+t.amount,0))}</span></span>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <p className="empty-title">No transactions found</p>
          <p className="empty-sub">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="tx-table-wrap card">
          <table className="tx-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Date</th>
                <th>Notes</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((tx, i) => (
                <tr key={tx.id} style={{ animationDelay: `${i * 0.03}s` }} className="animate-fade">
                  <td>
                    <div className="tx-cat-cell">
                      <span className="tx-cat-icon-sm">{ICONS[tx.category] || '💳'}</span>
                      <span>{tx.category}</span>
                    </div>
                  </td>
                  <td className="tx-date-cell">{new Date(tx.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                  <td className="tx-notes-cell">{tx.notes || <span className="tx-no-notes">—</span>}</td>
                  <td><span className={`badge ${tx.type === 'income' ? 'badge-green' : 'badge-red'}`}>{tx.type}</span></td>
                  <td className={`tx-amount-cell ${tx.type === 'income' ? 'tx-income' : 'tx-expense'}`}>
                    {tx.type === 'income' ? '+' : '-'}{fmt(tx.amount)}
                  </td>
                  <td>
                    <div className="tx-actions">
                      <button className="tx-action-btn tx-edit-btn" onClick={() => handleEdit(tx)} title="Edit">✎</button>
                      <button className="tx-action-btn tx-del-btn" onClick={() => setConfirmDelete(tx)} title="Delete">🗑</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirm */}
      {confirmDelete && (
        <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="modal-box confirm-modal animate-scale" onClick={e => e.stopPropagation()}>
            <div className="confirm-icon">🗑️</div>
            <h3 className="confirm-title">Delete Transaction?</h3>
            <p className="confirm-msg">Remove <strong>{confirmDelete.category}</strong> — {fmt(confirmDelete.amount)}? This cannot be undone.</p>
            <div className="confirm-actions">
              <button className="btn-cancel" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button className="btn-delete-confirm" onClick={() => handleDelete(confirmDelete)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {modalOpen && (
        <TransactionModal
          tx={editTx}
          type={editTx?.type || 'expense'}
          onClose={() => { setModalOpen(false); setEditTx(null) }}
        />
      )}
    </div>
  )
}