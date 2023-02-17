import React, { useRef, useState } from "react";
import Style from "/styles/Login.module.css";
import Head from "next/head";
import { useFormik } from "formik";
import * as yup from "yup";
import Loading from "../../Component/Loading";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { AddUser } from "../../Redux/RegisterSlice";

const Login = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [message, setmessage] = useState<string>("");
  const [cookie, setCookie] = useCookies(["userToken"]);
  const useRoute = useRouter();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      setIsLoading(true);
      let { data: response }: any = await axios.post(
        "/api/Register/Login",
        values
      );
      if (response.status) {
        if (response.token == "Not yet verify") {
          dispatch(AddUser(values.email));
          useRoute.push("/Register/Verification");
        } else {
          setCookie("userToken", response.token, {
            path: "/",
            maxAge: 3600000000000,
            sameSite: true,
          });
          useRoute.push(`/Dashboard/?user=${response.token}`);
        }
      } else {
        setmessage(response.message);
        setIsLoading(false);
      }
    },
    validationSchema: yup.object({
      email: yup.string().required().email().trim(),
      password: yup.string().required().min(5).trim(),
    }),
  });

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <div className="container-fluid" id={Style.Container}>
        <div className="row " id={Style.Row}>
          <form className="col-6 mx-auto" onSubmit={formik.handleSubmit}>
            <article className="my-2">Welcome back</article>
            {message && <div className="alert alert-danger">{message}</div>}
            <div className="form-floating ">
              <input
                type="text "
                id={Style.Input}
                className={
                  formik.touched.email
                    ? formik.errors.email
                      ? "form-control is-invalid"
                      : "form-control is-valid"
                    : "form-control"
                }
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Email address"
                name="email"
              />
              <label htmlFor="">Email address</label>
            </div>
            <article id={Style.errorMessage} className="text-danger">
              {formik.touched.email
                ? formik.errors.email
                  ? formik.errors.email
                  : ""
                : ""}
            </article>
            <div className="form-floating mt-4">
              <input
                type="text "
                id={Style.Input}
                className={
                  formik.touched.password
                    ? formik.errors.password
                      ? "form-control is-invalid"
                      : "form-control is-valid"
                    : "form-control"
                }
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Password"
                name="password"
              />
              <label htmlFor="">Password</label>
            </div>
            <article id={Style.errorMessage} className="text-danger">
              {formik.touched.password
                ? formik.errors.password
                  ? formik.errors.password
                  : ""
                : ""}
            </article>
            <div className="mt-4">
              <button className="btn" type="submit" id={Style.Button}>
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
      {isLoading && <Loading />}
    </>
  );
};

export default Login;
