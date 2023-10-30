import { EPathsV2 } from "@extension-onboarding/containers/Router/Router.pathsV2";
import AuthFlowLayout from "@extension-onboarding/layouts/AutFlowLayout";
import DataDashBoardLayout from "@extension-onboarding/layouts/DataDashboardLayout";
import BrowserActivity from "@extension-onboarding/pages/Details/screens/BrowserActivity";
import NFTDetails from "@extension-onboarding/pages/Details/screens/NFTDetails";
import NFTs from "@extension-onboarding/pages/Details/screens/NFTs";
import PoapNFTs from "@extension-onboarding/pages/Details/screens/PoapNFTs";
import Tokens from "@extension-onboarding/pages/Details/screens/Tokens";
// v2 pages
import AudienceDetails from "@extension-onboarding/pages/V2/AudienceDetails";
import DataPermissions from "@extension-onboarding/pages/V2/DataPermissions";
import Settings from "@extension-onboarding/pages/V2/Settings";
import SocialMediaInfo from "@extension-onboarding/pages/V2/SocialMediaInfo";
import Transactions from "@extension-onboarding/pages/V2/Transactions";
import React from "react";
import { Route } from "react-router-dom";
export const AuthFlowRoutes = (
  <Route element={<AuthFlowLayout />}>
    <Route path={EPathsV2.DATA_PERMISSIONS} element={<DataPermissions />} />
    <Route path={EPathsV2.SETTINGS} element={<Settings />} />
    <Route
      path={EPathsV2.DATA_PERMISSIONS_AUDIENCE}
      element={<AudienceDetails />}
    />
    <Route element={<DataDashBoardLayout />}>
      <Route path={EPathsV2.TRANSACTION_HISTORY} element={<Transactions />} />
      <Route path={EPathsV2.TOKENS} element={<Tokens />} />
      <Route path={EPathsV2.NFTS} element={<NFTs />} />
      <Route path={EPathsV2.POAP_NFTS} element={<PoapNFTs />} />
      <Route path={EPathsV2.BROWSER_ACTIVITY} element={<BrowserActivity />} />
      <Route path={EPathsV2.SOCIAL_MEDIA_DATA} element={<SocialMediaInfo />} />
      <Route path={EPathsV2.NFT_DETAIL} element={<NFTDetails />} />
    </Route>
  </Route>
);
