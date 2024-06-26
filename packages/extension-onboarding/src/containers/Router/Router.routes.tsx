import { EPathsV2 } from "@extension-onboarding/containers/Router/Router.pathsV2";
import AuthFlowLayout from "@extension-onboarding/layouts/AutFlowLayout";
import DataDashBoardLayout from "@extension-onboarding/layouts/DataDashboardLayout";
import Onboarding from "@extension-onboarding/pages/Onboarding";
import CookieVault from "@extension-onboarding/pages/V2/CookieVault";
import Home from "@extension-onboarding/pages/V2/Home";
import Offers from "@extension-onboarding/pages/V2/Offers";
import TrustedBrands from "@extension-onboarding/pages/V2/TrustedBrands";
import React, { lazy, Suspense } from "react";
import { Navigate, Route } from "react-router-dom";
const LazyTransactions = lazy(
  () => import("@extension-onboarding/pages/V2/Transactions"),
);
const LazyAirdrops = lazy(
  () => import("@extension-onboarding/pages/V2/Airdrops"),
);
const LazyTokens = lazy(
  () => import("@extension-onboarding/pages/Details/screens/Tokens"),
);
const LazyNFTs = lazy(
  () => import("@extension-onboarding/pages/Details/screens/NFTs"),
);
const LazyPoapNFTs = lazy(
  () => import("@extension-onboarding/pages/Details/screens/PoapNFTs"),
);
const LazyBrowserActivity = lazy(
  () => import("@extension-onboarding/pages/Details/screens/BrowserActivity"),
);
const LazySocialMediaInfo = lazy(
  () => import("@extension-onboarding/pages/V2/SocialMediaInfo"),
);
const LazySettings = lazy(
  () => import("@extension-onboarding/pages/V2/Settings"),
);

export const OnboardingRoutes = (
  <Route>
    <Route path={EPathsV2.ONBOARDING} element={<Onboarding />} />
    <Route path="*" element={<Navigate replace to={EPathsV2.ONBOARDING} />} />
  </Route>
);

export const AuthFlowRoutes = (
  <Route>
    <Route element={<AuthFlowLayout />}>
      <Route path={EPathsV2.HOME} element={<Home />} />
      <Route path={EPathsV2.COOKIE_VAULT} element={<CookieVault />} />
      <Route path={EPathsV2.TRUSTED_BRANDS} element={<TrustedBrands />} />
      <Route path={EPathsV2.OFFERS} element={<Offers />} />
      <Route
        path={EPathsV2.SETTINGS}
        element={
          <Suspense fallback={null}>
            <LazySettings />
          </Suspense>
        }
      />
      <Route element={<DataDashBoardLayout />}>
        <Route
          path={EPathsV2.TRANSACTION_HISTORY}
          element={
            <Suspense fallback={null}>
              <LazyTransactions />
            </Suspense>
          }
        />
        <Route
          path={EPathsV2.AIRDROPS}
          element={
            <Suspense fallback={null}>
              <LazyAirdrops />
            </Suspense>
          }
        />
        <Route
          path={EPathsV2.TOKENS}
          element={
            <Suspense fallback={null}>
              <LazyTokens />
            </Suspense>
          }
        />
        <Route
          path={EPathsV2.NFTS}
          element={
            <Suspense fallback={null}>
              <LazyNFTs />
            </Suspense>
          }
        />
        <Route
          path={EPathsV2.POAP_NFTS}
          element={
            <Suspense fallback={null}>
              <LazyPoapNFTs />
            </Suspense>
          }
        />
        <Route
          path={EPathsV2.BROWSER_ACTIVITY}
          element={
            <Suspense fallback={null}>
              <LazyBrowserActivity />
            </Suspense>
          }
        />

        <Route
          path={EPathsV2.SOCIAL_MEDIA_DATA}
          element={
            <Suspense fallback={null}>
              <LazySocialMediaInfo />
            </Suspense>
          }
        />
      </Route>
    </Route>
    <Route path="*" element={<Navigate replace to={EPathsV2.HOME} />} />
  </Route>
);
