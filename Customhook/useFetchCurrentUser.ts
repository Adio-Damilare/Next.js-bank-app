import { Router, useRouter } from "next/router";
import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { useSelector,useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Fetcher from "./Fetcher";
import {AddDetails} from "../Redux/CurrentUserSlice"
import checkMessage from "./checkMessage";

const useFetchCurrentUser = () => {
  const {details}=useSelector((state:any)=>state.currentUser)
  const [cookies, , removeCookies] = useCookies();
  const useRoute = useRouter();
  const dispatch=useDispatch();
  const [User,setUser]=useState<any>(undefined)
  const [error,seterror]=useState<any>(undefined)
  React.useEffect(() => {
    if (!cookies.userToken) {
      useRoute.back();
    }else{
      if(details){
        setUser(details)
      }else{
        Fetcher(`/api/Dashboard+and${cookies.userToken}`).then((data:any)=>{
          if (checkMessage(data?.data?.message as string) ) {
            removeCookies("userToken")
            toast.error("Cannot get dashboard", {
              position: toast.POSITION.BOTTOM_RIGHT,
            });
            return useRoute.push("/Login");
          }
          if (data?.data.user) {
            setUser(data?.data.user);
            dispatch(AddDetails(data?.data.user))
          }else{
            seterror(true)
          }
        })
      }
    }

  }, []);
  return [User,error];
};

export default useFetchCurrentUser;
