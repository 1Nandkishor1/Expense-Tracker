import React, { useState, useEffect } from 'react'
import { useGroups } from '../hooks/useGroups'
import { useNavigate } from 'react-router-dom'

const GroupList = () => {
    let navigate = useNavigate()
    let { createGroupHook, getMyGroupHook, loading, groups, error } = useGroups()

    const [name, setname] = useState('')
    const [description, setdescription] = useState('')
    const [showform, setshowform] = useState(false)
    const [formerror, setformerror] = useState('')

    useEffect(() => {
        getMyGroupHook()
    }, [])

    if (loading) {
        return (
            <div className="spinner-container">
                <div className="spinner"></div>
                <span className="spinner-text">Loading your groups...</span>
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
        try {
            e.preventDefault();
            setformerror('');
            await createGroupHook(name, description)
            setname('')
            setdescription('')
            setshowform(false)
        }
        catch (err) {
            setformerror(err.message)
        }
    }

    return (
        <div className="group-list">
            <div className="group-list__header">
                <h1 className="group-list__title">My Expense Groups</h1>
                {!showform && (
                    <button className="btn btn--primary" onClick={() => setshowform(true)}>
                        Create New Group
                    </button>
                )}
            </div>

            {showform && (
                <div className="group-form-card">
                    <h2 className="group-form-card__title">Create New Group</h2>
                    {formerror && <div className="error-message">{formerror}</div>}
                    <form className="form" onSubmit={submitHandler}>
                        <div className="form-group">
                            <label className="form-label">Group Name</label>
                            <input
                                className="form-input"
                                value={name}
                                onChange={(e) => { setname(e.target.value) }}
                                type="text"
                                placeholder='Enter Group Name'
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <input
                                className="form-input"
                                value={description}
                                onChange={(e) => { setdescription(e.target.value) }}
                                type="text"
                                placeholder='Add Short Description'
                                required
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                            <button className="btn btn--primary" type="submit" style={{ flex: 1 }}>
                                Create Group
                            </button>
                            <button className="btn btn--secondary" type="button" onClick={() => setshowform(false)}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {groups.length === 0 ? (
                <div className="empty-state">
                    <span className="empty-state__icon">👥</span>
                    <h2 className="empty-state__title">No groups yet</h2>
                    <p className="empty-state__description">Create a group to start splitting expenses with friends!</p>
                    {!showform && (
                        <button className="btn btn--primary" onClick={() => setshowform(true)}>
                            Create a Group
                        </button>
                    )}
                </div>
            ) : (
                <div className="group-grid">
                    {groups.map((group) => (
                        <div 
                            className="group-card" 
                            onClick={() => navigate('/group/' + group._id)} 
                            key={group._id}
                        >
                            <h3 className="group-card__name">{group.name}</h3>
                            <p className="group-card__desc">{group.description || 'No description provided.'}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default GroupList