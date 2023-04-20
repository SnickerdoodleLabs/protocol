import { EPaths } from "@extension-onboarding/containers/Router/Router.paths";
import AuthFlowLayout from "@extension-onboarding/layouts/AutFlowLayout";
import DataDashBoardLayout from "@extension-onboarding/layouts/DataDashboardLayout";
import OnboardingLayout from "@extension-onboarding/layouts/OnboardingLayout";
import ProductTourLayout from "@extension-onboarding/layouts/ProductTourLayout";
import BrowserActivity from "@extension-onboarding/pages/Details/screens/BrowserActivity";
import CampaignSettings from "@extension-onboarding/pages/Details/screens/CampaignSettings";
import DataDashboarPersonalInfo from "@extension-onboarding/pages/Details/screens/DataDashboarPersonalInfo";
import DataPermissionsSettings from "@extension-onboarding/pages/Details/screens/DataPermissionsSettings";
import Marketplace from "@extension-onboarding/pages/Details/screens/Marketplace";
import CategoryDetail from "@extension-onboarding/pages/Details/screens/Marketplace/CategoryDetail";
import NFTDetails from "@extension-onboarding/pages/Details/screens/NFTDetails";
import NFTs from "@extension-onboarding/pages/Details/screens/NFTs";
import OnChainIfo from "@extension-onboarding/pages/Details/screens/OnChainIfo";
import PersonalInfo from "@extension-onboarding/pages/Details/screens/PersonalInfo";
import PoapNFTs from "@extension-onboarding/pages/Details/screens/PoapNFTs";
import RewardDetail from "@extension-onboarding/pages/Details/screens/RewardDetail";
import RewardProgramDetails from "@extension-onboarding/pages/Details/screens/RewardProgramDetails";
import ScamFilterSettings from "@extension-onboarding/pages/Details/screens/ScamFilterSettings";
import SocialMediaInfo from "@extension-onboarding/pages/Details/screens/SocialMediaInfo";
import Tokens from "@extension-onboarding/pages/Details/screens/Tokens";
import AccountLinking from "@extension-onboarding/pages/Onboarding/AccountLinking";
import CategorySelection from "@extension-onboarding/pages/Onboarding/CategorySelection";
import OptIn from "@extension-onboarding/pages/Onboarding/OptIn";
import PermissionSelection from "@extension-onboarding/pages/Onboarding/PermissionSelection";
import ProfileCreation from "@extension-onboarding/pages/Onboarding/ProfileCreation";
import React from "react";
import { Route } from "react-router-dom";

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
      <Route
        path={EPaths.ONBOARDING_PERMISSION_SELECTION}
        element={<PermissionSelection />}
      />
      <Route
        path={EPaths.ONBOARDING_TAG_SELECTION}
        element={<CategorySelection />}
      />
    </Route>
    <Route path={EPaths.ONBOARDING_OPT_IN} element={<OptIn />} />
  </Route>
);

export const AuthFlowRoutes = (
  <Route element={<ProductTourLayout />}>
    <Route element={<AuthFlowLayout />}>
      <Route element={<DataDashBoardLayout />}>
        <Route path={EPaths.TOKENS} element={<Tokens />} />
        <Route path={EPaths.NFTS} element={<NFTs />} />
        <Route path={EPaths.POAP_NFTS} element={<PoapNFTs />} />
        <Route path={EPaths.BROWSER_ACTIVITY} element={<BrowserActivity />} />
        <Route path={EPaths.SOCIAL_MEDIA_DATA} element={<SocialMediaInfo />} />
        <Route
          path={EPaths.PERSONAL_INFO}
          element={<DataDashboarPersonalInfo />}
        />
      </Route>
      <Route path={EPaths.MARKETPLACE} element={<Marketplace />} />
      <Route path={EPaths.NFT_DETAIL} element={<NFTDetails />} />
      {/* <Route path={EPaths.MY_REWARDS} element={<MarketplaceRewardsTemp />} />
      <Route path={EPaths.MARKETPLACE_REWARD} element={<RewardReview />} />
      <Route
        path={EPaths.MARKETPLACE_COLLECTION}
        element={<MarketPlaceCollection />}
      /> */}
      {/* <Route path={EPaths.MY_CAMPAIGNS} element={<CampaignsInfo />} />
      <Route
        path={EPaths.MARKETPLACE_CAMPAIGNS}
        element={<MarketPlaceCampaigns />}
      /> */}
      <Route path={EPaths.WEB3_SETTINGS} element={<OnChainIfo />} />
      <Route path={EPaths.WEB2_SETTINGS} element={<PersonalInfo />} />
      <Route
        path={EPaths.REWARDS_SUBSCRIPTIONS}
        element={<CampaignSettings />}
      />
      <Route
        path={EPaths.DATA_PERMISSIONS_SETTING}
        element={<DataPermissionsSettings />}
      />
      <Route
        path={EPaths.SCAM_FILTER_SETTINGS}
        element={<ScamFilterSettings />}
      />
      <Route
        path={EPaths.REWARDS_SUBSCRIPTION_DETAIL}
        element={<RewardProgramDetails />}
      />
      <Route
        path={EPaths.MARKETPLACE_CAMPAIGN_DETAIL}
        element={<RewardProgramDetails />}
      />
      <Route
        path={EPaths.MARKETPLACE_REWARD_DETAIL}
        element={<RewardDetail />}
      />
      <Route
        path={EPaths.MARKETPLACE_REWARD_DETAIL_WITH_TAG}
        element={<RewardDetail />}
      />
      <Route
        path={EPaths.REWARDS_SUBSCRIPTION_REWARD_DETAIL}
        element={<RewardDetail />}
      />
      <Route
        path={EPaths.MARKETPLACE_TAG_DETAIL}
        element={<CategoryDetail />}
      />
      <Route
        path={EPaths.MARKETPLACE_CAMPAIGN_DETAIL_WITH_TAG}
        element={<RewardProgramDetails />}
      />
    </Route>
  </Route>
);
