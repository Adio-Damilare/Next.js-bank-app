import React,{useEffect,useState} from 'react'
import useSwr, { mutate } from "swr"
import axios from 'axios';
import { toast } from 'react-toastify';
import { useRouter } from "next/router"
import Fetcher from './Fetcher';
import { useCookies } from 'react-cookie';
import checkMessage from './checkMessage';


const useDashboardDetails = () => {
  const [cookies, , removeCookies] = useCookies();
  const [user,setuser]=useState<any>(undefined)
  const [errorstate,seterrorstate]=useState<any>(undefined)

  const { data, error,mutate } = useSwr(`/api/Dashboard+and${cookies.userToken}`, Fetcher,);
  const useRoute=useRouter()
  
  useEffect(() => {
    CheckData();
  }, [data]);

  const CheckData = () => {
    if (checkMessage(data?.data.message as string)) {

      removeCookies("userToken")
      toast.error("Cannot get dashboard", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      return useRoute.push("/Login");
    }
    if (data?.data.user) {
      console.log(data.data)
      setuser(data?.data.user);
    }else{
      seterrorstate(true)
      console.log(data?.data.message)
    }
  };
  return (
    [user,errorstate]
  )
}


export default useDashboardDetails
export const handleMutate =()=> mutate("");