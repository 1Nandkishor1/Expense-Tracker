
import api from '../../axiosInstance/axios'


export async function userRegister(name,email,password){
    try {
        let response=await api.post('/user/register',{name,email,password});
        console.log(response.data);
        return response.data
        
    } catch (err) {
        console.log(err);
        throw err.response?.data || { message: "Server connection failed. Please check if the backend is running." };
    }
}

export async function userLogin(email, password){
    try {
        let response=await api.post('user/login',{email,password});
        console.log(response.data);
        return response.data;

    } catch (err) {
        console.log(err);
        throw err.response?.data || { message: "Server connection failed. Please check if the backend is running." };
        
    }
}

export async function getMe(){
    try {
        let response=await api.get('user/getme');
        console.log(response.data);
        return response.data
        
    } catch (err) {
        console.log(err);
        throw err.response?.data || { message: "Server connection failed. Please check if the backend is running." };
        
    }
}

export async function userLogout(){
    try {
        let response=await api.post('user/logout');
        console.log(response.data);
        return response.data
        
    } catch (err) {
        console.log(err);
        throw err.response?.data || { message: "Server connection failed. Please check if the backend is running." };
        
    }
}


export async function getProfile(){
        try{
        let response=await api.get('/profile/get/')
        console.log(response.data)
        return response.data

    }
    catch(err){
          console.log(err);
        throw err.response?.data || { message: "Server connection failed. Please check if the backend is running." };
    }
    
    

}
export async function updateProfile(name,email){
        try{
            let response=await api.patch('/profile/update/',{name,email})
            console.log(response.data)
            return response.data
    
        }
        catch(err){
              console.log(err);
            throw err.response?.data || { message: "Server connection failed. Please check if the backend is running." };
        }
        

}
export async function uploadAvatar(file){
    try{
              const formData = new FormData()
    formData.append('avatar', file)
    console.log("check3",formData)
        let response=await api.patch('/profile/avatar/',formData,{
            headers:{"Content-Type":'multipart/form-data'}
        })
        console.log(response.data)
        return response.data
    
        }
        catch(err){
              console.log(err);
            throw err.response?.data || { message: "Server connection failed. Please check if the backend is running." };
        }
    

}

