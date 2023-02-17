import React, { useState } from "react"
import Styles from "../styles/TransactToBank.module.css";
import { AllBanks } from "./Allbank"
import { useFormik } from "formik";
import * as yup from "yup";
import { GrStatusWarning } from "react-icons/gr"
import { HiOutlineArrowLeft } from "react-icons/hi"
import Loading from "./Loading";
import { GrClose } from "react-icons/gr"
import axios from "axios";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaSearch } from "react-icons/fa"
import one from "./image.png"
import Image from "next/image"
import next from "next";
import { ImCross, ImCheckmark, } from "react-icons/im"
import { useCookies } from "react-cookie";

const Option = () => {
    return (
        <>
            {AllBanks.map((bank, index) => (
                <option className=" my-2" key={index}>
                    {bank.name}

                </option>
            ))}
        </>
    )
}
const TransactionToBank = ({ setTransfer, isDaruz, balance }: any) => {
    const [cookies, , removeCookies] = useCookies();
    let token = cookies?.userToken ? cookies?.userToken : "";
    const useRoute = useRouter()
    const [states, setStates] = useState<number>(1)
    const [isLoading, setLoading] = useState<boolean>(false)
    const [details, setDetails] = useState<any>({
    })
    const [previous, setprevious] = useState<any>([])
    const [cTU, setCTU] = useState<any>({})
    const [userNFM, setuserNFM] = useState<any>("")
    const [resultmessage, setresultmessage] = useState<any>({
    })
    const [errormsg, seterrormsg] = useState<any>("")


    const handleSubmit = (numberTo: { next: number, previous?: number }, values: any = false) => {
        let index = 1;
        setLoading(true);
        let interval = setInterval(() => {
            if (index == 5) {
                index = 1;
                clearInterval(interval);
                setLoading(false);
                if (values) {

                    numberTo.next == 6 ? setCTU(values) :
                        setDetails((prev: any) => {
                            return { ...prev, ...values };
                        });
                }
                setStates(numberTo.next);
                if (numberTo.previous) {
                    setprevious((val: any) => [...val, numberTo.previous])
                }
            } else {
                index++;
                setLoading(true);
            }
        }, 200)

    }

    const handlePrevious = () => {
        let pre: number = previous[previous.length - 1]
        setprevious(previous.splice(pre, 1))
        handleSubmit({ next: pre, })

    }


    const Transfer = async (value: any) => {
        setLoading(true)
        axios.post("/api/Dashboard/TransferToBank", { ...details, ...value, token, isDaruz }).then((data: any) => {
            console.log(data)
            if (data.data.message && !data.data.status) {
                if (
                    data.message == "invalid token" ||
                    data.message == "jwt expired" || data.message == "jwt malformed" || data.message == "user not found"
                ) {
                    removeCookies("userToken")
                    return useRoute.replace("Login");
                } else {
                    seterrormsg(data.data.message)
                    toast.error("Connection error", {
                        position: toast.POSITION.BOTTOM_RIGHT,
                    })
                }
            } else {
                setresultmessage({ ...data.data, status: data.data.isSuccess })
                setStates(7)
            }
            setLoading(false)
        })
    }

    return (
        <React.Fragment>
            <section id={Styles.Container}>
                <section id={Styles.ContainerMain}>
                    <main>
                        <main className="d-flex " style={{ justifyContent: "space-between" }}>
                            <span onClick={handlePrevious} >{states !== 1 && (<HiOutlineArrowLeft />)}</span>

                            <h2 className="text-center">Transfer to  {isDaruz ? "Daruz" : "Bank"}</h2>

                            <button id={Styles.Closebtn} onClick={() => setTransfer("")} className="btn" > <GrClose /></button>
                        </main>
                        {userNFM && states == 1 && <p className="alert alert-danger text-danger text-center">{userNFM}</p>}
                    </main>
                    {
                        states == 1 && (
                            <FirstComponent isDaruz={isDaruz} submit={handleSubmit} setLoading={setLoading} setCTU={setCTU} setuserNFM={setuserNFM} token={token} />
                        )
                    }
                    {
                        states == 2 && (
                            <SecondComponent details={details} submit={handleSubmit} balance={balance} />
                        )
                    }
                    {
                        states == 3 && (
                            <ThirdComponent details={details} submit={handleSubmit} />
                        )
                    }
                    {
                        states == 4 && (
                            <ForthComponent errormsg={errormsg} submit={Transfer} />
                        )
                    }
                    {
                        states == 5 && (<SearchUser setLoading={setLoading} handleSubmit={handleSubmit} token={token} />)
                    }
                    {
                        states == 6 && (<SixthComponent user={cTU} submit={handleSubmit} />)
                    }
                    {
                        states == 7 && (<SeventhComponet result={resultmessage} leave={setTransfer} handleSubmit={handleSubmit} />)
                    }
                </section>
            </section>
            {isLoading && (<Loading index={999999999999999} />)}
            <ToastContainer />
        </React.Fragment>
    )
}
export default TransactionToBank

