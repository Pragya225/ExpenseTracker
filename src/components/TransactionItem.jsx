const TransactionItem = ({ transaction, onDelete, loading }) => {
  return (
    <li className={`transaction-item ${transaction.type}`}>
      <div className="transaction-info">
        <span className="transaction-desc">{transaction.description}</span>
        <span className="transaction-category">{transaction.category}</span>
        <span className="transaction-date">{transaction.date}</span>
      </div>
      <div className={`transaction-amount ${transaction.type}-amount`}>
        {transaction.type === 'income' || transaction.type === 'saving' ? '+' : '-'}${transaction.amount.toFixed(2)}
        <button 
          onClick={() => onDelete(transaction.id)}
          className="delete-btn"
          disabled={loading}
        >
          ×
        </button>
      </div>
    </li>
  )
}

export default TransactionItem