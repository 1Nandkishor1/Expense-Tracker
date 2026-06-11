import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSettlements } from '../hooks/useSettlements'
import { AuthContext } from '../../context/AuthContext'
import { useContext } from 'react'

const SettlementList = () => {
  const { id } = useParams()
  let context = useContext(AuthContext)
  let { user } = context;
  const {
    settlements, loading, error,
    createSettlementHook,
    confirmSettlementHook,
    uploadScreenshotHook
  } = useSettlements(id)

  const [showForm, setShowForm] = useState(false)
  const [paidTo, setPaidTo] = useState('')
  const [amount, setAmount] = useState('')
  const [formError, setFormError] = useState(null)

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
        <span className="spinner-text">Loading settlements...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-message">
        <span>⚠️ Error: {error}</span>
      </div>
    )
  }

  async function submitHandler(e) {
    e.preventDefault()
    try {
      await createSettlementHook(paidTo, parseFloat(amount))
      setPaidTo('')
      setAmount('')
      setShowForm(false)
      setFormError(null)
    } catch (err) {
      setFormError(err.message)
    }
  }

  async function handleScreenshot(settlementId, file) {
    try {
      await uploadScreenshotHook(settlementId, file)
    } catch (err) {
      console.log(err.message)
    }
  }

  async function handleConfirm(settlementId) {
    try {
      await confirmSettlementHook(settlementId)
    } catch (err) {
      console.log(err.message)
    }
  }

  return (
    <div className="settlements-page">
      <div className="settlements-page__header">
        <h1 className="settlements-page__title">Settlements</h1>
        {!showForm && (
          <button className="btn btn--primary" onClick={() => setShowForm(true)}>
            Record a Payment
          </button>
        )}
      </div>

      {showForm && (
        <div className="settlement-form-card">
          <h2 className="settlement-form-card__title">Record a Payment</h2>
          {formError && <div className="error-message">{formError}</div>}
          <form className="form" onSubmit={submitHandler}>
            <div className="form-group">
              <label className="form-label">Receiver User ID</label>
              <input
                className="form-input"
                value={paidTo}
                onChange={(e) => setPaidTo(e.target.value)}
                placeholder='Receiver User ID'
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Amount (₹)</label>
              <input
                className="form-input"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                type='number'
                placeholder='Amount'
                required
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button className="btn btn--primary" type='submit' style={{ flex: 1 }}>
                Submit Payment
              </button>
              <button className="btn btn--secondary" type="button" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {settlements.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state__icon">🤝</span>
          <h2 className="empty-state__title">No settlements yet</h2>
          <p className="empty-state__description">Create a payment record to balance group debts.</p>
          {!showForm && (
            <button className="btn btn--primary" onClick={() => setShowForm(true)}>
              Record a Payment
            </button>
          )}
        </div>
      ) : (
        <div className="settlement-grid">
          {settlements.map(settlement => {
            const isPayer = settlement.paidBy?._id === user?.id || settlement.paidBy?._id === user?._id;
            const isReceiver = settlement.paidTo?._id === user?.id || settlement.paidTo?._id === user?._id;
            
            return (
              <div 
                key={settlement._id} 
                className={`settlement-card ${settlement.isSettled ? 'settlement-card--confirmed' : 'settlement-card--pending'}`}
              >
                <div className="settlement-card__main">
                  <div className="settlement-card__details">
                    <p className="settlement-card__text">
                      <strong>{settlement.paidBy?.name}</strong> paid <strong>{settlement.paidTo?.name}</strong>
                    </p>
                    <div className="settlement-card__status-wrapper">
                      <span className={`badge ${settlement.isSettled ? 'badge--success' : 'badge--warning'}`}>
                        {settlement.isSettled ? '✅ Confirmed' : '⏳ Pending'}
                      </span>
                    </div>
                  </div>
                  <span className="settlement-card__amount">₹{settlement.amount}</span>
                </div>

                {settlement.screenshot?.url && (
                  <div className="settlement-card__image-container">
                    <img
                      src={settlement.screenshot.url}
                      alt='payment proof'
                      className="settlement-card__image"
                    />
                  </div>
                )}

                {((isPayer || isReceiver) && !settlement.isSettled) && (
                  <div className="settlement-card__actions">
                    {isPayer && !settlement.isSettled && (
                      <label className="settlement-card__file-upload">
                        📁 {settlement.screenshot?.url ? 'Update screenshot proof' : 'Upload screenshot proof'}
                        <input
                          type='file'
                          accept='image/*'
                          onChange={(e) => handleScreenshot(settlement._id, e.target.files[0])}
                        />
                      </label>
                    )}

                    {isReceiver && !settlement.isSettled && (
                      <button className="btn btn--primary" onClick={() => handleConfirm(settlement._id)}>
                        Confirm Payment
                      </button>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default SettlementList