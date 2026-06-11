// pages/JoinGroup.jsx
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useGroupDetail } from '../hooks/useGroupDetail'



const JoinGroup = () => {
    let { joinByLinkHook } = useGroupDetail()
    const { token } = useParams()
      const navigate = useNavigate()
      const [message, setMessage] = useState('Joining group...')

    async function joinHandler(token) {
        await joinByLinkHook(token)
        setMessage('Joined Group! Redirecting')
        setTimeout(() => {
            navigate('/groups')
            
        }, 1500);
    }

    useEffect(() => {
        joinHandler(token)
    }
, [token])


return <h2>{message}</h2>
}

export default JoinGroup