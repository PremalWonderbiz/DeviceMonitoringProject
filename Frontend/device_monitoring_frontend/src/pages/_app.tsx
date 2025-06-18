import { Provider } from "@/components/ui/provider";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import "@/styles/scss/utilities.scss";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider>
      <Component {...pageProps} />
    </Provider>
  );
}
