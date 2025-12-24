import { Provider } from "@/components/ui/provider";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import "@/styles/scss/utilities.scss";
import 'rsuite/dist/rsuite-no-reset.min.css';
import { CustomProvider } from 'rsuite';
import { ApolloProvider } from "@apollo/client/react";
import { apolloClient } from "@/services/graphqlClient";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <CustomProvider>
      <Provider>
          <ApolloProvider client={apolloClient}>
            <Component {...pageProps} />
          </ApolloProvider>
      </Provider>
    </CustomProvider>
  );
}
