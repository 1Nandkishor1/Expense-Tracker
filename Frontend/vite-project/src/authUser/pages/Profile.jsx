import React, { useState, useEffect, useContext } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Profile = () => {
    let context = useContext(AuthContext)
    let { updateProfileHook, uploadAvatarHook, logoutHook, user, loading } = useAuth();
    let navigate = useNavigate();
    const [name, setname] = useState('')
    const [email, setemail] = useState('')
    const [error, seterror] = useState(null)
    const [successmessage, setsuccessmessage] = useState(null)
    const [avatarpreview, setavatarpreview] = useState(user?.avatar?.url || null)

    useEffect(() => {
        if (user) {
            setname(user.name || "");
            setemail(user.email || "");
            if (user.avatar?.url) {
                setavatarpreview(user.avatar.url);
            }
        }
    }, [user]);

    if (loading) {
        return (
            <div className="profile-container">
                <div className="profile-card">
                    <div className="spinner-container">
                        <div className="spinner"></div>
                        <span className="spinner-text">Loading profile...</span>
                    </div>
                </div>
            </div>
        )
    }

    async function updateHandler(e) {
        try {
            e.preventDefault()
            seterror(null)
            setsuccessmessage(null)
            await updateProfileHook(name, email)
            setsuccessmessage("Profile Updated Successfully")
        }
        catch (err) {
            seterror(err.message)
            setsuccessmessage(null)
        }
    }

    async function handleAvaterUpload(e) {
        try {
            const file = e.target.files[0]
            if (!file) return
            console.log(file)
            setavatarpreview(URL.createObjectURL(file))
            await uploadAvatarHook(file)
            setsuccessmessage("Avatar Updated Successfully")
            seterror(null)
        }
        catch (err) {
            seterror(err.message)
            setavatarpreview(user?.avatar?.url || null) 
        }
    }

    async function handleLogout(e){
        try{
            await logoutHook()
            navigate('/login')
        }
        catch(err){
            seterror(err.message)
        }
    }

    return (
        <div className="profile-container">
            <div className="profile-card">
                <div className="profile-card__header">
                    <div className="profile-card__avatar-wrapper">
                        {avatarpreview ? (
                            <div className="profile-card__avatar-container">
                                <img className="profile-card__avatar" src={avatarpreview} alt='avatar' />
                            </div>
                        ) : (
                            <div className="profile-card__avatar-container">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <input type="file" accept='image/*' id='avatarInput' style={{display:'none'}} onChange={handleAvaterUpload} />
                        <label htmlFor='avatarInput' className="profile-card__avatar-overlay">Change</label>
                    </div>
                    <label htmlFor='avatarInput' className="profile-card__avatar-label">Change Avatar</label>
                    
                    <h2 className="profile-card__title">{user?.name || "User Profile"}</h2>
                    <p className="profile-card__subtitle">{user?.email || ""}</p>
                </div>

                {successmessage && <div className="success-message">{successmessage}</div>}
                {error && <div className="error-message">{error}</div>}

                <form className="profile-card__form" onSubmit={updateHandler}>
                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input 
                            type="text" 
                            className="form-input"
                            value={name} 
                            placeholder='Your Name' 
                            onChange={(e)=>{setname(e.target.value)}}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input 
                            type="email" 
                            className="form-input"
                            placeholder='Your Email' 
                            value={email} 
                            onChange={(e)=>{setemail(e.target.value)}} 
                            required
                        />
                    </div>
                    <button type='submit' className="btn btn--primary">Update Profile</button>
                </form>

                <div className="profile-card__logout-section">
                    <button onClick={handleLogout} className="btn btn--danger">Logout</button>
                </div>
            </div>
        </div>
    )
}

export default Profile