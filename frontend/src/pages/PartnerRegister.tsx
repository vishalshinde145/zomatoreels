import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerFoodPartner } from '../api'

export default function PartnerRegister() {
  const [fullname, setFullname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function onRegister(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await registerFoodPartner({ fullname, email, password })
      alert('Registration Successful')
      navigate('/partner-login')
    } catch (error: any) {
      alert('Registration Failed: ' + (error?.message || 'Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card partner-theme">
          <div className="auth-header">
            <h1 className="accent">Food Partner Registration</h1>
            <p>Register With Your Email &amp; Password</p>
          </div>

          <form onSubmit={onRegister}>
            <div className="form-group">
              <label htmlFor="fullname">Restaurant Name</label>
              <input
                id="fullname"
                type="text"
                value={fullname}
                onChange={e => setFullname(e.target.value)}
                placeholder="Sam Smith"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Restaurant Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="sam.smith@gmail.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Create Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn" disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>

          <div className="auth-footer">
            <p>Already a partner? <Link to="/partner-login">Login</Link></p>
          </div>
        </div>
      </div>
    </div>
  )
}
