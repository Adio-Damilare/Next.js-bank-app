import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import Style from "/styles/Verification.module.css";
import Head from "next/head";
import { useFormik } from "formik";
import * as yup from "yup";
import Loading from "../../Component/Loading";
import axios from "axios";
import { Reset } from "../../Redux/RegisterSlice";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Verification = () => {
  const { email } = useSelector((state: any) => state.Register);
  const [message, setMessage] = React.useState<string>("");
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = React.useState<Boolean>(false);
  const useRoute = useRouter();
  useEffect(() => {
    if (!email) {
      useRoute.back();
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      Otp: "",
    },
    onSubmit: async (values) => {
      setIsLoading(true);
      let result: any = await axios.post("/api/Register/Verification", {
        email,
        otp: values.Otp,
      });
      if (result.data.status) {
        useRoute.push("/Login");
        dispatch(Reset());
      } else {
        setMessage(result.data.message);
      }
      console.log(result.data.message);
      setIsLoading(false);
    },
    validationSchema: yup.object({
      Otp: yup.string().min(4).required().max(4),
    }),
  });


  
  const Resendmail = async () => {
    setIsLoading(true)
    let result:any = await axios.post("/api/Register/ResendToken", { email });
    if(result.data.status){
      toast.success(result.data.message,{
        position:toast.POSITION.BOTTOM_RIGHT
      })
    }else{
      toast.error(result.data.message,{
        position:toast.POSITION.BOTTOM_RIGHT
      })
    }
    setIsLoading(false)
  };

  return (
    <div>
      <Head>
        <title>Verification Page</title>
      </Head>
      <div className="container-fluid" id={Style.Container}>
        <div className="row " id={Style.Row}>
          <form className="col-6 mx-auto" onSubmit={formik.handleSubmit}>
            <article className="my-2">Verification page </article>
            <main className="text-center">
              kindly enter the token sent to {email} or{" "}
              <b onClick={Resendmail} id={Style.ResendToken}>
                Resend{" "}
              </b>
            </main>
            {message && <div className="alert alert-danger">{message}</div>}
            <div className="form-floating ">
              <input
                type="text"
                maxLength={4}
                max={9999}
                id={Style.Input}
                className={
                  formik.touched.Otp
                    ? formik.errors.Otp
                      ? "form-control is-invalid"
                      : "form-control is-valid"
                    : "form-control"
                }
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Email address"
                name="Otp"
              />
            </div>
            <div className="mt-4">
              <button
                className="btn "
                disabled={formik.values.Otp.length != 4}
                type="submit"
                id={Style.Button}
              >
                Get Verify
              </button>
            </div>
          </form>
        </div>
      </div>
      {isLoading && <Loading />}
      < ToastContainer/>
    </div>
  );
};

export default Verification;
