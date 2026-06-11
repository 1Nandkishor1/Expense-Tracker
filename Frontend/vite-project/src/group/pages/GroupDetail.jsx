import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useGroupDetail } from '../hooks/useGroupDetail'
import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'

const GroupDetail = () => {
    let navigate = useNavigate();
    let context = useContext(AuthContext)
    let { user } = context;
    let { id } = useParams();
    let { loading, error, link, group, balance, expenses, inviteByLinkHook, fetchGroupDetailHook, addExpenseHook, deleteExpenseHook } = useGroupDetail()
    const [Error, setError] = useState('')
    const [showExpenseForm, setshowExpenseForm] = useState(false)
    const [description, setdescription] = useState('')
    const [amount, setamount] = useState('')
    const [category, setcategory] = useState('')
    const [splitType, setsplitType] = useState('equal')

    useEffect(() => {
        fetchGroupDetailHandler();
    }, [])

    if (loading) {
        return (
            <div className="spinner-container">
                <div className="spinner"></div>
                <span className="spinner-text">Loading group details...</span>
            </div>
        )
    }

    if (error) {
        return (
            <div className="error-message">
                <span>⚠️ Error: {error.message || error}</span>
            </div>
        )
    }

    async function inviteHandler() {
        try {
            await inviteByLinkHook(id)
        }
        catch (err) {
            console.error(err);
        }
    }

    async function fetchGroupDetailHandler() {
        try {
            await fetchGroupDetailHook(id)
        }
        catch (err) {
            console.error(err);
        }
    }

    async function expenseSubmitHandler(e) {
        try {
            e.preventDefault();
            setError('');
            await addExpenseHook({ id, description, category, amount: parseFloat(amount), splitType })
            setdescription('');
            setamount('')
            setcategory('')
            setsplitType('equal')
            setshowExpenseForm(false)
        }
        catch (err) {
            setError(err.message)
        }
    }

    return (
        <div className="group-detail">
            {/* Header section with invite action */}
            <div className="group-detail__header">
                <div className="group-detail__header-info">
                    <h1 className="group-detail__name">{group?.name}</h1>
                    <p className="group-detail__desc">{group?.description || 'No description provided.'}</p>
                </div>
                <div className="group-detail__actions">
                    <button className="btn btn--secondary" onClick={inviteHandler}>
                        Create Invite Link
                    </button>
                    {link && (
                        <div className="group-detail__invite-widget">
                            <span>Link: <strong>{link}</strong></span>
                        </div>
                    )}
                </div>
            </div>

            {/* Main responsive grid layout */}
            <div className="group-detail__layout">
                
                {/* Expenses section (Left side on desktop) */}
                <div className="group-detail__expenses-section">
                    <div className="group-detail__section-header">
                        <h2>Expenses</h2>
                        <button 
                            className={`btn ${showExpenseForm ? 'btn--danger' : 'btn--primary'}`} 
                            onClick={() => setshowExpenseForm(prev => !prev)}
                        >
                            {showExpenseForm ? 'Cancel' : 'Add Expense'}
                        </button>
                    </div>

                    {showExpenseForm && (
                        <div className="expense-form-card">
                            <h3 className="expense-form-card__title">Add New Expense</h3>
                            {Error && <div className="error-message">{Error}</div>}
                            
                            <form className="form" onSubmit={expenseSubmitHandler}>
                                <div className="form-group">
                                    <label className="form-label">Description</label>
                                    <input 
                                        className="form-input"
                                        value={description}
                                        onChange={(e) => setdescription(e.target.value)} 
                                        type="text" 
                                        placeholder="What was this expense for?" 
                                        required 
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Amount (₹)</label>
                                    <input 
                                        className="form-input"
                                        value={amount}
                                        onChange={(e) => setamount(e.target.value)} 
                                        type="number" 
                                        placeholder="0.00" 
                                        required 
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Category</label>
                                    <select 
                                        className="form-select"
                                        value={category} 
                                        onChange={(e) => setcategory(e.target.value)}
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        <option value="food">food</option>
                                        <option value="travel">travel</option>
                                        <option value="shopping">Shopping</option>
                                        <option value="bills">Bills</option>
                                        <option value="entertainement">Entertainment</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Split Method</label>
                                    <select 
                                        className="form-select"
                                        value={splitType} 
                                        onChange={(e) => setsplitType(e.target.value)}
                                    >
                                        <option value="equal">Split Equal</option>
                                        <option value="custom">Custom Equal</option>
                                    </select>
                                </div>

                                <button className="btn btn--primary" type="submit">Add Expense</button>
                            </form>
                        </div>
                    )}

                    {expenses.length === 0 ? (
                        <div className="empty-state">
                            <span className="empty-state__icon">💸</span>
                            <h3 className="empty-state__title">No expenses yet</h3>
                            <p className="empty-state__description">Create a group expense and track who owes who!</p>
                        </div>
                    ) : (
                        <div className="expenses-grid">
                            {expenses.map((expense) => {
                                const isPayer = expense.paidBy?._id === user?.id || expense.paidBy?._id === user?._id;
                                return (
                                    <div className="expense-card" key={expense._id}>
                                        <div className="expense-card__left">
                                            <h4 className="expense-card__title">{expense.description}</h4>
                                            <div className="expense-card__details">
                                                <span className="expense-card__detail-item">
                                                    Paid by: <strong>{expense.paidBy?.name || 'Someone'}</strong>
                                                </span>
                                                <span className="badge badge--success">{expense.category}</span>
                                            </div>
                                        </div>
                                        <div className="expense-card__right">
                                            <div className="expense-card__amount-info">
                                                <span className="expense-card__amount">₹{expense.amount}</span>
                                                <div className="expense-card__split-badge">{expense.splitType || 'Equal'}</div>
                                            </div>
                                            {isPayer && (
                                                <button 
                                                    className="btn btn--text" 
                                                    onClick={() => deleteExpenseHook(expense._id)} 
                                                    title="Delete Expense"
                                                    style={{ color: '#EF4444', fontSize: '1.2rem', padding: '0 5px' }}
                                                >
                                                    🗑️
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>

                {/* Sidebar section (Right side on desktop) */}
                <div className="group-detail__sidebar-section">
                    
                    {/* Members List card */}
                    <div className="sidebar-card">
                        <h3 className="sidebar-card__title">
                            <span>Members</span>
                            <span className="badge badge--success">{group?.members?.length || 0}</span>
                        </h3>
                        <div className="member-list">
                            {group?.members?.map((member) => (
                                <div className="member-item" key={member._id}>
                                    <span className="member-item__name">{member.user?.name || 'Unknown'}</span>
                                    <span className={`member-item__role ${member.role === 'admin' ? 'member-item__role--admin' : ''}`}>
                                        {member.role}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Balances & Settlement summary card */}
                    <div className="sidebar-card">
                        <h3 className="sidebar-card__title">Balances / Settlements</h3>
                        {balance?.settlements?.length === 0 ? (
                            <p style={{ color: '#22C55E', fontWeight: 500, textAlign: 'center', margin: '15px 0' }}>
                                🎉 All settled up!
                            </p>
                        ) : (
                            <div className="settlement-list">
                                {balance?.settlements?.map((settlement, i) => (
                                    <div className="settlement-item" key={i}>
                                        <span className="settlement-item__details">
                                            <strong>{settlement.from?.name}</strong> owes <strong>{settlement.to?.name}</strong>
                                        </span>
                                        <span className="settlement-item__amount">₹{settlement.amount}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                        
                        <button 
                            className="btn btn--primary" 
                            onClick={() => navigate('/groups/settlements/' + id)}
                            style={{ width: '100%', marginTop: '15px' }}
                        >
                            View Settlements
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GroupDetail