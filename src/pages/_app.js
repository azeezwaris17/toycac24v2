import "@/styles/globals.css";
import Head from "next/head";

import { Provider } from "react-redux";
import store from "../redux/store";

export default function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Head>
        <title> TOYCAC&apos;24</title>
      </Head>
      <Component {...pageProps} />
    </Provider>
  );
}
