
import {createGroup,getMyGroup,getSingleGroup} from'../services/groupService'
import { useState,useEffect } from 'react'

export function useGroups(){
  const [loading, setLoading] = useState(true)
  const [groups, setGroups] = useState([])
  const [error, setError] = useState(null)

  async function getMyGroupHook(){
    try{
      setLoading(true)
      console.log("Starting request");
      let response=await getMyGroup();
      console.log("Response:", response);

      setGroups(response.groups)
      setLoading(false)
    }
    catch(err){
          console.log("Error:", err);
      setError(err.message)
    }
    finally{
      setLoading(false)
    }
    
    }

    useEffect(() => {
    getMyGroupHook()
  }, [])

  async function createGroupHook(name,description){
    try{
      setLoading(true)
      let response=await createGroup(name,description)
      setGroups((prev)=>{return [response.group,...prev]})
      setLoading(false)
    }
    catch(err){
      throw err
    }
    finally{
      setLoading(false)
    }

    }


    return {createGroupHook,getMyGroupHook,loading,groups,error}

}
