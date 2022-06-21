import React from "react";
import { NextComponentType, NextPageContext } from "next";
import type { AppProps } from "next/app";
import { SessionProvider, useSession } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { appWithTranslation } from "next-i18next";
import { AuthEnabledComponentConfig } from "../utils/auth.utils";

import "../styles/AppHeader.css";
import "../styles/AppSider.css";
import "../styles/globals.css";
import "../styles/index.css";
import "../styles/StaticElement.css";
import "../node_modules/react-grid-layout/css/styles.css";
import "../node_modules/react-resizable/css/styles.css";
import Loader from "../components/Loader";

type AppAuthProps = AppProps & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // eslint-disable-next-line max-len
  Component: NextComponentType<NextPageContext, any, {}> &
    Partial<AuthEnabledComponentConfig>;
};

const queryClient = new QueryClient();

/**
 * @param {AppAuthProps} {
 *   Component,
 *   pageProps: { session, ...pageProps },
 * }
 * @return {*}
 */
function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppAuthProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>
        {Component.auth ? (
          <Auth>
            <Component {...pageProps} />
          </Auth>
        ) : (
          <Component {...pageProps} />
        )}
      </SessionProvider>
    </QueryClientProvider>
  );
}

type Props = {
  children: JSX.Element;
};

/**
 * @param {Props} { children }
 * @return {*}  {JSX.Element}
 */
function Auth({ children }: Props): JSX.Element {
  const { status } = useSession({ required: true });

  // If the session is still loading, display a loader
  if (status === "loading") {
    return (
      <div style={{ width: "100vw", height: "100vh" }}>
        <Loader />
      </div>
    );
  }

  return children;
}

export default appWithTranslation(MyApp);
