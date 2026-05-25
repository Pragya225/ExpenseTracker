import { useMemo } from 'react'
import { useTransactions } from '../context/TransactionContext'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, Area, AreaChart
} from 'recharts'
import '../styles/analytics.css'

const fmt = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const PIE_COLORS = ['#6c63ff','#00c48c','#ff4d6d','#ffaa00','#2196f3','#e91e63','#00bcd4','#ff5722','#9c27b0','#4caf50']

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="chart-tooltip">
      <p className="tooltip-label">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>{p.name}: {fmt(p.value)}</p>
      ))}
    </div>
  )
}

export default function AnalyticsPage() {
  const { transactions } = useTransactions()

  const monthlyData = useMemo(() => {
    const now = new Date()
    const data = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const month = d.getMonth()
      const year = d.getFullYear()
      const txs = transactions.filter(t => { const td = new Date(t.date); return td.getMonth() === month && td.getFullYear() === year })
      data.push({
        name: MONTHS[month],
        Income: txs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0),
        Expenses: txs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
      })
    }
    return data
  }, [transactions])

  const categoryData = useMemo(() => {
    const map = {}
    transactions.filter(t => t.type === 'expense').forEach(t => {
      map[t.category] = (map[t.category] || 0) + t.amount
    })
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value)
  }, [transactions])

  const trendData = useMemo(() => {
    const sorted = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date))
    let balance = 0
    return sorted.map(t => {
      balance += t.type === 'income' ? t.amount : -t.amount
      return { date: new Date(t.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }), Balance: balance }
    })
  }, [transactions])

  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)

  return (
    <div className="analytics-page">
      {/* Monthly Bar Chart */}
      <div className="chart-card card">
        <div className="chart-header">
          <div>
            <h3 className="chart-title">Monthly Overview</h3>
            <p className="chart-subtitle">Income vs Expenses — last 6 months</p>
          </div>
        </div>
        <div className="chart-body">
          {transactions.length === 0 ? (
            <div className="chart-empty">📊 Add transactions to see your monthly overview</div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlyData} barSize={22} barGap={6}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={v => `₹${v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}`} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={8} />
                <Bar dataKey="Income" fill="var(--green)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Expenses" fill="var(--accent)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="analytics-grid-2">
        {/* Pie Chart */}
        <div className="chart-card card">
          <div className="chart-header">
            <div>
              <h3 className="chart-title">Spending by Category</h3>
              <p className="chart-subtitle">Where your money goes</p>
            </div>
          </div>
          <div className="chart-body">
            {categoryData.length === 0 ? (
              <div className="chart-empty">🥧 No expense data yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={65} outerRadius={105}
                    paddingAngle={3} dataKey="value" nameKey="name"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}>
                    {categoryData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v) => fmt(v)} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Category Breakdown List */}
        <div className="chart-card card">
          <div className="chart-header">
            <div>
              <h3 className="chart-title">Category Breakdown</h3>
              <p className="chart-subtitle">Expenses ranked by amount</p>
            </div>
          </div>
          <div className="chart-body">
            {categoryData.length === 0 ? (
              <div className="chart-empty">📂 No categories yet</div>
            ) : (
              <div className="cat-breakdown">
                {categoryData.slice(0, 8).map((c, i) => (
                  <div key={c.name} className="cat-row">
                    <div className="cat-row-left">
                      <span className="cat-dot" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                      <span className="cat-name">{c.name}</span>
                    </div>
                    <div className="cat-row-right">
                      <span className="cat-pct">{totalExpenses > 0 ? ((c.value / totalExpenses) * 100).toFixed(1) : 0}%</span>
                      <span className="cat-val">{fmt(c.value)}</span>
                    </div>
                    <div className="cat-bar-wrap">
                      <div className="cat-bar" style={{ width: `${totalExpenses > 0 ? (c.value / totalExpenses) * 100 : 0}%`, background: PIE_COLORS[i % PIE_COLORS.length] }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Trend Line Chart */}
      <div className="chart-card card">
        <div className="chart-header">
          <div>
            <h3 className="chart-title">Balance Trend</h3>
            <p className="chart-subtitle">Your running net balance over time</p>
          </div>
        </div>
        <div className="chart-body">
          {trendData.length < 2 ? (
            <div className="chart-empty">📈 Add more transactions to see your trend</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="balGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={v => `₹${v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}`} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="Balance" stroke="var(--accent)" strokeWidth={2.5} fill="url(#balGrad)" dot={false} activeDot={{ r: 5, fill: 'var(--accent)' }} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  )
}