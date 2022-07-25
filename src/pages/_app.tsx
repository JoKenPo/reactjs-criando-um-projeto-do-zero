import { AppProps } from 'next/app';
import { SessionProvider as NextAuthProvider } from "next-auth/react";

import '../styles/globals.scss';
import Header from '../components/Header';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <>
      {/* <NextAuthProvider session={pageProps.session}> */}
      <Header />
      <Component {...pageProps} />
      {/* </NextAuthProvider> */}
    </>
  );
}

export default MyApp;
