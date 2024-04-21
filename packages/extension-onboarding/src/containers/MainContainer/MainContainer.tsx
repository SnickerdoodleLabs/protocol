import { AccountLinkingContextProvider } from "@extension-onboarding/context/AccountLinkingContext";
import { AnalyticsContextProvider } from "@extension-onboarding/context/AnalyticsContext";
import { AppContextProvider } from "@extension-onboarding/context/App";
import { DataWalletContextProvider } from "@extension-onboarding/context/DataWalletContext";
import { LayoutProvider } from "@extension-onboarding/context/LayoutContext";
import { NotificationContextProvider } from "@extension-onboarding/context/NotificationContext";
import { ThemeContextProvider } from "@extension-onboarding/context/ThemeContext";
import { ISdlDataWallet } from "@snickerdoodlelabs/objects";
import React, { Suspense, lazy } from "react";

const LazyRouter = lazy(
  () => import("@extension-onboarding/containers/Router"),
);

interface IMainContainerProps {
  proxy?: ISdlDataWallet;
}

const MainContainer: React.FC<IMainContainerProps> = ({ proxy }) => {
  return (
    <ThemeContextProvider>
      <AnalyticsContextProvider disabled={!!proxy}>
        <DataWalletContextProvider proxy={proxy}>
          <NotificationContextProvider>
            <AppContextProvider>
              <LayoutProvider>
                <AccountLinkingContextProvider>
                  <Suspense fallback={null}>
                    <LazyRouter />
                  </Suspense>
                </AccountLinkingContextProvider>
              </LayoutProvider>
            </AppContextProvider>
          </NotificationContextProvider>
        </DataWalletContextProvider>
      </AnalyticsContextProvider>
    </ThemeContextProvider>
  );
};

export default MainContainer;
