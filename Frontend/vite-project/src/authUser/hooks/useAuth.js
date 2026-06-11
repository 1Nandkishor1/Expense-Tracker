
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { userLogin,userLogout,userRegister ,updateProfile,uploadAvatar} from "../services/authServices";
import { useState } from "react";


export function useAuth(){
let context=useContext(AuthContext);
let{user,setUser,loading,setLoading,login,logout,checkAuth}=context;
const [avatar, setavatar] = useState(null)

async function registerHook(username,email,password){
    try{
    setLoading(true)
    let response=await userRegister(username,email,password)
    setUser(response.userdata)
    setLoading(false)
    }
    catch(err){
        throw err
    }
    finally{
        setLoading(false)
    }

}

async function loginHook(email,password){
    try{
        setLoading(true)
        let response=await userLogin(email,password)
        await login(response.token, response.logindata)
        setUser(response.logindata)
        await checkAuth()
        setLoading(false)

    }
    catch(err){
        throw err

    }
    finally{
        setLoading(false)
    }
    
}
async function logoutHook(){
    try{
        setLoading(true)
        let response=await userLogout();
        await logout()
        setUser(null)
        setLoading(false)
    }
    catch(err){
        throw err
    }
    finally{
        setLoading(false)

    }

}

async function updateProfileHook(name,email){
    try{
        setLoading(true)
        let response=await updateProfile(name,email)
        setUser(response.profile)

        return response.profile

    }
    catch(err){
        throw err

    }
    finally{
        setLoading(false)
    }

}

async function uploadAvatarHook(file){
    try{
        setLoading(true)
        console.log("check2",file)
        let response=await uploadAvatar(file)
        console.log(user)
        setUser((prev)=>{
            return {...prev,avatar:response.avatar}
        })
        console.log(user)
    }
    catch(err){
        throw err

    }
    finally{
        setLoading(false)
    }

}

return {registerHook,loginHook,logoutHook,user,loading,updateProfileHook,uploadAvatarHook}

}
