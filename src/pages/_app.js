// src/pages/_app.js
import "@/styles/globals.css";
import Head from "next/head";
import Script from "next/script";
import { Provider } from "react-redux";
import store from "../redux/store";

export default function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Head>
        <title>TOYCAC&apos;24</title>
      </Head>
      <Script
        id="livechat"
        strategy="lazyOnload"
        src="https://cdn.livechatinc.com/widget/script.js"
        onLoad={() => {
          window.LiveChatWidget.init({
            license: "your_license_number",
            group: 0,
          });
        }}
      />
      <Component {...pageProps} />
    </Provider>
  );
}
