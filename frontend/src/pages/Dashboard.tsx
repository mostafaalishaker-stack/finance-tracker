import React, { useState, useEffect, useCallback } from 'react'
import api from '../api/client'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts'

interface Transaction {
  id: number
  type: 'income' | 'expense'
  amount: number
  category: string
  description: string
  date: string
  userId: number
}

interface Summary {
  totalIncome: number
  totalExpense: number
  balance: number
  byCategory: { category: string; amount: number }[]
  monthlyData: { month: string; income: number; expense: number }[]
}

interface Props {
  token: string
  onLogout: () => void
}

const CATEGORIES = [
  'Food', 'Transport', 'Housing', 'Utilities', 'Entertainment',
  'Shopping', 'Health', 'Education', 'Salary', 'Freelance', 'Investment', 'Other',
]

const COLORS = ['#22c55e', '#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#6366f1', '#84cc16', '#06b6d4', '#a855f7']
const PIE_COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#6366f1', '#84cc16', '#06b6d4', '#a855f7', '#22c55e']

const styles: Record<string, React.CSSProperties> = {
  wrapper: { padding: '24px', maxWidth: '1200px', margin: '0 auto' },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: '24px',
  },
  logo: { fontSize: '24px', fontWeight: 700, color: '#22c55e' },
  logoutBtn: {
    padding: '8px 16px', borderRadius: '8px', border: '1px solid #334155',
    backgroundColor: 'transparent', color: '#94a3b8', cursor: 'pointer', fontSize: '14px',
  },
  cards: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' },
  card: {
    padding: '20px', borderRadius: '12px', backgroundColor: '#1e293b',
    boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
  },
  cardIcon: { fontSize: '24px', marginBottom: '8px' },
  cardLabel: { color: '#94a3b8', fontSize: '14px', marginBottom: '4px' },
  cardValue: { fontSize: '28px', fontWeight: 700 },
  formSection: {
    backgroundColor: '#1e293b', padding: '20px', borderRadius: '12px', marginBottom: '24px',
  },
  formTitle: { fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: '#f1f5f9' },
  formRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '12px' },
  input: {
    padding: '10px 12px', borderRadius: '8px', border: '1px solid #334155',
    backgroundColor: '#0f172a', color: '#f1f5f9', fontSize: '14px', outline: 'none',
  },
  select: {
    padding: '10px 12px', borderRadius: '8px', border: '1px solid #334155',
    backgroundColor: '#0f172a', color: '#f1f5f9', fontSize: '14px', outline: 'none',
  },
  addBtn: {
    padding: '10px 24px', borderRadius: '8px', border: 'none',
    backgroundColor: '#22c55e', color: '#fff', fontSize: '14px', fontWeight: 600,
    cursor: 'pointer',
  },
  chartsSection: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' },
  chartCard: {
    backgroundColor: '#1e293b', padding: '20px', borderRadius: '12px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
  },
  chartTitle: { fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: '#f1f5f9' },
  transactionsSection: { backgroundColor: '#1e293b', padding: '20px', borderRadius: '12px' },
  transTitle: { fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: '#f1f5f9' },
  transItem: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '12px 0', borderBottom: '1px solid #334155',
  },
  transLeft: { display: 'flex', alignItems: 'center', gap: '12px' },
  transDot: { width: '8px', height: '8px', borderRadius: '50%' },
  transDesc: { color: '#f1f5f9', fontSize: '14px' },
  transCat: { color: '#64748b', fontSize: '12px' },
  transAmount: { fontSize: '14px', fontWeight: 600 },
  deleteBtn: {
    background: 'none', border: 'none', color: '#ef4444',
    cursor: 'pointer', fontSize: '14px', marginLeft: '12px',
  },
  empty: { color: '#64748b', fontSize: '14px', textAlign: 'center' as const, padding: '20px' },
}

