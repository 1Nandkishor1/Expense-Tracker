
import api from "../../axiosInstance/axios";

export async function createSettlement(id,paidTo,amount){
    try{
        let response=await api.post('/settlement/'+id,{paidTo,amount})
        console.log(response.data)
        return response.data

    }
    catch(err){
          console.log(err);
        throw err.response?.data || { message: "Server connection failed. Please check if the backend is running." };
    }

}

export async function getGroupSettlements(id){
        try{
        let response=await api.get('/settlement/all/'+id)
        console.log(response.data)
        return response.data

    }
    catch(err){
          console.log(err);
        throw err.response?.data || { message: "Server connection failed. Please check if the backend is running." };
    }


}
export async function confirmSettlement(settlementId){
        try{
        let response=await api.patch('/settlement/confirm/'+settlementId)
        console.log(response.data)
        return response.data

    }
    catch(err){
          console.log(err);
        throw err.response?.data || { message: "Server connection failed. Please check if the backend is running." };
    }
    

}

export async function uploadScreenshot(settlementId,file){
        try{
             const formData = new FormData()
    formData.append('screenshot', file)
        let response=await api.patch('/settlement/screenshot/'+settlementId,formData,{
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