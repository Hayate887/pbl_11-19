import "@/styles/globals.css";
import { ChakraProvider } from '@chakra-ui/react';
import type { AppProps } from "next/app";
import { RecoilRoot } from "recoil";
import { SessionProvider } from "../../SessionProviders";
export default function App({ Component, pageProps }: AppProps) {
  return(
    <RecoilRoot>
      <SessionProvider>
        <ChakraProvider>
          <Component {...pageProps} />
        </ChakraProvider>
      </SessionProvider>
    </RecoilRoot>
    )
}

