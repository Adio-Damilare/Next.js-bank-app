import React, { useState } from "react";
import Head from "next/head";
import Style from "/styles/Register.module.css";
import Link from "next/link";
import Loading from "../../Component/Loading";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { useRouter } from "next/router";
import { AddUser } from "../../Redux/RegisterSlice";
import { useDispatch } from "react-redux";

const Register = () => {
  const [states, setStates] = useState<number>(1);
  const [loading, setloading] = useState<Boolean>(false);
  const [message, setmessage] = useState<string>("");
  const useRoute = useRouter();
  const dispatch = useDispatch();
  const [data, setdata] = useState<any>({});

  const LoadingFunction = (numberTo: number, detail: any = false) => {
    let index = 1;
    setloading(true);
    // the loading interval
    let interval = setInterval(() => {
      if (index == 5) {
        index = 1;
        clearInterval(interval);
        setloading(false);
        if (detail) {
          setdata((prev: any) => {
            return { ...prev, ...detail };
          });
        }
        setStates(numberTo);
      } else {
        index++;
        setloading(true);
      }
    }, 100);
  };

  const HandleSubmitForm = async (value: any) => {
    setloading(true);
    axios.post("/api/Register/", {
      ...data,
      username: value,
    }).then((response:any)=>{
      console.log(response)
      if (response.data.status) {
        dispatch(AddUser(data.email));
        useRoute.push("/Register/Verification");
      } else {
        if (response.data.message == "Email already exist") {
          setStates(2);
          setmessage("Email already exist");
        } else {
          setmessage(response.data.message);
        }
      }
    }).catch((err)=>{
      setmessage(err.message);
    })
    .finally(()=>{
      setloading(false);
    });
  };

  return (
    <>
      <Head>
        <title>REGISTER PAGE</title>
      </Head>
      <div id={Style.Container}>
        {states == 1 && (
          <FirstComponent  LoadingFunction={LoadingFunction} />
        )}
        {states == 2 && (
          <SecondComponent
            LoadingFunction={LoadingFunction}
            message={message}
          />
        )}
        {states == 3 && (
          <ThirdComponent
            LoadingFunction={LoadingFunction}
            HandleSubmitForm={HandleSubmitForm}
            message={message}
          />
        )}
      </div>
      {loading && <Loading />}
    </>
  );
};
export default Register;

//  this is the first Component
const FirstComponent = (props: any) => {
  const formik = useFormik({
    initialValues: {
      firstname: "",
      lastname: "",
    },
    onSubmit: (values) => {
      props.LoadingFunction(2, values);
    },
    validationSchema: yup.object({
      firstname: yup
        .string()
        .required()
        .min(3, "firstname must be atleast three characters")
        .trim(),
      lastname: yup
        .string()
        .required()
        .min(3, "lasstname must be atleast three characters")
        .trim(),
    }),
  });
  return (
    <>
      <form id={Style.Children} onSubmit={formik.handleSubmit}>
        <div>
          <h3>Register page</h3>
          <article id={Style.AlreadyHaveAccount}>
            Kindly provide your Firstname and Lastname
          </article>
        </div>
        <div className="form-floating">
          <input
            type="text"
            value={formik.values.firstname}
            className={
              formik.touched.firstname
                ? formik.errors.firstname
                  ? "form-control  is-invalid"
                  : " form-control is-valid"
                : " form-control "
            }
            placeholder="Firstname"
            name="firstname"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            id={Style.Input}
          />
          <label htmlFor="">Firstname</label>
        </div>
        <article className="text-danger" id={Style.ErrorMessage}>
          {formik.touched.firstname
            ? formik.errors.firstname
              ? formik.errors.firstname
              : ""
            : ""}
        </article>
        <div className="form-floating mt-3">
          <input
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={
              formik.touched.lastname
                ? formik.errors.lastname
                  ? "form-control  is-invalid"
                  : " form-control is-valid"
                : " form-control "
            }
            placeholder="lastname"
            name="lastname"
            id={Style.Input}
          />
          <label htmlFor="">Lastname</label>
        </div>
        <article className="text-danger" id={Style.ErrorMessage}>
          {formik.touched.lastname
            ? formik.errors.lastname
              ? formik.errors.lastname
              : ""
            : ""}
        </article>
        <article
          className="d-block text-start my-2"
          id={Style.AlreadyHaveAccount}
        >
          Already have an account <Link href="/Login"> Login</Link>
        </article>
        <button
          className="btn btn-primary btn-lg mt-3"
          id={Style.FirstComponentButton}
          type="submit"
        >
          Next
        </button>
      </form>
    </>
  );
};

