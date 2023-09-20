import "../app/globals.css";
import { AppProps } from "next/app";
import { NextUIProvider, Spinner } from "@nextui-org/react";
import { Suspense } from "react";
import Head from "next/head";
import { AuthProvider } from "../context/authContext"; // Import your authentication context

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Suspense fallback={<Spinner />}>
      <NextUIProvider>
        <AuthProvider> {/* Wrap your app in the AuthProvider */}
          <div>
            <Head>
              {/* Define metadata for the app */}
              <meta name="viewport" content="width=device-width, initial-scale=1" />
              <title>My movie plug</title>
              <link
                rel="icon"
                href="/icon.svg?<generated>"
              />
            </Head>
            <Component {...pageProps} />
          </div>
        </AuthProvider>
      </NextUIProvider>
    </Suspense>
  );
}
