import api from "../../axiosInstance/axios";

export async function addExpense({id,description, category, amount, splitType, customSplits}){
    try{
        console.log("ID:"+id,"Description:"+description,"Category:"+category,"Amount:"+amount,"SplitType:"+splitType)
        let response=await api.post('/expense/add/'+id,{description, category, amount, splitType, customSplits})
        console.log(response.data)
        return response.data
        //  description, category, amount, splitType, customSplits
    }
    catch(err){
         console.log(err);
        throw err.response?.data || { message: "Server connection failed. Please check if the backend is running." };
    }

}

export async function getAllExpenses(id){
    try{
        let response=await api.get('/expense/get/'+id)
        console.log(response.data)
        return response.data
    }
    catch(err){
         console.log(err);
        throw err.response?.data || { message: "Server connection failed. Please check if the backend is running." };

    }

}

export async function deleteExpense(expenseId){
    try{
        let response=await api.delete('/expense/remove/'+expenseId)
        console.log(response.data)
        return response.data
    }
    catch(err){
         console.log(err);
        throw err.response?.data || { message: "Server connection failed. Please check if the backend is running." };

    }

}