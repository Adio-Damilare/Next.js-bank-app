import React from 'react'
import Style from "../styles/DashNavBar.module.css"
import Image from 'next/image'
import one from "./image.png"
import { BiMenuAltLeft } from "react-icons/bi"
import { HiHome } from "react-icons/hi"
import { MdAnalytics } from "react-icons/md"
import { GiWallet } from "react-icons/gi"
import { TbArrowsUpDown } from "react-icons/tb"
import { CgProfile } from "react-icons/cg"
import Link from 'next/link'
import { VscBellDot } from 'react-icons/vsc'
const DashNavbar = ({ navState, navStateF, userName, active,index }: any) => {
    let detail = [
    {
        icon: <HiHome />,
        link: "/Dashboard",
        text: "Dashboard",
    },
    {
        icon: <GiWallet />,
        link: "/Dashboard/Wallet",
        text: "Balance",
    },
    {
        icon: <TbArrowsUpDown />,
        link: "/Dashboard/Transaction",
        text: "Transaction",
    },
    {
        icon: <VscBellDot  />,
        link: "/Dashboard/Notifications",
        text: "Notifications",
    },
    {
        icon: <CgProfile />,
        link: "/Dashboard/Profile",
        text: "Profile",
    },
    ]
    const PostionClick = () => {
        if (navState != undefined) {
            navStateF(false)
        }
    }


    return (<>
        <div id={Style.Position} style={index?{zIndex:index}:{}} onClick={PostionClick}>
            <div className='' id={Style.container}>
                <section id={Style.firstSection}>
                    <div>
                        DARUZ
                    </div>
                    <div id={Style.firstSectionSecondChild}>
                        <Image src={one} alt="helo" width={300} height={300} />
                        <div>
                            <article>Welcome back</article>
                            <h2><b>{userName && userName}</b></h2>
                        </div>
                    </div>
                </section>
                <hr />
                <section id={Style.Secondsection}>
                    <div id={Style.SecondSectionFirstElement} >
                        {
                            detail.map((item, index) => (
                                <main key={index}>
                                    <Link href={item.link} id={active == item.text ? Style.Cup : ""}>
                                        {item.icon}
                                        <article>
                                            {
                                                item.text
                                            }
                                        </article>
                                    </Link>
                                </main>
                            ))
                        }
                    </div>
                </section>
            </div>
        </div>
    </>
    )
}

export default DashNavbar