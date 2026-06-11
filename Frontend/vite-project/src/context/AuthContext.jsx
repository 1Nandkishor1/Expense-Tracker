

import React,{useState,useEffect} from 'react'
import { createContext } from 'react'
import { getMe } from '../authUser/services/authServices'

export let AuthContext=createContext()
export const AuthProvider = ({children}) => {
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)

    let token;

    function checkAuth(){
        token=localStorage.getItem('token')
        if(token){
            getMe()
            .then(res=>setUser(res.userdata))
            .catch(()=>localStorage.removeItem('token'))
            .finally(()=>setLoading(false))
            // console.log(user)
            // console.log('ho raha')
        }

        else{
            setLoading(false)
        }
    }

    useEffect(() => {
        checkAuth();
    }, [])

    let login=(token,userData)=>{
        localStorage.setItem('token',token)
        setUser(userData)
    }
    
    let logout=()=>{
        localStorage.removeItem('token',token);
        setUser(null)
    }

  return (
    <AuthContext.Provider value={{user,setUser,loading,setLoading,login,logout,checkAuth}}>
        {children}
    </AuthContext.Provider>
  )
}

