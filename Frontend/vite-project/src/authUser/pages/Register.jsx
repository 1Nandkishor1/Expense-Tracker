import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { Navigate, useNavigate, Link } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'

const Register = () => {
    let context=useContext(AuthContext)
    let{user}=context;
    let { registerHook, loading } = useAuth()
    let navigate = useNavigate();
    const [email, setemail] = useState('')
    const [password, setpassword] = useState('')
    const [username, setusername] = useState('')
    const [error, seterror] = useState(null)

    if (user) return <Navigate to='/groups' />

    async function submitHaandler(e) {
        try {
            e.preventDefault();
            seterror(null);
            await registerHook(username, email, password)
            navigate('/login')
        }
        catch (err) {
            seterror(err?.message || "Registration failed. Please try again.");
            console.log(err);
        }
    }

    if (loading) {
        return (
            <div className="auth-container">
                <div className="auth-card">
                    <div className="spinner-container">
                        <div className="spinner"></div>
                        <span className="spinner-text">Creating your account...</span>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1 className="auth-card__title">SplitEase</h1>
                <p className="auth-card__subtitle">Create an account to start sharing expenses</p>

                {error && <div className="auth-card__error">{error}</div>}

                <form className="auth-card__form" onSubmit={submitHaandler}>
                    <div className="form-group">
                        <label className="form-label">Username</label>
                        <input
                            className="form-input"
                            value={username}
                            onChange={(e) => { setusername(e.target.value) }}
                            type="text"
                            placeholder='Enter Username'
                            required
                        />
                    </div>

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

                    <button className="btn btn--primary" type="submit">Register</button>
                </form>

                <p className="auth-card__footer">
                    Already have an account? <Link to='/login'>Login</Link>
                </p>
            </div>
        </div>
    )
}

export default Register