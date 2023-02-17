import { useRouter } from 'next/router';
import React,{useEffect,useState} from 'react';
import { useCookies } from 'react-cookie';
import { toast } from 'react-toastify';
import useSwr from "swr"
import Fetcher from './Fetcher';
import checkMessage from "./checkMessage"

const useFetchTransactions = () => {
  const useroute=useRouter()
  const [cookies, , removeCookies] = useCookies();
  const [transactions,setTransactions]=useState<any>(undefined);
  const [transactionError,setTransactionError]=useState(false);
  const { data,error}=useSwr(`/api/Dashboard/Transaction+and${cookies.userToken}`,Fetcher);

  useEffect(() => {
    checkData()
  }, [data])
  
  const checkData=()=>{
    if (checkMessage(data?.data?.message as string)    ) {
      removeCookies("userToken")
      toast.error("Cannot get dashboard", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      return useroute.push("/Login");
    } 
    if(data?.data?.value && data?.data?.status){
      setTransactions(data?.data?.value)
    }else{
      setTransactionError(true)
    }
  }
  
  return (
    [transactions,transactionError]
  )
}

export default useFetchTransactions