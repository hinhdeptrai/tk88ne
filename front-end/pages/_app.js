import NextSeoConfig from "@/configs/next-seo.config";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Analytics } from "@vercel/analytics/react";
import { SessionProvider } from "next-auth/react";
import { DefaultSeo } from "next-seo";
import "nprogress/nprogress.css";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "simplebar-react/dist/simplebar.min.css";

import RefreshTokenHandler from "../components/RefreshTokenHandler";
import ThemeLayout from "../components/ThemeLayout";
import SocketProvider from "../providers/SocketProvider";
import { store } from "../redux/reducers/store";
import "../styles/globals.css";
import "../styles/layout.scss";
import BackgroundMusic from '@/components/BackgroundMusic';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      cacheTime: Infinity,
    },
  },
});

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const [interval, setInterval] = useState(0);

  return (
    <>
      <SessionProvider session={session} refetchOnWindowFocus={false} refetchInterval={interval}>
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools initialIsOpen={false} />
          <Provider store={store}>
            <SocketProvider>
              <ThemeLayout>
                <DefaultSeo {...NextSeoConfig} />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <BackgroundMusic />
                  <Component {...pageProps} />
                </LocalizationProvider>
                <ToastContainer
                  position="top-center"
                  autoClose={5000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss={false}
                  draggable
                  pauseOnHover={false}
                />
                <Analytics />
              </ThemeLayout>
            </SocketProvider>
          </Provider>
        </QueryClientProvider>
        <RefreshTokenHandler setInterval={setInterval} />
      </SessionProvider>
    </>
  );
}

export default MyApp;