const FirstComponent = ({ submit, isDaruz, setLoading, setCTU, setuserNFM, token }: any) => {
    const formik = useFormik({
        initialValues: {
            recipentAccount: "",
            bank: !isDaruz ? "" : "Daruz",
        },
        onSubmit: (values: any) => {
            if (isDaruz) {
                setLoading(true)
                axios.get("api/Dashboard/Find", { headers: { admin: "Oluwadamilare", data: JSON.stringify({ accountnumber: values.recipentAccount }), token } } as any).then((res) => {
                    setLoading(false)
                    if (res.data.status) {
                        if (res.data.user[0]) {
                            setCTU(res.data.user[0])
                            submit({ next: 6, previous: 1 })
                        } else {
                            setuserNFM("Invalid Account number")
                        }
                    } else {
                        toast.error(res.data.message, {
                            position: toast.POSITION.BOTTOM_RIGHT,
                        })
                    }
                })
            } else {

                submit({ next: 2, previous: 1 }, values)
            }
        },
        validationSchema: yup.object({
            recipentAccount: yup.number().required().test('len', 'Must be exactly 5 characters', (val: any) => val && val.toString().length === 10),
            bank: !isDaruz ? yup.string().required() : yup.string(),
        })
    })
    return (
        <React.Fragment>
            <form onSubmit={formik.handleSubmit}>
                <div id={Styles.DirectElement} >
                    <label>Recipient Account</label>
                    <input
                        type="number"
                        value={formik.values.recipentAccount}
                        name="recipentAccount"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={
                            formik.touched.recipentAccount
                                ? formik.errors.recipentAccount
                                    ? "form-control is-invalid"
                                    : "form-control is-valid"
                                : "form-control"
                        }
                        placeholder="Account number" />
                </div>
                {
                    isDaruz && <button onClick={() => submit({ next: 5, previous: 1 },)} className="btn mx-auto" id={Styles.searchForUser}><FaSearch /> Search for recipient</button>
                }



                {
                    !isDaruz ?
                        <div id={Styles.DirectElement}>
                            <label>Select Bank </label>
                            <select
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                name="bank"
                                className={
                                    formik.touched.bank
                                        ? formik.errors.bank
                                            ? "form-select is-invalid"
                                            : "form-select is-valid"
                                        : "form-select"
                                }
                                id={Styles.select}>
                                <Option />
                            </select>
                        </div> :
                        <div>

                        </div>
                }
                <div id={Styles.DirectElement}>
                    <button className="btn" id={Styles.Button} disabled={!(formik.isValid && formik.dirty)} type="submit" >Next</button>
                </div>
            </form>

        </React.Fragment>
    )
}

