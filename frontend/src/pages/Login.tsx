import React, { useState } from 'react'
import toast from 'react-hot-toast'
import api from '../api/client'

interface Props {
  onLogin: (token: string) => void
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
  },
  card: {
    backgroundColor: '#1e293b',
    padding: '40px',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
  },
  title: {
    fontSize: '28px',
    fontWeight: 700,
    marginBottom: '8px',
    color: '#f1f5f9',
    textAlign: 'center' as const,
  },
  subtitle: {
    color: '#94a3b8',
    textAlign: 'center' as const,
    marginBottom: '32px',
    fontSize: '14px',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #334155',
    backgroundColor: '#0f172a',
    color: '#f1f5f9',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box' as const,
    marginBottom: '16px',
  },
  button: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#22c55e',
    color: '#fff',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
    marginBottom: '12px',
  },
  link: {
    color: '#38bdf8',
    cursor: 'pointer',
    fontSize: '14px',
    textAlign: 'center' as const,
  },
  error: {
    color: '#ef4444',
    fontSize: '14px',
    textAlign: 'center' as const,
    marginBottom: '12px',
  },
}

function Login({ onLogin }: Props) {
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const endpoint = isRegister ? '/auth/register' : '/auth/login'
      const res = await api.post(endpoint, { email, password })
      toast.success(isRegister ? 'Account created!' : 'Welcome back!')
      onLogin(res.data.token)
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Something went wrong'
      setError(msg)
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={styles.title}>Finance Tracker</div>
        <div style={styles.subtitle}>{isRegister ? 'Create an account' : 'Welcome back'}</div>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <label htmlFor="login-email" style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '4px' }}>Email</label>
          <input
            id="login-email"
            style={styles.input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="login-password" style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '4px' }}>Password</label>
          <input
            id="login-password"
            style={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button style={{ ...styles.button, opacity: submitting ? 0.6 : 1 }} type="submit" disabled={submitting}>
            {submitting ? 'Please wait...' : (isRegister ? 'Register' : 'Login')}
          </button>
        </form>
        <div
          style={styles.link}
          onClick={() => { setIsRegister(!isRegister); setError('') }}
        >
          {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
        </div>
      </div>
    </div>
  )
}

export default Login
