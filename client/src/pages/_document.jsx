"use client";

import { Html, Head, Main, NextScript } from "next/document";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Toaster />
        <Navbar />
        <Main />
        <NextScript />
        <Footer />
      </body>
    </Html>
  );
}