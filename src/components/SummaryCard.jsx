const SummaryCard = ({ 
  title, 
  amount, 
  type, 
  savingsPercentage, 
  onSavingsChange, 
  remainingBudget 
}) => {
  return (
    <div className={`summary-card ${type}`}>
      <h3>{title}</h3>
      <p className="amount">${amount.toFixed(2)}</p>
      
      {type === 'savings' && (
        <div className="savings-control">
          <label>Savings %:</label>
          <input
            type="range"
            min="0"
            max="100"
            value={savingsPercentage}
            onChange={(e) => onSavingsChange(parseInt(e.target.value))}
          />
          <span>{savingsPercentage}%</span>
        </div>
      )}
      
      {type === 'budget' && (
        <p>{remainingBudget >= 0 ? 'On track!' : 'Over budget!'}</p>
      )}
    </div>
  )
}

export default SummaryCard