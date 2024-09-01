import React from 'react';
import { StateProvider } from '@/redux/StateContext';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <StateProvider>
      <Component {...pageProps} />
    </StateProvider>
  );
}

export default MyApp;