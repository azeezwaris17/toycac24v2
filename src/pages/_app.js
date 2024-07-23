// src/pages/_app.js
import "@/styles/globals.css";
import Head from "next/head";
import { useEffect } from "react";
import { Provider } from "react-redux";
import store from "../redux/store";

export default function MyApp({ Component, pageProps }) {
  useEffect(() => {
    window.__lc = window.__lc || {};
    window.__lc.license = 18313341; // Replace with your LiveChat license number
    (function(n, t, c) {
      function i(n) {
        return e._h ? e._h.apply(null, n) : e._q.push(n);
      }
      var e = {
        _q: [],
        _h: null,
        _v: "2.0",
        on: function() {
          i(["on", c.call(arguments)]);
        },
        once: function() {
          i(["once", c.call(arguments)]);
        },
        off: function() {
          i(["off", c.call(arguments)]);
        },
        get: function() {
          if (!e._h)
            throw new Error("[LiveChatWidget] You can't use getters before load.");
          return i(["get", c.call(arguments)]);
        },
        call: function() {
          i(["call", c.call(arguments)]);
        },
        init: function() {
          var n = t.createElement("script");
          n.async = !0;
          n.type = "text/javascript";
          n.src = "https://cdn.livechatinc.com/tracking.js";
          t.head.appendChild(n);
        },
      };
      !n.__lc.asyncInit && e.init(), (n.LiveChatWidget = n.LiveChatWidget || e);
    })(window, document, [].slice);
  }, []);

  return (
    <Provider store={store}>
      <Head>
        <title>TOYCAC&apos;24</title>
      </Head>
      <Component {...pageProps} />
    </Provider>
  );
}







// src/pages/_app.js
// import "@/styles/globals.css";
// import Head from "next/head";
// import Script from "next/script";
// import { Provider } from "react-redux";
// import store from "../redux/store";

// export default function MyApp({ Component, pageProps }) {
//   return (
//     <Provider store={store}>
//       <Head>
//         <title>TOYCAC&apos;24</title>
//       </Head>
//       <Script
//         id="livechat"
//         strategy="lazyOnload"
//         src="https://cdn.livechatinc.com/widget/script.js"
//         onLoad={() => {
//           window.LiveChatWidget.init({
//             license: "18313341",
//             group: 0,
//           });
//         }}
//       />
//       <Component {...pageProps} />
//     </Provider>
//   );
// }








