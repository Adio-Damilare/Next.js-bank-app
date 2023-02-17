import React from "react";
import Style from "../styles/DashTopNavbar.module.css";
import { FiSettings } from "react-icons/fi";
import { VscMenu, VscBellDot } from "react-icons/vsc";
import { GrClose } from "react-icons/gr";
import Image from "next/image";
import one from "./image.png";
import Link from "next/link";


const DashTopNavbar = ({ navState, navStateF, firstName, userName,index }: any) => {

  return (
    <main id={Style.MainContainer}  >
      <div id={Style.FirstSection}>
        <div id={Style.FirstSectionImageSection}>
          <Image src={one} alt="hello" />
        </div>
        <div id={Style.FirstSectionNameSection}>
          <b>{userName ? userName : "firstname"}</b>
          <p>{firstName ? firstName : "username"}</p>
        </div>
      </div>
      <div id={Style.Secondsection}>
        <input type="search" placeholder="search..." className="form-control" />
        <button>
          <Link href="/Dashboard/Notifications">
            <VscBellDot />
          </Link>
        </button>
        <button id={Style.SeperateIcon} style={navState ? { position: "fixed" } : { position: "static" }} onClick={() => navStateF(!navState)}>
          {navState ? <GrClose /> : <VscMenu />}

        </button>
      </div>
    </main>
  );
};

export default DashTopNavbar;
