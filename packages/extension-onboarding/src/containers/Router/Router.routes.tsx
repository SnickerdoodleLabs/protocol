import Portfolio from "@extension-onboarding/components/Portfolio";
import { EPaths } from "@extension-onboarding/containers/Router/Router.paths";
import AuthFlowLayout from "@extension-onboarding/layouts/AutFlowLayout";
import OnboardingLayout from "@extension-onboarding/layouts/OnboardingLayout";
import ProductTourLayout from "@extension-onboarding/layouts/ProductTourLayout";
import CampaignsInfo from "@extension-onboarding/pages/Details/screens/CampaignsInfo";
import DataPermissionsSettings from "@extension-onboarding/pages/Details/screens/DataPermissionsSettings";
import EarnedRewards from "@extension-onboarding/pages/Details/screens/EarnedRewards";
import MarketPlaceCampaigns from "@extension-onboarding/pages/Details/screens/MarketplaceCampaigns";
import MarketplaceRewardsTemp from "@extension-onboarding/pages/Details/screens/MarketplaceRewardsTemp";
import OnChainIfo from "@extension-onboarding/pages/Details/screens/OnChainIfo";
import PersonalInfo from "@extension-onboarding/pages/Details/screens/PersonalInfo";
import ScamFilterSettings from "@extension-onboarding/pages/Details/screens/ScamFilterSettings";
import AccountLinking from "@extension-onboarding/pages/Onboarding/AccountLinking";
import OnboardingWelcome from "@extension-onboarding/pages/Onboarding/OnboardingWelcome";
import OptIn from "@extension-onboarding/pages/Onboarding/OptIn";
import ProfileCreation from "@extension-onboarding/pages/Onboarding/ProfileCreation";
import ViewData from "@extension-onboarding/pages/Onboarding/ViewData";
import BrowserActivity from "@extension-onboarding/pages/Details/screens/BrowserActivity";
import React from "react";
import { Route } from "react-router-dom";
import DataDashBoardLayout from "@extension-onboarding/layouts/DataDashboardLayout";
import Rewards from "@extension-onboarding/pages/Details/screens/Rewards";
import Tokens from "@extension-onboarding/pages/Details/screens/Tokens";
import NFTs from "@extension-onboarding/pages/Details/screens/NFTs";
import DataDashboarPersonalInfo from "@extension-onboarding/pages/Details/screens/DataDashboarPersonalInfo";
import MarketPlaceCollection from "@extension-onboarding/pages/Details/screens/MarketplaceCollection/MarketplaceCollection";
import NFTDetails from "@extension-onboarding/pages/Details/screens/NFTDetails";
import RewardReview from "@extension-onboarding/pages/Details/screens/MarketplaceCollection/RewardReview";

export const OnboardingRoutes = (
  <Route>
    {/* <Route path={EPaths.ONBOARDING_WELCOME} element={<OnboardingWelcome />} /> */}
    <Route element={<OnboardingLayout />}>
      <Route
        path={EPaths.ONBOARDING_LINK_ACCOUNT}
        element={<AccountLinking />}
      />
      <Route
        path={EPaths.ONBOARDING_BUILD_PROFILE}
        element={<ProfileCreation />}
      />
      {/* <Route path={EPaths.ONBOARDING_VIEW_DATA} element={<ViewData />} /> */}
    </Route>
    <Route path={EPaths.ONBOARDING_OPT_IN} element={<OptIn />} />
  </Route>
);

export const AuthFlowRoutes = (
  <Route element={<ProductTourLayout />}>
    <Route element={<AuthFlowLayout />}>
      <Route path={EPaths.HOME} element={<p>home</p>} />
      <Route element={<DataDashBoardLayout />}>
        <Route path={EPaths.REWARDS} element={<Rewards />} />
        <Route path={EPaths.TOKENS} element={<Tokens />} />
        <Route path={EPaths.NFTS} element={<NFTs />} />
        <Route path={EPaths.BROWSER_ACTIVITY} element={<BrowserActivity />} />
        <Route
          path={EPaths.PERSONAL_INFO}
          element={<DataDashboarPersonalInfo />}
        />
      </Route>
      <Route path={EPaths.NFT_DETAIL} element={<NFTDetails />} />
      <Route path={EPaths.MY_REWARDS} element={<MarketplaceRewardsTemp />} />
      <Route path={EPaths.MARKETPLACE_REWARD} element={<RewardReview />} />
      <Route
        path={EPaths.MARKETPLACE_COLLECTION}
        element={<MarketPlaceCollection />}
      />
      {/* <Route path={EPaths.MY_CAMPAIGNS} element={<CampaignsInfo />} />
      <Route
        path={EPaths.MARKETPLACE_CAMPAIGNS}
        element={<MarketPlaceCampaigns />}
      /> */}
      <Route path={EPaths.WEB3_SETTINGS} element={<OnChainIfo />} />
      <Route path={EPaths.WEB2_SETTINGS} element={<PersonalInfo />} />
      <Route
        path={EPaths.DATA_PERMISSIONS_SETTING}
        element={<DataPermissionsSettings />}
      />
      <Route
        path={EPaths.SCAM_FILTER_SETTINGS}
        element={<ScamFilterSettings />}
      />
    </Route>
  </Route>
);
