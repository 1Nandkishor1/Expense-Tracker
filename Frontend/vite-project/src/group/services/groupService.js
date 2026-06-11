
import api from "../../axiosInstance/axios";

export async function createGroup(name,description){
    try{
        let response=await api.post('/group/create',{name,description})
        console.log(response.data)
        return response.data
    }
    catch(err){
          console.log(err);
        throw err.response?.data || { message: "Server connection failed. Please check if the backend is running." };
    }

}
export async function getMyGroup(){
    try{
        let response=await api.get('/group/mygroups')
        console.log(response.data)
        return response.data
    }
    catch(err){
          console.log(err);
        throw err.response?.data || { message: "Server connection failed. Please check if the backend is running." };
    }

}
export async function getSingleGroup(id){
    try{
        let response=await api.get('/group/groupmember/'+id)
        console.log(response.data)
        return response.data
    }
    catch(err){
          console.log(err);
        throw err.response?.data || { message: "Server connection failed. Please check if the backend is running." };
    }

}

export async function getGroupBalance(id){
    try{
        let response=await api.get('/balance/'+id)
        console.log(response.data)
        return response.data
    }
    catch(err){
          console.log(err);
        throw err.response?.data || { message: "Server connection failed. Please check if the backend is running." };
    }

}
export async function inviteByLink(id){
    try{
        let response=await api.post('/invite/'+id)
        console.log(response.data)
        return response.data
    }
    catch(err){
          console.log(err);
        throw err.response?.data || { message: "Server connection failed. Please check if the backend is running." };
    }
}

export async function joinByLink(token){
    try{
        let response=await api.get('/join/'+token,)
        console.log(response.data)
        return response.data
        
    }
    catch(err){
        console.log(err)
        throw err.response?.data || { message: "Server connection failed. Please check if the backend is running." };

    }
}


