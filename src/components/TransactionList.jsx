import TransactionItem from './TransactionItem'

const TransactionList = ({ transactions, onDeleteTransaction, loading }) => {
  if (transactions.length === 0) {
    return <p className="no-transactions">No transactions yet. Add one above!</p>
  }

  return (
    <ul className="transaction-list">
      {transactions.map(transaction => (
        <TransactionItem 
          key={transaction.id}
          transaction={transaction}
          onDelete={onDeleteTransaction}
          loading={loading}
        />
      ))}
    </ul>
  )
}

export default TransactionList