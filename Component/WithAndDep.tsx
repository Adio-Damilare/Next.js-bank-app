import React, { useState } from "react"
import Styles from "../styles/TransactToBank.module.css";
import { useFormik } from "formik";
import * as yup from "yup";
import Loading from "./Loading";
import { GrClose } from "react-icons/gr"
import axios from "axios";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HiOutlineArrowLeft } from "react-icons/hi";
import { useCookies } from "react-cookie";
import { ImCheckmark, ImCross } from "react-icons/im";

const WithAndDep = ({ DepWith, setDepWith }: any) => {
    const useRoute = useRouter()
    const [cookies, , removeCookies] = useCookies();
    let token = cookies?.userToken ? cookies?.userToken : "";
    const [states, setStates] = useState<number>(1)
    const [details, setdetails] = useState<any>({})
    const [isLoading, setLoading] = useState<boolean>(false)
    const [Message, setMessage] = useState<string>("")
    const [result, setresult] = useState<any>({})

    const handleSubmit = (numberTo: number, val: any = false) => {
        let index = 1;
        setLoading(true);
        let interval = setInterval(() => {
            if (index == 5) {
                index = 1;
                clearInterval(interval);
                setLoading(false);
                if (val) {
                    setdetails({ ...details, ...val })
                }
                setStates(numberTo)

            } else {
                index++;
            }
        }, 200)

    }

    const Submit = (val: any) => {
        setLoading(true)
        axios.post("api/Dashboard/WithAndDep", { ...details, ...val, token, DepWith: DepWith == "Withdraw" }).then(({ data }: any) => {
            if (!data.status && data.message) {
                if (
                    data.message == "invalid token" ||
                    data.message == "jwt expired" || data.message == "jwt malformed" || data.message == "user not found"
                ) {
                    useRoute.push("/Login")
                } else {
                    console.log(data)
                    setMessage(data.message)
                }
            } else {
                setresult({ ...data, status: data.isSuccess })
                handleSubmit(3)
            }
        }).finally(() => {
            setLoading(false)
        })

    }


    const handlePrevious = () => {

    }

    return (
        <React.Fragment>
            <section id={Styles.Container}>
                <section id={Styles.ContainerMain}>
                    {/* <main></main> */}
                    <main className="d-flex " style={{ justifyContent: "space-between" }}>
                        <span onClick={handlePrevious} >{states !== 1 && (<HiOutlineArrowLeft />)}</span>

                        <h2>
                            {DepWith}
                        </h2>
                        <button id={Styles.Closebtn} onClick={() => setDepWith("")} className="btn" > <GrClose /></button>
                    </main>

                    {
                        !!Message && (<div className="alert alert-danger text-danger text-center">{Message}</div>)
                    }
                    {
                        states == 1 && (
                            <FirstComponent DepWith={DepWith} submit={handleSubmit} />
                        )
                    }
                    {
                        states == 2 && (
                            <ForthComponent Message={Message} submit={Submit} />
                        )
                    }
                    {
                        states == 3 && (
                            <SeventhComponet result={result} handleSubmit={handleSubmit} leave={setDepWith} />
                        )
                    }
                </section>
            </section>
            {isLoading && (<Loading index={2111111111111111} />)}
            <ToastContainer />
        </React.Fragment>
    )
}
export default WithAndDep

const FirstComponent = ({ submit, DepWith }: any) => {
    const formik = useFormik({
        initialValues: {
            amount: "",
        },
        onSubmit: (values: any) => {
            submit(2, values)
        },
        validationSchema: yup.object({
            amount: yup.number().required().min(10).max(10000),
        })
    })
    return (
        <React.Fragment>
            <form onSubmit={formik.handleSubmit}>
                <div id={Styles.DirectElement} >
                    <label>Amount To {DepWith}</label>
                    <input
                        type="number"
                        value={formik.values.amount}
                        name="amount"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={
                            formik.touched.amount
                                ? formik.errors.amount
                                    ? "form-control  text-center is-invalid"
                                    : "form-control text-center  is-valid"
                                : "form-control text-center "
                        }
                        placeholder="N10 - N10000" />

                    {formik.errors.amount && <div className="alert alert-danger text-danger text-center">
                        {
                            formik.errors.amount
                        }
                    </div>}
                </div>
                <div id={Styles.DirectElement}>
                    <button className="btn mt-5" id={Styles.Button} disabled={!(formik.isValid && formik.dirty)} type="submit" >{DepWith}</button>
                </div>
            </form>

        </React.Fragment>
    )
}


const ForthComponent = ({ submit, Message }: any) => {
    const formik = useFormik({
        initialValues: {
            password: "",
        },
        onSubmit: (values: any) => {
            submit(values)
        },
        validationSchema: yup.object({
            password: yup.string().required(),
        })
    })
    return (
        <React.Fragment>
            <form onSubmit={formik.handleSubmit} id={Styles.ThirdComponent}>
                <label>Your password</label>
                <input type="text" name="password" onChange={formik.handleChange} onBlur={formik.handleBlur} className={
                    formik.touched.password
                        ? formik.errors.password
                            ? "form-control is-invalid my-2"
                            : "form-control is-valid my-2"
                        : "form-control my-2"
                }
                    id={Styles.PasswordInput}
                    placeholder="*******" />
                <button className="btn my-3" id={Styles.Button} type="submit" disabled={!(formik.isValid && formik.dirty)}>Next</button>
            </form>


        </React.Fragment>
    )
}



const SeventhComponet = ({ result, handleSubmit, leave }: any) => {
    return (
        <React.Fragment>
            <section id={Styles.Seventhcomponent}>
                <div id={Styles.SeventhcomponentFirstsection} >
                    <p style={result.status ? { border: "5px solid rgb(57, 240, 57)", color: "rgb(57, 240, 57)" } : { border: "5px solid rgb(241, 51, 37)", color: "rgb(241, 51, 37)" }}>
                        {
                            result.status ? <ImCheckmark /> : <ImCross />
                        }

                    </p>

                </div>
                <div id={Styles.SeventhcomponentSecondsection}>
                    <p>
                        <span>{result.id.substring(0, 10)}:</span>
                        <span>{result.message}</span>
                    </p>
                </div>
                <div id={Styles.SeventhcomponentThirdsection}>
                    <button className="btn " onClick={() => leave("")}>leave</button>
                    <button className="btn " id={Styles.SeventhcomponentThirdsectiondynamic} onClick={() => handleSubmit(1)}>Try again</button>
                </div>
            </section>
        </React.Fragment>
    )
}

