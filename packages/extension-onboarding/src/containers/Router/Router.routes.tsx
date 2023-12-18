import React, { lazy, Suspense } from "react";
import { Route } from "react-router-dom";

import { EPathsV2 } from "@extension-onboarding/containers/Router/Router.pathsV2";
import AuthFlowLayout from "@extension-onboarding/layouts/AutFlowLayout";
import DataDashBoardLayout from "@extension-onboarding/layouts/DataDashboardLayout";
import DataPermissions from "@extension-onboarding/pages/V2/DataPermissions";

const LazyAudienceDetails = lazy(
  () => import("@extension-onboarding/pages/V2/AudienceDetails"),
);
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
const LazyShoppingData = lazy(
  () => import("@extension-onboarding/pages/V2/ShoppingData"),
);

export const AuthFlowRoutes = (
  <Route element={<AuthFlowLayout />}>
    <Route path={EPathsV2.DATA_PERMISSIONS} element={<DataPermissions />} />
    <Route
      path={EPathsV2.SETTINGS}
      element={
        <Suspense fallback={null}>
          <LazySettings />
        </Suspense>
      }
    />
    <Route
      path={EPathsV2.DATA_PERMISSIONS_AUDIENCE}
      element={
        <Suspense fallback={null}>
          <LazyAudienceDetails />
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

      <Route
        path={EPathsV2.SHOPPING_DATA}
        element={
          <Suspense fallback={null}>
            <LazyShoppingData />
          </Suspense>
        }
      />
    </Route>
  </Route>
);
