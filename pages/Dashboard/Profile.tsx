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


const Profile = (props: any) => {
  const useRoute = useRouter();
  const [navState, setNavState] = useState<Boolean>(false);
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
              active={"Profile"}
              index={3333333333}
              userName={currentUser?.username} />
          </div>
          {navState && (
            <div id={Styles.SecondDahNavbar}>
              <DashNavbar
                active={"Profile"}
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

            </section>
          </main>
        </div>
      }
      <ToastContainer />
    </React.Fragment>
  );
};

export default Profile;
Profile.getLayout = (page: any) => {
  return <>{page}</>;
};
export const getServerProps = (context: any) => {
  console.log(context)
  return {
    props: {
      context:context
    }
  }
}