import React, { useEffect } from 'react';
import { StateProvider } from '@/redux/StateContext';
import '../styles/globals.css';
import Head from 'next/head';
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    const token = localStorage.getItem("token");
    const expire = localStorage.getItem("expire");
    if(!token || (expire && Date.now() > expire)) {
      localStorage.removeItem("token");
      localStorage.removeItem("expire");
    }
  }, []);

  return (
    <StateProvider>
      <Head>
        <title>AirZkare</title>
        <link rel="icon" href="/ZkareLogo.png" />
      </Head>
      <Toaster />
      <Navbar />
      <Component {...pageProps} />
      <Footer />
    </StateProvider>
  );
}

export default MyApp;