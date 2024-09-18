import React, { useEffect } from 'react';
import { StateProvider } from '@/redux/StateContext';
import '../styles/globals.css';
import Head from 'next/head';
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { useRouter } from 'next/router';

interface MyAppProps {
  Component: React.ComponentType;
  pageProps: Record<string, unknown>;
}

const MyApp: React.FC<MyAppProps> = ({ Component, pageProps }) => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const expire = localStorage.getItem("expire");
    if(!token || (expire && Date.now() > parseInt(expire, 10))) {
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
      {router.pathname !== '/admin' && <Footer />}
    </StateProvider>
  );
}

export default MyApp;