//  this is the Second Component
const SecondComponent = (props: any) => {
  const Previous = () => props.LoadingFunction(1);
  const HandleNext = () => formik.handleSubmit();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: (values) => {
      props.LoadingFunction(3, values);
    },
    validationSchema: yup.object({
      email: yup.string().email().required().trim(),
      password: yup
        .string()
        .required()
        .min(8, "lasstname must be atleast eight characters")
        .trim(),
    }),
  });

  return (
    <div id={Style.Children}>
      <div>
        <h3>Register page</h3>
        <article id={Style.AlreadyHaveAccount}>
          Kindly provide your Email address and password
        </article>
      </div>
      {props.message && (
        <div className="alert alert-danger text-danger">{props.message}</div>
      )}
      <div className="form-floating mt-3">
        <input
          type="email"
          name="email"
          className={
            formik.touched.email
              ? formik.errors.email
                ? "form-control  is-invalid"
                : " form-control is-valid"
              : " form-control "
          }
          placeholder="Email address"
          value={formik.values.email}
          id={Style.Input}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <label htmlFor="">Email address</label>
      </div>
      <article className="text-danger" id={Style.ErrorMessage}>
        {formik.touched.email
          ? formik.errors.email
            ? formik.errors.email
            : ""
          : ""}
      </article>

      <div className="form-floating mt-3">
        <input
          type="password"
          name="password"
          value={formik.values.password}
          className={
            formik.touched.password
              ? formik.errors.password
                ? "form-control  is-invalid"
                : " form-control is-valid"
              : " form-control "
          }
          placeholder="Password"
          id={Style.Input}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <label htmlFor="">Password</label>
      </div>
      <article className="text-danger" id={Style.ErrorMessage}>
        {formik.touched.password
          ? formik.errors.password
            ? formik.errors.password
            : ""
          : ""}
      </article>

      <div id={Style.ButtonsSection}>
        <button onClick={Previous} className="btn  btn-primary">
          Back
        </button>
        <button
          onClick={HandleNext}
          id={Style.specialButton}
          className="btn  btn-success"
        >
          Next
        </button>
      </div>
    </div>
  );
};

//  this is the third Component
const ThirdComponent = (props: any) => {
  const formik = useFormik({
    initialValues: {
      username: "",
    },
    onSubmit: ({ username }) => {
      props.HandleSubmitForm(username);
    },
    validationSchema: yup.object({
      username: yup
        .string()
        .required()
        .min(5, "lasstname must be atleast five characters")
        .max(16)
        .trim(),
    }),
  });

  const HandleNext = () => formik.handleSubmit();
  const Previous = () => props.LoadingFunction(2);

  return (
    <div id={Style.Children}>
      <div>
        <h3>Register page</h3>
        <article id={Style.AlreadyHaveAccount}>
          Kindly provide your username
        </article>
      </div>
      <div>
        {props.message &&props.message!=="Email already exist" && (
          <div className="alert alert-danger text-danger">{props.message}</div>
        )}
      </div>
      <div className="form-floating mt-3">
        <input
          type="text"
          name="username"
          className={
            formik.touched.username
              ? formik.errors.username
                ? "form-control  is-invalid"
                : " form-control is-valid"
              : " form-control "
          }
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Username"
          id={Style.Input}
        />
        <label htmlFor="">Username</label>
      </div>
      <article className="text-danger" id={Style.ErrorMessage}>
        {formik.touched.username
          ? formik.errors.username
            ? formik.errors.username
            : ""
          : ""}
      </article>
      <div id={Style.ButtonsSection}>
        <button onClick={Previous} className="btn  btn-primary">
          Back
        </button>
        <button
          onClick={HandleNext}
          id={Style.specialButton}
          className="btn  btn-success"
        >
          Next
        </button>
      </div>
    </div>
  );
};
