import SummaryCard from './SummaryCard'

const Dashboard = ({
  totalIncome,
  totalExpenses,
  totalSavings,
  remainingBudget,
  savingsPercentage,
  onSavingsChange
}) => {
  return (
    <div className="dashboard">
      <SummaryCard 
        title="TOTAL INCOME"
        amount={totalIncome}
        type="income"
      />
      
      <SummaryCard 
        title="TOTAL EXPENSES"
        amount={totalExpenses}
        type="expenses"
      />
      
      <SummaryCard 
        title={`SAVINGS (${savingsPercentage}%)`}
        amount={totalSavings}
        type="savings"
        savingsPercentage={savingsPercentage}
        onSavingsChange={onSavingsChange}
      />
      
      <SummaryCard 
        title="REMAINING BUDGET"
        amount={remainingBudget}
        type="budget"
        remainingBudget={remainingBudget}
      />
    </div>
  )
}

export default Dashboard