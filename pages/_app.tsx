import "../styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/js/bootstrap.bundle"
import type { AppProps } from "next/app";
import Navbar from "../Component/Navbar";
import Head from "next/head";
// import { Html} from 'next/document'
import Script from "next/script";
import { Provider } from "react-redux";
import Store from ".././Redux/Store";

export default function App({ Component, pageProps }: any) {
  const Seperate = !!Component.getLayout;
  
    return (
      <>
        <Provider store={Store}>
          {Seperate ? (
            <Component {...pageProps} />
          ) : (
            <>
              <Script
                src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"
                integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4"
                crossOrigin="anonymous"
              ></Script>
              <Head>
                <title>General page</title>
              </Head>
              <Navbar />
              <Component {...pageProps} />
            </>
          )}
        </Provider>
      </>
    );

}
