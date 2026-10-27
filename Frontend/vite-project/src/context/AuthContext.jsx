

// import React,{useState,useEffect} from 'react'
// import { createContext } from 'react'
// import { getMe } from '../authUser/services/authServices'

// export let AuthContext=createContext()
// export const AuthProvider = ({children}) => {
//     const [loading, setLoading] = useState(true)
//     const [user, setUser] = useState(null)

//     let token;

//     function checkAuth(){
//         token=localStorage.getItem('token')
//         if(token){
//             getMe()
//             .then(res=>setUser(res.userdata))
//             .catch(()=>localStorage.removeItem('token'))
//             .finally(()=>setLoading(false))
//             // console.log(user)
            
//         }

//         else{
//             setLoading(false)
//         }
//     }

//     useEffect(() => {
//         checkAuth();
//     }, [])

//     let login=(token,userData)=>{
//         localStorage.setItem('token',token)
//         setUser(userData)
//     }
    
//     let logout=()=>{
//         localStorage.removeItem('token',token);
//         setUser(null)
//     }

//   return (
//     <AuthContext.Provider value={{user,setUser,loading,setLoading,login,logout,checkAuth}}>
//         {children}
//     </AuthContext.Provider>
//   )
// }

import React,{useState,useEffect} from 'react'
import { createContext } from 'react'
import { getMe } from '../authUser/services/authServices'

export let AuthContext=createContext()

export const AuthProvider = ({children}) => {
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)

    // on app load — just call getMe
    // if cookie exists browser sends it automatically (withCredentials:true)
    // no need to check localStorage for token anymore
    function checkAuth(){
        getMe()
        .then(res => setUser(res.userdata))
        .catch(() => setUser(null))   // if cookie missing or expired — just set null
        .finally(() => setLoading(false))
    }

    useEffect(() => {
        checkAuth();
    }, [])

    // login — no need to store token in localStorage
    // cookie is set by backend automatically in the response
    let login=(userData)=>{
        setUser(userData)
    }
    
    // logout — cookie is cleared by backend
    let logout=()=>{
        setUser(null)
    }

  return (
    <AuthContext.Provider value={{user,setUser,loading,setLoading,login,logout,checkAuth}}>
        {children}
    </AuthContext.Provider>
  )
}