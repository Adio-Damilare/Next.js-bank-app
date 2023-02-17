import React, { useState, useEffect } from "react";
import Style from "/styles/Index.module.css";
import Image from "next/image";
import Head from "next/head";
import secondImage from "../assets/Payment.png";
import thirdImage from "../assets/BillPayment.png";
import googleStore from "../assets/googleStore.png";
import googleStoreImage from "../assets/googleStoreImage.png";
import PlayStore from "../assets/PlayStore.png";
import playStoreImage from "../assets/playStoreImage.png";
import Link from "next/link";
import testimony1 from "../assets/testimony/1.png";
import testimony2 from "../assets/testimony/2.png";
import testimony3 from "../assets/testimony/3.png";
import star from "../assets/testimony/star.png";
import facebook from "../assets/social media/facebook.png";
import instagram from "../assets/social media/instagram.png";
import twitter from "../assets/social media/twitter.png";
import telegram from "../assets/social media/telegram.png";
import Loading from "../Component/Loading";
const Home = () => {
  let ArrayOfGaP = [1, 3, 2];
  let ArrayOfTest = [1, 2, 3];
  let partners = [
   "https://res.cloudinary.com/daruz22/image/upload/v1676634199/fintechapp/20_bn2ewg.png",
    "https://res.cloudinary.com/daruz22/image/upload/v1676634277/fintechapp/19_q74ges.png",
    "https://res.cloudinary.com/daruz22/image/upload/v1676634337/fintechapp/18_vxmeud.png",
    "https://res.cloudinary.com/daruz22/image/upload/v1676635878/fintechapp/17_n6kwhs.png",
    "https://res.cloudinary.com/daruz22/image/upload/v1676635940/fintechapp/16_kpxkal.png",
    "https://res.cloudinary.com/daruz22/image/upload/v1676636022/fintechapp/15_uakscl.png",
    "https://res.cloudinary.com/daruz22/image/upload/v1676636338/fintechapp/14_vtdhnl.png",
    "https://res.cloudinary.com/daruz22/image/upload/v1676636379/fintechapp/13_qcucjd.png",
    "https://res.cloudinary.com/daruz22/image/upload/v1676636413/fintechapp/12_aix8ao.png",
    "https://res.cloudinary.com/daruz22/image/upload/v1676636462/fintechapp/11_kxsgdj.png",
    "https://res.cloudinary.com/daruz22/image/upload/v1676636496/fintechapp/10_wagtmt.png",
    "https://res.cloudinary.com/daruz22/image/upload/v1676636527/fintechapp/9_sv3fpe.png",
    "https://res.cloudinary.com/daruz22/image/upload/v1676640899/fintechapp/8_hrwmfw.png",
   "https://res.cloudinary.com/daruz22/image/upload/v1676640936/fintechapp/7_cj6oyn.png",
    "https://res.cloudinary.com/daruz22/image/upload/v1676640977/fintechapp/6_txdw6e.png",
    "https://res.cloudinary.com/daruz22/image/upload/v1676641001/fintechapp/5_p2dd1z.png",
    "https://res.cloudinary.com/daruz22/image/upload/v1676641029/fintechapp/4_gztzix.png",
    "https://res.cloudinary.com/daruz22/image/upload/v1676641062/fintechapp/3_ncy72i.png",
    "https://res.cloudinary.com/daruz22/image/upload/v1676641087/fintechapp/2_fvrhdp.png",
    "https://res.cloudinary.com/daruz22/image/upload/v1676641114/fintechapp/1_mxyhxm.png",
  ];

  partners = partners.reverse();
  const [isLoading, setIsloading] = useState<Boolean>(false);

  const LoadForAWhile = () => {
    let index = 1;
    setIsloading(true);
    let interval: any = setInterval(() => {
      if (index == 5) {
        setIsloading(false);
        clearInterval(interval);
      } else {
        index++;
        console.log("hello");
      }
    }, 100);
  };

  useEffect(() => {
    return LoadForAWhile();
  }, []);

  return (
    <>
      {isLoading && <Loading />}
      <Head>
        <title>Home</title>
      </Head>
      <div className="container-lg container-fluid-md">
        <div className={Style.firstSection}>
          <div id={Style.firstChild}>
            <h3>
              Digital <span>Finance</span> That <span>Fits Your Life</span>
            </h3>
            <article>
              An intuitive digital wallet with account opening, money transfer
              and bill payments in one. Earn as you spend.
            </article>
          </div>
          <div id={Style.secondChild}>
            <Image
              src={`https://res.cloudinary.com/daruz22/image/upload/v1676635201/fintechapp/card_bozvko.png`}
              width={"700"}
              height={"500"}
              alt="firstsectionImage"
              className={Style.firstSectionchildrensImage}
            />
          </div>
        </div>

        {/*  this is the second section  */}

        <div className={Style.SecondSection}>
          <div id={Style.SecondSectionFirstElement}>
            <Image src={secondImage} alt="SecondImage" />
          </div>
          <div id={Style.SecondSectionSecondElement}>
            <b>Enjoy Fast And Reliable Payments</b>
            <p>
              It’s fast and free to send money to any Daruz user or Nigerian
              bank account. And you can be assured of the reliability of our
              platform - 99% of our customers have voted us as the most reliable
              payment platform in Nigeria. .
            </p>
            <Link href="/">Learn More</Link>
          </div>
        </div>

        {/* this is the third section */}

        <div id={Style.ThirdSection}>
          <div id={Style.ThirdSectionFirstElement}>
            <h3>Get More For Your Money</h3>
            <p>
              Goodbye charges, hello rewards! With Daruz you save on fees and
              earn as you spend through discounts and cashback. Get the app now
              and make your money go further.
            </p>
            <button>Get Started</button>
          </div>
          <div id={Style.ThirdSectionSecondElement}>
            <Image src={thirdImage} alt="third image" />
          </div>
        </div>
      </div>

      {/* outSide of the container forth section */}
      <a id="customersay">
        <div id={Style.forthSection}>
          <h1>See what customers have to say</h1>
          <div id={Style.forthSectionTestimonies}>
            {ArrayOfGaP.map((item: any, index: number) => (
              <GoogleAndPlayStore key={index} object={item} />
            ))}
          </div>
          <div id={Style.forthSectionTestimonyOfUser}>
            {ArrayOfTest.map((item, index) => (
              <TestimonyOfUser item={item} key={index} />
            ))}
          </div>
          <div> inconcluductive section</div>
        </div>
      </a>
      <div className={Style.Partnercontainer}>
        <div id={Style.PathnersSection}>
          <h1>Our Partners</h1>
          <div id={Style.PathnersSectionChild}>
            {partners.map((item, index) => (
              <div
                className={
                  index == 3 ||
                  index == 4 ||
                  index == 10 ||
                  index == 19 ||
                  index == 20
                    ? Style.smallDeviceDn
                    : ""
                }
                key={index}
              >
                <Image src={item} alt={`imageOf${index}`} width={90} height={20} />
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;

const GoogleAndPlayStore = (props: any) => {
  if (props.object == 1 || props.object == 2) {
    return (
      <div id={Style.forthSectionTestimoniesSingle}>
        <Image
          src={props.object == 1 ? playStoreImage : googleStoreImage}
          alt="image1"
        />
        <div>
          <b>
            {props.object == 1 ? "4.6" : "4.1"}
            <span>/5 rating</span>
          </b>
        </div>
        <Image src={props.object == 1 ? PlayStore : googleStore} alt="image2" />
      </div>
    );
  }
  return <div id={Style.forthSectionTestimoniesSingleStand}></div>;
};

const TestimonyOfUser = (props: any) => {
  return (
    <div id={Style.forthSectionTestimonyOfUserFirstChild}>
      <div>
        <Image
          src={
            props.item == 1
              ? testimony1
              : props.item == 2
              ? testimony2
              : testimony3
          }
          alt="testimony2usee"
        />
        <div>
          <span>
            {props.item == 1
              ? `Sani Musa`
              : props.item == 2
              ? `
              Olori Mariam.
              `
              : `
              Eddy Edeki`}
          </span>
          <span id={Style.StarReaction}>
            <Image src={star} alt="" />
          </span>
        </div>
      </div>
      <p>
        {props.item == 1
          ? `I have never ever seen an online app that works smoothly without any hitches like Daruz`
          : props.item == 2
          ? `
              This app is amazing, they are never out of rewards, coupons for transactions.
              `
          : `
            This app called Daruz is an amazing app that I love to use daily unlike others that charge too much
            `}
      </p>
    </div>
  );
};

const Footer = () => {
  let Details = [1, 2, 3, 4, 5];
  let socialMedials = [facebook, instagram, twitter, telegram];
  return (
    <div id={Style.Footer}>
      <div id={Style.FooterFirstChild}>
        {Details.map((item: number, index: number) => (
          <div
            key={index}
            id={Style.SpecialDiv}
            className={index == 0 ? Style.SpecialDiv : ""}
          >
            <h5>
              {item == 1
                ? `Contact us`
                : item == 2
                ? `Personal`
                : item == 3
                ? `Agents`
                : item == 4
                ? `Company`
                : `Legal`}
            </h5>
            <p>
              {item == 1
                ? `Email:`
                : item == 2
                ? `Daruz App`
                : item == 3
                ? `POS`
                : item == 4
                ? `About Us`
                : `Privacy & Cookie Policy`}
            </p>
            <p>
              {item == 1
                ? `adiodamilare44@gmail.com`
                : item == 3
                ? `Apply Now`
                : item == 4
                ? `Career`
                : item == 5
                ? `Terms & Conditions`
                : ""}
            </p>
            <p>{item == 1 ? `Phone: 09039948312` : item == 4 ? `Blog` : ``}</p>
            <p>
              {item == 1 ? (
                <div id={Style.socialMedials}>
                  {socialMedials.map((item, index) => {
                    return (
                    
                        <span key={index}>
                          <Image src={item} alt="eeeeeeeeeeeeee" />
                        </span>
    
                    );
                  })}
                </div>
              ) : item == 4 ? (
                `Press`
              ) : (
                ``
              )}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
