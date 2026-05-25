import { useState, useEffect } from 'react'
import { useTransactions } from '../../context/TransactionContext'
import { useToast } from '../../context/ToastContext'
import '../../styles/modal.css'

export default function TransactionModal({ type = 'expense', tx = null, onClose }) {
  const { addTransaction, updateTransaction, categories } = useTransactions()
  const toast = useToast()
  const isEdit = !!tx

  const [form, setForm] = useState({
    type: tx?.type || type,
    amount: tx?.amount || '',
    category: tx?.category || '',
    date: tx?.date || new Date().toISOString().split('T')[0],
    notes: tx?.notes || '',
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    const handleKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', handleKey); document.body.style.overflow = '' }
  }, [onClose])

  const validate = () => {
    const e = {}
    if (!form.amount || isNaN(form.amount) || +form.amount <= 0) e.amount = 'Enter a valid amount'
    if (!form.category) e.category = 'Select a category'
    if (!form.date) e.date = 'Select a date'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length) { setErrors(e2); return }
    const data = { ...form, amount: parseFloat(form.amount) }
    if (isEdit) {
      updateTransaction(tx.id, data)
      toast.success('Transaction updated!')
    } else {
      addTransaction(data)
      toast.success(`${form.type === 'income' ? 'Income' : 'Expense'} added!`)
    }
    onClose()
  }

  const set = (k) => (e) => { setForm(f => ({ ...f, [k]: e.target.value })); setErrors(er => ({ ...er, [k]: '' })) }

  const catList = categories[form.type] || []

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box animate-scale">
        <div className="modal-header">
          <div>
            <h3 className="modal-title">{isEdit ? 'Edit' : 'Add'} {form.type === 'income' ? 'Income' : 'Expense'}</h3>
            <p className="modal-subtitle">Fill in the details below</p>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {/* Type Toggle */}
        {!isEdit && (
          <div className="type-toggle">
            <button
              className={`type-btn ${form.type === 'income' ? 'type-active-income' : ''}`}
              onClick={() => { setForm(f => ({ ...f, type: 'income', category: '' })); setErrors({}) }}
              type="button"
            >↑ Income</button>
            <button
              className={`type-btn ${form.type === 'expense' ? 'type-active-expense' : ''}`}
              onClick={() => { setForm(f => ({ ...f, type: 'expense', category: '' })); setErrors({}) }}
              type="button"
            >↓ Expense</button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="modal-form-grid">
            <div className="form-group">
              <label className="form-label">Amount (₹)</label>
              <input className="form-input" type="number" placeholder="0.00" min="0" step="0.01"
                value={form.amount} onChange={set('amount')} />
              {errors.amount && <p className="form-error">{errors.amount}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-input" value={form.category} onChange={set('category')}>
                <option value="">Select category</option>
                {catList.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.category && <p className="form-error">{errors.category}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Date</label>
              <input className="form-input" type="date" value={form.date} onChange={set('date')} />
              {errors.date && <p className="form-error">{errors.date}</p>}
            </div>

            <div className="form-group form-full">
              <label className="form-label">Notes (optional)</label>
              <input className="form-input" type="text" placeholder="Add a description..." value={form.notes} onChange={set('notes')} />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className={`btn-submit ${form.type === 'income' ? 'btn-submit-income' : 'btn-submit-expense'}`}>
              {isEdit ? 'Save Changes' : `Add ${form.type === 'income' ? 'Income' : 'Expense'}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}