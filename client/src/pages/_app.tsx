import React, { useEffect } from 'react';
import '../styles/globals.css';
import Head from 'next/head';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import { useRouter } from 'next/router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useStore } from '@/store/useStore';

interface MyAppProps {
  Component: React.ComponentType;
  pageProps: Record<string, unknown>;
}

const queryClient = new QueryClient();

const MyApp: React.FC<MyAppProps> = ({ Component, pageProps }) => {
  const router = useRouter();
  
  const initializeAuth = useStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <QueryClientProvider client={queryClient}>
      <Head>
        <title>AirZkare</title>
        <link rel="icon" href="/ZkareLogo.png" />
      </Head>
      <Toaster />
      <Navbar />
      <Component {...pageProps} />
      {router.pathname !== '/admin' && <Footer />}
    </QueryClientProvider>
  );
};

export default MyApp;