function Dashboard({ token, onLogout }: Props) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [summary, setSummary] = useState<Summary | null>(null)
  const [type, setType] = useState<'income' | 'expense'>('expense')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  const fetchData = useCallback(async () => {
    try {
      const [transRes, summaryRes] = await Promise.all([
        api.get('/transactions'),
        api.get('/transactions/summary'),
      ])
      setTransactions(transRes.data)
      setSummary(summaryRes.data)
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || parseFloat(amount) <= 0) return
    try {
      await api.post('/transactions', { type, amount: parseFloat(amount), category, description, date })
      setAmount('')
      setDescription('')
      fetchData()
    } catch {
      // ignore
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/transactions/${id}`)
      fetchData()
    } catch {
      // ignore
    }
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <div style={styles.logo}><i className="fas fa-wallet" style={{ marginRight: '8px' }}></i>Finance Tracker</div>
        <button style={styles.logoutBtn} onClick={onLogout}><i className="fas fa-sign-out-alt" style={{ marginRight: '6px' }}></i>Logout</button>
      </div>

      {summary && (
        <div style={styles.cards}>
          <div style={{ ...styles.card, borderTop: '3px solid #3b82f6' }}>
            <div style={styles.cardIcon}><i className="fas fa-chart-line" style={{ color: '#3b82f6' }}></i></div>
            <div style={styles.cardLabel}>Total Balance</div>
            <div style={{ ...styles.cardValue, color: '#3b82f6' }}>${summary.balance.toFixed(2)}</div>
          </div>
          <div style={{ ...styles.card, borderTop: '3px solid #22c55e' }}>
            <div style={styles.cardIcon}><i className="fas fa-arrow-up" style={{ color: '#22c55e' }}></i></div>
            <div style={styles.cardLabel}>Total Income</div>
            <div style={{ ...styles.cardValue, color: '#22c55e' }}>${summary.totalIncome.toFixed(2)}</div>
          </div>
          <div style={{ ...styles.card, borderTop: '3px solid #ef4444' }}>
            <div style={styles.cardIcon}><i className="fas fa-arrow-down" style={{ color: '#ef4444' }}></i></div>
            <div style={styles.cardLabel}>Total Expenses</div>
            <div style={{ ...styles.cardValue, color: '#ef4444' }}>${summary.totalExpense.toFixed(2)}</div>
          </div>
        </div>
      )}

      <div style={styles.formSection}>
        <div style={styles.formTitle}><i className="fas fa-plus-circle" style={{ marginRight: '8px', color: '#22c55e' }}></i>Add Transaction</div>
        <form onSubmit={handleAdd}>
          <div style={styles.formRow}>
            <select style={styles.select} value={type} onChange={(e) => setType(e.target.value as 'income' | 'expense')}>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <input style={styles.input} type="number" placeholder="Amount" step="0.01" min="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required />
            <select style={styles.select} value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <input style={styles.input} type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
            <input style={styles.input} type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            <button style={styles.addBtn} type="submit"><i className="fas fa-plus" style={{ marginRight: '6px' }}></i>Add</button>
          </div>
        </form>
      </div>

      {summary && (
        <div style={styles.chartsSection}>
          <div style={styles.chartCard}>
            <div style={styles.chartTitle}><i className="fas fa-chart-bar" style={{ marginRight: '8px', color: '#3b82f6' }}></i>Income vs Expense</div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={summary.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9' }} />
                <Legend />
                <Bar dataKey="income" fill="#22c55e" name="Income" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" fill="#ef4444" name="Expense" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={styles.chartCard}>
            <div style={styles.chartTitle}><i className="fas fa-chart-pie" style={{ marginRight: '8px', color: '#f59e0b' }}></i>Expenses by Category</div>
            {summary.byCategory.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={summary.byCategory} dataKey="amount" nameKey="category" cx="50%" cy="50%" outerRadius={100} label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}>
                    {summary.byCategory.map((_, idx) => (
                      <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={styles.empty}>No expense data yet</div>
            )}
          </div>
        </div>
      )}

      <div style={styles.transactionsSection}>
        <div style={styles.transTitle}><i className="fas fa-list" style={{ marginRight: '8px', color: '#3b82f6' }}></i>Transactions ({transactions.length})</div>
        {transactions.length === 0 ? (
          <div style={styles.empty}>No transactions yet. Add one above!</div>
        ) : (
          transactions.slice().reverse().map((t) => (
            <div key={t.id} style={styles.transItem}>
              <div style={styles.transLeft}>
                <div style={{ ...styles.transDot, backgroundColor: t.type === 'income' ? '#22c55e' : '#ef4444' }}></div>
                <div>
                  <div style={styles.transDesc}>{t.description}</div>
                  <div style={styles.transCat}>{t.category} &middot; {new Date(t.date).toLocaleDateString()}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ ...styles.transAmount, color: t.type === 'income' ? '#22c55e' : '#ef4444' }}>
                  {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                </span>
                <button style={styles.deleteBtn} onClick={() => handleDelete(t.id)}>
                  <i className="fas fa-trash-alt"></i>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Dashboard