const SecondComponent = ({ submit, details, balance }: any) => {

    const [AddNote, setAddNote] = useState<boolean>(false)
    const formik = useFormik({
        initialValues: {
            amount: "",
            note: ""

        },
        onSubmit: (values: any) => {
            submit({ next: 3, previous: 2 }, values)
        },
        validationSchema: yup.object({
            amount: yup.number().required().min(10).max(20000),
            note: yup.string(),
        })
    })


    return (
        <React.Fragment>
            <form onSubmit={formik.handleSubmit}>
                <div id={Styles.BankDetails}>
                    <strong>{details.bank}</strong>
                    <b>To  <br /> {details.recipentAccount}</b>
                </div>

                <div id={Styles.DirectElement}>
                    <label>Amount to transfer</label>
                    <main className="input-group bg-light rounded">
                        {formik.values.amount && <span className="input-group-prepend mt-1">
                            <span id={Styles.LineThrough} className="input-group-text">N</span>
                        </span>}

                        <input name="amount" type="number"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            style={{ textAlign: "center" }}
                            className={
                                formik.touched.amount
                                    ? formik.errors.amount
                                        ? "form-control is-invalid"
                                        : "form-control is-valid"
                                    : "form-control"
                            }
                            placeholder="N10 - N20000" />
                    </main>
                </div>
                <strong className="text-center d-block text-light ">available balance <span id={Styles.LineThrough} >N</span>{balance}</strong>

                <div id={Styles.NotesSection}>


                    {!AddNote && <button className="btn btn-primary " onClick={() => setAddNote(true)}>Add note</button>}


                    {AddNote && <textarea style={{ resize: "none" }} id={Styles.TextArea} className={
                        formik.touched.note
                            ? formik.errors.note
                                ? "form-control is-invalid"
                                : "form-control is-valid"
                            : "form-control"
                    } placeholder="add short note"
                        name="note"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    >
                    </textarea>}
                </div>
                <div id={Styles.DirectElement}>
                    <button className="btn" id={Styles.Button} disabled={!(formik.isValid && formik.dirty)} type="submit" >Next</button>
                </div>
            </form>
        </React.Fragment>
    )
}


const ThirdComponent = ({ submit, details }: any) => {

    const HandleSubmit = () => submit({ next: 4, previous: 3 });
    return (
        <React.Fragment>
            <section id={Styles.ThirdComponent}>
                <article>Payment</article>
                <ul>
                    <li>
                        <span>Account Number</span><span>{details.recipentAccount}</span>
                    </li>
                    <li>
                        <span>Amount</span> <span> <span id={Styles.LineThrough} >N</span>{details.amount}</span>
                    </li>
                    <li>
                        <span>Recipient name</span> <span>{details.username ? details.username.length > 10 ? `${details.username.slice(0, 10)}...` : details.username : "null"} </span>
                    </li>
                    <li>
                        <span>Fees</span><span> <span id={Styles.LineThrough} >N</span>50</span>
                    </li>
                    <li>
                        <span>Bank</span><span> {details.bank.length > 22 ? `${details.bank.substring(0, 22)}...` : details.bank}</span>
                    </li>
                </ul>
                <button className="btn" id={Styles.Button} onClick={HandleSubmit}>Pay <span id={Styles.LineThrough} >N</span>{details.amount} </button>
            </section>


        </React.Fragment>
    )
}


const ForthComponent = ({ submit, details, errormsg }: any) => {
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
                {errormsg && <div className="alert alert-danger text-danger text-center">{errormsg}</div>}
                <label className="text-center">Your Transfer Pin</label>
                <input type="text" name="password" onChange={formik.handleChange} onBlur={formik.handleBlur} className={
                    formik.touched.password
                        ? formik.errors.password
                            ? "form-control is-invalid my-2"
                            : "form-control is-valid my-2"
                        : "form-control my-2"
                } placeholder="*******"
                    id={Styles.PasswordInput} />
                <button className="btn mt-4" id={Styles.Button} type="submit" disabled={!(formik.isValid && formik.dirty)}>Pay</button>
            </form>


        </React.Fragment>
    )
}



