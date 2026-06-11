import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { Navigate, useNavigate, Link } from 'react-router-dom';

const Login = () => {
  let navigate = useNavigate()
  let { loginHook, loading, user } = useAuth();
  const [email, setemail] = useState('')
  const [password, setpassword] = useState('')
  const [error, seterror] = useState('')

  if (user) return <Navigate to='/groups' />

  async function submitHander(e) {
    try {
      e.preventDefault();
      seterror('');
      await loginHook(email, password)
      navigate('/groups')
    }
    catch (err) {
      seterror(err?.message || "Login failed. Please check your credentials.");
      console.log(err);
    }
  }

  if (loading) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="spinner-container">
            <div className="spinner"></div>
            <span className="spinner-text">Logging you in...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-card__title">SplitEase</h1>
        <p className="auth-card__subtitle">Sign in to manage your group expenses</p>

        {error && <div className="auth-card__error">{error}</div>}

        <form className="auth-card__form" onSubmit={submitHander}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              className="form-input"
              value={email}
              onChange={(e) => { setemail(e.target.value) }}
              type="email"
              placeholder='Enter Email'
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              value={password}
              onChange={(e) => { setpassword(e.target.value) }}
              type="password"
              placeholder='Enter Password'
              required
            />
          </div>

          <button className="btn btn--primary" type="submit">Login</button>
        </form>

        <p className="auth-card__footer">
          Don't have an account? <Link to='/register'>Register</Link>
        </p>
      </div>
    </div>
  )
}

export default Login