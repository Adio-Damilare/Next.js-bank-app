import React, { useState } from "react";
import Link from "next/link";
import Style from "../styles/Navbar.module.css";
import { VscMenu } from "react-icons/vsc";
import { GrClose } from "react-icons/gr";

const Navbar = () => {
  const [toggle, setToggle] = useState<boolean>(false);
  return (
    <>
      <div id={Style.container} className="border">
        <nav className=" " id={Style.navbar}>
          <Link className="" id={Style.logo} href="/">
            DARUZ
          </Link>
          <div id={Style.ButtonForTogglediv}>
            <button
              className="btn "
              onClick={(e: any) => setToggle(!toggle)}
              id={Style.ButtonForToggle}
            >
              {toggle ? <GrClose /> : <VscMenu />}
            </button>
          </div>
          {toggle && (
            <div id={Style.ToggleButton}>
              <div id={Style.PositionAbsolute}>
                <main>
                  <h3>Account</h3>
                  <div id={Style.SmallDeviceNav}>
                    <Link onClick={(e: any) => setToggle(false)} href="/Login">
                      Login
                    </Link>
                    <Link
                      onClick={(e: any) => setToggle(false)}
                      href="/Register"
                    >
                      Create a new account
                    </Link>
                  </div>
                    <Link
                      onClick={(e: any) => setToggle(false)}
                      href=""
                    >
                      About
                    </Link>
                </main>
              </div>
            </div>
          )}
          
          <div className="" id={Style.SecondSection}>
            <ul className="d-flex" id={Style.UnorderLIst}>
              <li className={Style.ShowHidden} id={Style.list}>
                <span className="dropdown" style={{cursor:"pointer"}} id={Style.Account}>
                  Account
                </span>
                <div className="" id={Style.Hidden}>
                  <Link className="d-block" href="/Register">
                    Create account
                  </Link>
                  <Link className="d-block" href="/Login">
                    Login
                  </Link>
                </div>
              </li>
              <li className="" id={Style.list}>
                <Link className="" href="/" id={Style.Account}>
                Agent
                </Link>
              </li>
              <li className="" id={Style.list}>
                <Link className="" href="/" id={Style.Account}>
                  Company
                </Link>
              </li>
              <li className="" id={Style.list}>
                <Link className="" href="#customersay" id={Style.Account}>
                  About
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Navbar;
