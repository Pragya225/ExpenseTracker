import { useState, useEffect } from 'react'
import axios from 'axios'
import Dashboard from './components/Dashboard'
import TransactionForm from './components/TransactionForm'
import TransactionList from './components/TransactionList'
import './App.css'

// Base URL for your JSON Server
export const API_URL = 'http://localhost:3001'

function App() {
    const [transactions, setTransactions] = useState([])
    const [savingsPercentage, setSavingsPercentage] = useState(20)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    // Fetch transactions on component mount
    useEffect(() => {
        fetchTransactions()
        fetchSavingsSettings()
    }, [])

    const fetchTransactions = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`${API_URL}/transactions`)
            setTransactions(response.data)
            setError('')
        } catch (err) {
            setError('Failed to fetch transactions')
            console.error('Error fetching transactions:', err)
        } finally {
            setLoading(false)
        }
    }

    const fetchSavingsSettings = async () => {
        try {
            const response = await axios.get(`${API_URL}/savingsSettings`)
            setSavingsPercentage(response.data.percentage)
        } catch (err) {
            console.error('Error fetching savings settings:', err)
        }
    }

    const updateSavingsSettings = async (newPercentage) => {
        try {
            await axios.patch(`${API_URL}/savingsSettings`, {
                percentage: newPercentage
            })
            setSavingsPercentage(newPercentage)
        } catch (err) {
            console.error('Error updating savings settings.', err)
        }
    }

    const deleteTransaction = async (id) => {
        try {
            setLoading(true)
            await axios.delete(`${API_URL}/transactions/${id}`)

            // If it's an income transaction, try to find and delete associated savings
            const transactionToDelete = transactions.find(t => t.id === id)
            if (transactionToDelete.type === 'income') {
                const associatedSavings = transactions.find(
                    t => t.description === `Savings from ${transactionToDelete.description}` && t.type === 'saving'
                )
                if (associatedSavings) {
                    await axios.delete(`${API_URL}/transactions/${associatedSavings.id}`)
                }
            }
            // Refresh transactions
            await fetchTransactions()
            setError('')
        } catch (err) {
            setError('Failed to delete transaction')
            console.error('Error deleting transaction.', err)
        } finally {
            setLoading(false)
        }
    }

    const handleSavingsChange = (newPercentage) => {
        setSavingsPercentage(newPercentage)
        updateSavingsSettings(newPercentage)
    }

    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((total, transaction) => total + transaction.amount, 0)

    const totalExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((total, transaction) => total + transaction.amount, 0)

    const totalSavingsFromTransactions = transactions
        .filter(t => t.type === 'saving')
        .reduce((total, transaction) => total + transaction.amount, 0)

    const remainingBudget = totalIncome - totalExpenses - totalSavingsFromTransactions

    return (
        <div className="app">
            <h1>Income & Expense Tracker</h1>

            {error && <div className="error-message">{error}</div>}
            {loading && <div className="loading">Loading...</div>}

            <Dashboard
                totalIncome={totalIncome}
                totalExpenses={totalExpenses}
                totalSavings={totalSavingsFromTransactions}
                remainingBudget={remainingBudget}
                savingsPercentage={savingsPercentage}
                onSavingsChange={handleSavingsChange}
            />

            <div className="container">
                <div className="left-panel">
                    <TransactionForm
                        onTransactionAdded={fetchTransactions}
                        savingsPercentage={savingsPercentage}
                        loading={loading}
                        setLoading={setLoading}
                        setError={setError}
                    />
                </div>

                <div className="right-panel">
                    <h2>Transaction History</h2>
                    <TransactionList
                        transactions={transactions}
                        onDeleteTransaction={deleteTransaction}
                        loading={loading}
                    />
                </div>
            </div>
        </div>
    )
}

export default App