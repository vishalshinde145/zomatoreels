import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginFoodPartner } from '../api'

export default function PartnerLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function onLogin(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await loginFoodPartner({ email, password })
      localStorage.setItem('foodPartnerId', response.user.id)
      alert('Login Successful')
      navigate('/create-food')
    } catch (error: any) {
      alert('Login Failed: ' + (error?.message || 'Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card partner-theme">
          <div className="auth-header">
            <h1 className="accent">Food Partner Login</h1>
            <p>Food Partner Login</p>
          </div>

          <form onSubmit={onLogin}>
            <div className="form-group">
              <label htmlFor="email">Food Partner Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="partner123@gmail.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Security Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="auth-footer">
            <p>Want to become a partner? <Link to="/partner-register">Register Now</Link></p>
            <p><Link to="/user-login" className="secondary-link">Looking for User Login?</Link></p>
          </div>
        </div>
      </div>
    </div>
  )
}
