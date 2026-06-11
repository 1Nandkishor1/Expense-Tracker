
import {getSingleGroup,getGroupBalance,inviteByLink,joinByLink} from'../services/groupService'
import { deleteExpense ,addExpense,getAllExpenses} from '../../expense/services/expeseService'
import { useState,useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export function useGroupDetail(){
    let navigate=useNavigate()
    const [loading, setloading] = useState(true)
    const [group, setgroup] = useState([])
    const [expenses, setexpenses] = useState([])
    const [balance, setbalance] = useState(null)
    const [link, setlink] = useState('')
    const [error, seterror] = useState(null)
    

    async function fetchGroupDetailHook(id){
        try{
            setloading(true)
            let [groupRes,expenseRes,balanceRes]=await Promise.all([
                getSingleGroup(id),
                getAllExpenses(id),
                getGroupBalance(id),
            ])
            setgroup(groupRes.group)
            setexpenses(expenseRes.expenses)
            setbalance(balanceRes)

        }
        catch(err){
            console.log("Error:", err);
      seterror(err.message)

        }
        finally{
            setloading(false)
        }

    }

    async function addExpenseHook({id,description, category, amount, splitType, customSplits}){
        try{
            // setloading(true)
            console.log('check1')
            let response=await addExpense({id,description, category, amount, splitType, customSplits})
            setexpenses((prev)=>{return [response.expense,...prev]})
            let balanceRes=await getGroupBalance(id)
            setbalance(balanceRes)
            console.log('check2')
            // setloading(false)
            return response.expense
        }
        catch(err){
      throw err

        }
        

    }
    
    async function inviteByLinkHook(id){
        try{
            setloading(true)
            let response=await inviteByLink(id)
            setlink(response.inviteLink)
            setloading(false)
        }
        catch(err){
            console.log("Error:", err);
      seterror(err.message)

        }
        finally{
            setloading(false)
        }

    }

    async function deleteExpenseHook(expenseId){
        try{
            let response=await deleteExpense(expenseId)
            setexpenses((prev)=>{return prev.filter((e)=>e._id!==expenseId)})

            let balanceRes=await getGroupBalance(id)
            setbalance(balanceRes.balance)

        }
        catch(err){
            throw err

        }
        

    }

    async function joinByLinkHook(token){
        try{
            let response=await joinByLink(token)
            


        }
        catch(err){
            throw err

        }

    }

return {group,expenses,balance,error,loading,link,fetchGroupDetailHook,addExpenseHook,inviteByLinkHook,deleteExpenseHook,joinByLinkHook}

}