import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from '../api'

export default function UserLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage ] = useState<string | null>(null);
  const navigate = useNavigate()

  const showToast = (message:string) => {
          setToastMessage(message);
          setTimeout(()=>{
            setToastMessage(null);
          }, 2000);
        }

  async function onLogin(e: FormEvent) {
    e.preventDefault()
    setLoading(true);
    try {
      const response = await loginUser({ email, password })
      localStorage.setItem('userId', response.user.id)
     showToast(`Login Successful`);
      navigate('/home');
    } catch (error: any) {
      showToast('Login Failed: ' + (error?.message || 'Unknown error'));
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Welcome Back User</h1>
            <p>Please enter your User details to login</p>
          </div>

          <form onSubmit={onLogin}>
            <div className="form-group">
              <label htmlFor="email">User Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
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
            <p>Don't have an account? <Link to="/user-register">Sign Up</Link></p>
            <p><Link to="/partner-login" className="secondary-link">Partner Login?</Link></p>
          </div>
          <div className="forgot-password">
          <p>Forgot Password? <Link to="/user-forgot-password" className='secondary-link'></Link></p>
          </div>
        </div>
      </div>
    </div>
  )
}