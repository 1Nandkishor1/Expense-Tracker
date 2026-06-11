
import axios from 'axios'

let api=axios.create({
    baseURL:"http://localhost:3000/api",
    withCredentials:true
})

api.interceptors.request.use((config)=>{
    let token=localStorage.getItem('token');
    if(token){
        config.headers.Authorization=`Bearer ${token}`
    }
    return config;
})

export default api