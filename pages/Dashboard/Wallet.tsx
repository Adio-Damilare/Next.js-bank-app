import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head"
import { useCookies } from "react-cookie";
import DashNavbar from "../../Component/DashNavbar";
import DashTopNavbar from "../../Component/DashTopNavbar";
import Styles from "/styles/Dash.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "../../Component/Loading";
import useFetchCurrentUser from "../../Customhook/useFetchCurrentUser";
import useFetcherNotification from "../../Customhook/useFetcherNotification";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";


const Wallet = (props: any) => {
  const useRoute = useRouter();
  const [navState, setNavState] = useState<Boolean>(false);
  const [open, setopen] = useState<Boolean>(true);
  const [currentUser, errorState] = useFetchCurrentUser();
  const [] = useFetcherNotification()

  return (
    <React.Fragment>
      <Head>
        <title> Transactions </title>
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
              active={"Balance"}
              index={3333333333}
              userName={currentUser?.username} />
          </div>
          {navState && (
            <div id={Styles.SecondDahNavbar}>
              <DashNavbar
                active={"Balance"}
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
              <section id={Styles.Balance}>
                <strong>
                  Balance :
                  <p>
                    <span>N</span>
                    {currentUser ? open ?
                      currentUser.accountbalance : `${currentUser.accountbalance}`.split("").map((item) => (<>x</>)) :
                      "0.00"}
                    <button onClick={() => setopen(!open)} style={{ border: "none", padding: "0 10px", borderRadius: "20px", cursor: "pointer" }}>
                      {
                        open ? <AiOutlineEyeInvisible /> : <AiOutlineEye />
                      }
                    </button>
                  </p>
                </strong>
                </section >
              </section>
          </main>
        </div>
      }
      <ToastContainer />
    </React.Fragment>
  );
};

export default Wallet;
Wallet.getLayout = (page: any) => {
  return <>{page}</>;
};
export const getServerProps = (context: any) => {
  console.log(context)
  return {
    props: {
      context
    }
  }
}