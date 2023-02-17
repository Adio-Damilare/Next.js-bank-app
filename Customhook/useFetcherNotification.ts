import React, { useEffect, useState } from "react";

import swr from "swr";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import { Router, useRouter } from "next/router";
import axios from "axios";
// import music from "./audio.mp3"
import Fetcher from "./Fetcher";
import checkMessage from "./checkMessage";
const useFetcherNotification = () => {
  // const [audio] =useState<any>(new Audio(require("./audio.mp3")))
  const useRoute = useRouter();
  const [allNot, setallNot] = useState<any>();
  const [cookies, , removeCookies] = useCookies();
  const { data, error } = swr(
    `/api/Dashboard/notification/?+and${cookies.userToken}`,
    Fetcher
  );
  useEffect(() => {
    sendNotification();
    // audio.play()
  }, [data]);
  const sendNotification = () => {
    if (checkMessage( data?.data?.message as string)) {
      removeCookies("userToken");
      // 
      return useRoute.push("/Login");
    }
    if (data?.data?.results?.length > 0 && data?.data?.status) {
      // mapping of the Notification 
      data?.data.results.map((item: any) => {
        if (item.isSuccess) {
          toast.success(item.text, {
            position: toast.POSITION.BOTTOM_RIGHT,
          });
        } else {
          toast.error(item.text, {
            position: toast.POSITION.BOTTOM_RIGHT,
          });
        }
       
      });
    }
  };

  return [];
};

export default useFetcherNotification;
