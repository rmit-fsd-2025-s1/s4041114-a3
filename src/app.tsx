import "@/styles/globals.css";
import type { AppProps } from "next/app";
import * as React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import theme from '../styles/colorTheme';
// import Navbar from "@/components/layout/NarBar";
import { AuthProvider } from "../context/authContext";
export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <ChakraProvider resetCSS={false} theme={theme}> 
          <Component {...pageProps} />   
      </ChakraProvider>
    </AuthProvider>
  );
}