const SearchUser = ({ setLoading, handleSubmit, token }: any) => {
    const [allUser, setAlluser] = useState<any>([])
    const [dataName, setDataName] = useState<string>('accountnumber')

    const formik = useFormik({
        initialValues: {
            name: ""
        },
        onSubmit: (values: any) => {
            setLoading(true)
            let data: any = {};
            data[`${dataName}`] = values.name;
            let sendData: any = { headers: { admin: "Oluwadamilare", data: JSON.stringify(data), token } }

            axios.get<any>("api/Dashboard/Find", sendData).then((res) => {
                console.log(res)
                if (res.data.status) {
                    if (res.data.user[0]) {
                        setAlluser(res.data.user)
                    } else {
                        toast.error(<div>User not found</div>, {
                            position: toast.POSITION.BOTTOM_RIGHT,
                        })
                    }
                } else {
                    toast.error(res.data.message, {
                        position: toast.POSITION.BOTTOM_RIGHT,
                    })
                }
                setLoading(false)
            }).catch((error) => {
                toast.error(error.message, {
                    position: toast.POSITION.BOTTOM_RIGHT,
                })
                setLoading(false)
            })


        },
        validationSchema: yup.object({
            name: dataName == "username" ?
                yup.string().required().min(3,)
                : dataName == "email"
                    ? yup.string().email().required()
                    : yup.number().required().test('len', 'Must be exactly 5 characters', (val: any) => val && val.toString().length === 10)
        })
    })

    return (
        <React.Fragment>
            <form onSubmit={formik.handleSubmit} id={Styles.InputForSearch}>
                <input

                    type={
                        dataName == "accountnumber" ? "number" : "text"
                    }
                    className={
                        formik.touched.name
                            ? formik.errors.name
                                ? "form-control is-invalid py-3"
                                : "form-control is-valid py-3"
                            : "form-control py-3"
                    }
                    id=""
                    placeholder={`search recipient ${dataName}`}
                    name="name"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                <button className="btn" type="submit" disabled={!(formik.isValid && formik.dirty)}><FaSearch /> </button>
            </form>
            {allUser.length == 0 && <div id={Styles.MinimumHeight1} style={{ color: "#000" }}>
                <p id={Styles.searchParagraph}>Search recipient by</p>
                <button className="btn  btn-success" id={dataName == "email" ? Styles.searchButton : ""} onClick={() => setDataName("email")}>E-mail address</button>

                <button className="btn  btn-success" id={dataName == "accountnumber" ? Styles.searchButton : ""} onClick={() => setDataName("accountnumber")}>Account Number </button>

                <button className="btn mt-2 btn-success" id={dataName == "username" ? Styles.searchButton : ""} onClick={() => setDataName("username")}>Username </button>

            </div>}

            {allUser.length !== 0 && <div id={Styles.MinimumHeight}>
                {
                    allUser.map((user: any, index: number) => (
                        <div onClick={() => handleSubmit({ next: 6, previous: 5 }, user)} key={index}>
                            <SingleUser dataName={dataName} user={user} />
                        </div>
                    ))
                }

            </div>}
        </React.Fragment>
    )

}
const SingleUser = ({ user, dataName }: any) => {
    return (
        <>
            <div id={Styles.singleUser} >
                <main>
                    <Image src={user.profilepic ? user.profilepc : one} width={100} height={100} alt="hhhhh" />
                </main>
                <section>
                    <article id={dataName == "username" ? Styles.dataName : ""}>{user.username}</article>
                    <article id={dataName == "accountnumber" ? Styles.dataName : ""}>{user.accountnumber}</article>
                    <article id={dataName == "email" ? Styles.dataName : ""}>{user.email}</article>
                </section>
            </div>
        </>
    )
}


const SixthComponent = ({ user, submit }: any) => {
    return (
        <React.Fragment>
            <section id={Styles.SixthComponent}>
                <div>
                    <Image src={user.profilepic == "hello" ? one : user.profilepic} alt={user.username} />
                </div>
                <strong>{user?.firstname}</strong>
                <article>{user?.username}</article>
                <button className="btn" onClick={() => submit({ next: 2, previous: 6 }, { recipentAccount: user.accountnumber, bank: "Daruz", username: user.username })} id={Styles.Button}>Next</button>
            </section>
        </React.Fragment>
    )
}


const SeventhComponet = ({ result, handleSubmit, leave }: any) => {
    return (
        <React.Fragment>
            <section id={Styles.Seventhcomponent}>
                <div id={Styles.SeventhcomponentFirstsection} >
                    <p style={result.status ? { border: "5px solid rgb(57, 240, 57)", color: "rgb(57, 240, 57)" } : { border: "5px solid rgb(241, 51, 37)", color: "rgb(241, 51, 37)" }}>{
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
                    <button className="btn " id={Styles.SeventhcomponentThirdsectiondynamic} onClick={() => handleSubmit({ next: 1, previous: 1 })}>Try again</button>
                </div>
            </section>
        </React.Fragment>
    )
}











