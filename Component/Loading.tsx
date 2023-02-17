import React from "react";
import Styles from "../styles/Loading.module.css";
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Loading = ({index,Position}:any) => {
  return (
    <div style={index ?{zIndex:index,position:Position?Position:"fixed"}:{}} id={Styles.Container}>
      <div id={Styles.Background}>
      <div className="spinner">
        <div className="spinner-border text-primary p-5" id={Styles.Spinner} role="status">
          <span className="visually-hidden"></span>
        </div>
      </div>
    </div>
    <ToastContainer/>
      </div>
  );
};

export default Loading;
