import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head"
import { useCookies } from "react-cookie";
import useSwr from "swr";
import axios from "axios";
import DashNavbar from "../../Component/DashNavbar";
import DashTopNavbar from "../../Component/DashTopNavbar";
import TransactToBank from "../../Component/TransactToBank";
import Styles from "/styles/Dash.module.css";
import { CiBank } from "react-icons/ci";
import { AiFillBank, AiFillShop, AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { RiBillFill } from "react-icons/ri";
import { TbArrowsDownUp } from "react-icons/tb";
import { IoIosFootball } from "react-icons/io";
import { FaPhoneSquareAlt } from "react-icons/fa";
import { SiPytorchlightning } from "react-icons/si";
import { FiMonitor } from "react-icons/fi";
import { BsCreditCard2FrontFill } from "react-icons/bs";
import { TbArrowsRightLeft } from "react-icons/tb";
import { ToastContainer, toast } from "react-toastify";
import WithAndDep from "../../Component/WithAndDep";
import "react-toastify/dist/ReactToastify.css";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  Tooltip,
  CartesianGrid,
  YAxis,
  XAxis,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../Component/Loading";
import  useFetchCurrentUser from "../../Customhook/useFetchCurrentUser";
import useDashboardDetails  from "../../Customhook/useDashboardDetails2";
import useFetcherNotification from "../../Customhook/useFetcherNotification";


const DashBoard = (props: any) => {
  const [transfer, setTransfer] = useState<string>("")
  const [navState, setNavState] = useState<Boolean>(false);
  const [active,] = useState<any>();
  const [allSButton,] = useState<any>([
    {
      icon: <AiFillShop />,
      text: "Deposit"
    },
    {
      icon: <TbArrowsDownUp />,
      text: "Data bundle"
    },
    {
      icon: <FaPhoneSquareAlt />,
      text: "Airtime"
    },
    {
      icon: <IoIosFootball />,
      text: "Betting"
    },
    {
      icon: <SiPytorchlightning />,
      text: "Electricity"
    },
    {
      icon: <FiMonitor />,
      text: "Tv"
    },
    {
      icon: <BsCreditCard2FrontFill />,
      text: "Credit"
    },
    {
      icon: <AiFillShop />,
      text: "Withdraw"
    },
    {
      icon: <TbArrowsRightLeft />,
      text: "Send money"
    },
  ]);
  const [open, setOpen] = useState(true)

  const [allTButton,] = useState<any>([
    {
      icon: <CiBank />,
      text: "To Bank",
    },
    {
      icon: <AiFillBank />,
      text: "To Daruz",
    },
    {
      icon: <RiBillFill />,
      text: "Withdraw",
    },
    {
      icon: <AiFillShop />,
      text: "Deposit",
    },
  ])
  const [DepWith, setDepWith] = useState<string>("")
  const [currentUser, errorState] =useFetchCurrentUser();
  const useRoute = useRouter();
  const [user, error] = useDashboardDetails();
  const [] = useFetcherNotification()

  return (
    <React.Fragment>
      <Head>
        <title> Dashboard </title>
      </Head>
      {
        errorState && <>Error occured try to refresh </>
      }
      {!currentUser && <Loading />}
      {
        currentUser &&
        <div id={Styles.MainComponent}>
          <div id={Styles.DahNavbar}>
            <DashNavbar
              active={"Dashboard"}
              index={3333333333}
              userName={currentUser?.username} />
          </div>
          {navState && (
            <div id={Styles.SecondDahNavbar}>
              <DashNavbar
                active={"Dashboard"}
                userName={currentUser?.username}
                navState={navState}
                index={3333333333}
                navStateF={setNavState}
              />
            </div>
          )}
          <main id={Styles.MainComponentMain}>
            <DashTopNavbar
              firstName={currentUser?.firstname}
              userName={currentUser?.username}
              navState={navState}
              index={3333333333}
              navStateF={setNavState}
            />
            <section id={Styles.Sections}>
              {!user && <Loading index={1333} Position="relative" />}
              {user && (
                <>
                  <section id={Styles.Balance}>
                    <strong>
                      Balance :
                      <p>
                        <span>N</span>
                        {user ? open ?
                          user.accountbalance : `${user.accountbalance}`.split("").map((item) => (<>x</>)) :
                          "0.00"}
                        <button onClick={() => setOpen(!open)} style={{ border: "none", padding: "0 10px", borderRadius: "20px",cursor:"pointer" }}>
                          {
                            open ? <AiOutlineEyeInvisible /> : <AiOutlineEye />
                          }
                        </button>
                      </p>
                    </strong>
                    <strong>
                      Account number
                      <span>
                        {user ? user.accountnumber : ""}
                      </span>
                    </strong>
                  </section>
                  <section id={Styles.MoneyTransfer}>
                    <p>Money Transfer</p>
                    <div>
                      {
                        allTButton.map((item: any, index: any) => (
                          <button key={index} className="btn" onClick={() => { [0, 1].includes(index) ? setTransfer(item.text) : setDepWith(item.text) }} id={
                            index == 0 ?
                              Styles.FirstBtn :
                              index == 1 ?
                                Styles.SecondBtn :
                                index == 2 ?
                                  Styles.ThirdBtn :
                                  Styles.ForthBtn}>
                            {item.icon}
                            <p>{item.text}</p>
                          </button>
                        ))
                      }
                    </div>
                  </section>
                  <section id={Styles.Services}>
                    <div id={Styles.serviceSecondChild}>
                      <p>Chart</p>
                      <Chart data={user?.monthlychart?.chart ? user.monthlychart?.chart : undefined} />
                    </div>
                    <div id={Styles.serviceFirstChild}>
                      <p>Services</p>
                      <div>
                        {allSButton.map((item: any, index: any) => (
                          <button className="btn" key={index}>
                            {item.icon}
                            <p>{item.text}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </section>
                </>
              )}
            </section>
          </main>
        </div>
      }


      {(transfer == "To Bank" || transfer == "To Daruz") &&
        <TransactToBank balance={user.accountbalance} setTransfer={setTransfer} isDaruz={transfer == "To Daruz" ? true : false} />}

      {(DepWith == "Withdraw" || DepWith == "Deposit") && <WithAndDep DepWith={DepWith} setDepWith={setDepWith} />}


      <ToastContainer />
    </React.Fragment>
  );
};

export default DashBoard;
DashBoard.getLayout = (page: any) => {
  return <>{page}</>;
};
export const getServerProps = (context: any) => {
  return {
    props: {
      context
    }
  }
}

const Chart = ({ data }: any) => {
  data = Object.entries(data).map(([key, value]: any) => {
    value = { ...value, name: key }
    return value
  });

  return (
    <>
      <div id={Styles.ChartContainer}>
        {
          data ?
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                width={730}
                height={250}
                data={data}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="deposit"
                  stroke="#8884d8"
                  fillOpacity={2}
                  fill="url(#colorUv)"
                />
                <Area
                  type="monotone"
                  dataKey="withdraw"
                  stroke="#82ca9d"
                  fillOpacity={2}
                  fill="url(#colorPv)"
                />
              </AreaChart>
            </ResponsiveContainer>
            : <div className="text-center ">No data plot the chart </div>}
      </div>
    </>
  );
};
