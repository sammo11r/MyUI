import React from "react";
import { NextComponentType, NextPageContext } from "next";
import type { AppProps } from "next/app";
import { SessionProvider, useSession } from "next-auth/react";
import { appWithTranslation } from "next-i18next";

import { AuthEnabledComponentConfig } from "../utils/auth.utils";
import "../styles/App.css";
import "../styles/globals.css";

type AppAuthProps = AppProps & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // eslint-disable-next-line max-len
  Component: NextComponentType<NextPageContext, any, {}> &
    Partial<AuthEnabledComponentConfig>;
};

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
    <SessionProvider session={session}>
      {Component.auth ? (
        <Auth>
          <Component {...pageProps} />
        </Auth>
      ) : (
        <Component {...pageProps} />
      )}
    </SessionProvider>
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

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return children;
}

export default appWithTranslation(MyApp);
