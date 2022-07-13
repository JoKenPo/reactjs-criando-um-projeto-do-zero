import { AppProps } from 'next/app';
import { SessionProvider as NextAuthProvider } from "next-auth/react";

import '../styles/globals.scss';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <NextAuthProvider session={pageProps.session}>
      <Component {...pageProps} />
    </NextAuthProvider>
  );
}

export default MyApp;
