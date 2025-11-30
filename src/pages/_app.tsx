// To switch back to cqw units, change the import below to:
// import "@/styles/globals.css";
import "@/styles/globals-rem.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
