"use client";

import "@/styles/globals.css";
import { StateProvider } from "@/redux/StateContext";
import { initialState, reducer } from "@/redux/StateReducers";
import Head from "next/head";

export default function App({ Component, pageProps }) {
  return (
    <StateProvider initialState={initialState} reducer={reducer}>
      <Head>
        <title>AirZkare</title>
        <link rel="shortcut icon" href="/ZkareLogo.png" type="image/x-icon" />
      </Head>
      <Component {...pageProps} />
    </StateProvider>
  ) 
}