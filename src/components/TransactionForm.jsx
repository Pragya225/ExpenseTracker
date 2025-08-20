// components/TransactionForm.jsx
import { useState } from 'react'
import axios from 'axios'
import { API_URL } from '../App'

function TransactionForm({ onTransactionAdded, savingsPercentage, loading, setLoading, setError }) {
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('Food')
  const [transactionType, setTransactionType] = useState('expense')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!description.trim() || !amount) return

    const amountValue = parseFloat(amount)
    if (isNaN(amountValue) || amountValue <= 0) {
      setError('Please enter a valid amount')
      return
    }

    try {
      setLoading(true)
      setError('')

      if (transactionType === 'income') {
        const savingsFromIncome = amountValue * (savingsPercentage / 100)

        // Add income and savings in parallel for better performance
        await Promise.all([
          axios.post(`${API_URL}/transactions`, {
            description: description.trim(),
            amount: amountValue,
            category,
            type: 'income',
            date: new Date().toLocaleDateString()
          }),
          axios.post(`${API_URL}/transactions`, {
            description: `Savings from ${description.trim()}`,
            amount: savingsFromIncome,
            category: 'Savings',
            type: 'saving',
            date: new Date().toLocaleDateString()
          })
        ])
      } else {
        // Expense
        await axios.post(`${API_URL}/transactions`, {
          description: description.trim(),
          amount: amountValue,
          category,
          type: 'expense',
          date: new Date().toLocaleDateString()
        })
      }

      // refresh list in parent (App.jsx)
      await onTransactionAdded()

      // reset fields
      setDescription('')
      setAmount('')
      setCategory(transactionType === 'income' ? 'Salary' : 'Food')
      
    } catch (err) {
      setError('Failed to add transaction. Check if JSON server is running.')
      console.error('Error adding transaction:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleTypeChange = (type) => {
    setTransactionType(type)
    // Reset category when type changes for better UX
    setCategory(type === 'income' ? 'Salary' : 'Food')
  }

  return (
    <form onSubmit={handleSubmit} className="transaction-form">
      <div className="form-group">
        <label>Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter description"
          required
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label>Amount ($)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="0.01"
          step="0.01"
          placeholder="0.00"
          required
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label>Type</label>
        <div className="button-group">
          <button
            type="button"
            className={transactionType === 'income' ? 'btn-income active' : 'btn-income'}
            onClick={() => handleTypeChange('income')}
            disabled={loading}
          >
            Income
          </button>
          <button
            type="button"
            className={transactionType === 'expense' ? 'btn-expense active' : 'btn-expense'}
            onClick={() => handleTypeChange('expense')}
            disabled={loading}
          >
            Expense
          </button>
        </div>
      </div>

      <div className="form-group">
        <label>Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          disabled={loading}
        >
          {transactionType === 'income' ? (
            <>
              <option value="Salary">Salary</option>
              <option value="Freelance">Freelance</option>
              <option value="Investment">Investment</option>
              <option value="Gift">Gift</option>
              <option value="Other">Other</option>
            </>
          ) : (
            <>
              <option value="Food">Food</option>
              <option value="Transport">Transport</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Utilities">Utilities</option>
              <option value="Rent">Rent</option>
              <option value="Other">Other</option>
            </>
          )}
        </select>
      </div>

      <button 
        type="submit" 
        disabled={loading || !description.trim() || !amount}
        className="submit-btn"
      >
        {loading ? 'Adding...' : `Add ${transactionType}`}
      </button>
    </form>
  )
}

export default TransactionForm