import { EPaths } from "@extension-onboarding/containers/Router/Router.paths";
import AuthFlowLayout from "@extension-onboarding/layouts/AutFlowLayout";
import OnboardingLayout from "@extension-onboarding/layouts/OnboardingLayout";
import CampaignsInfo from "@extension-onboarding/pages/Details/screens/CampaignsInfo";
import DataPermissionsSettings from "@extension-onboarding/pages/Details/screens/DataPermissionsSettings";
import EarnedRewards from "@extension-onboarding/pages/Details/screens/EarnedRewards";
import MarketPlaceCampaigns from "@extension-onboarding/pages/Details/screens/MarketplaceCampaigns";
import OnChainIfo from "@extension-onboarding/pages/Details/screens/OnChainIfo";
import PersonalInfo from "@extension-onboarding/pages/Details/screens/PersonalInfo";
import Portfolio from "@extension-onboarding/pages/Details/screens/Portfolio";
import ScamFilterSettings from "@extension-onboarding/pages/Details/screens/ScamFilterSettings";
import AccountLinking from "@extension-onboarding/pages/Onboarding/AccountLinking";
import OnboardingWelcome from "@extension-onboarding/pages/Onboarding/OnboardingWelcome";
import ProfileCreation from "@extension-onboarding/pages/Onboarding/ProfileCreation";
import ViewData from "@extension-onboarding/pages/Onboarding/ViewData";
import React from "react";
import { Route } from "react-router-dom";

export const OnboardingRoutes = (
  <Route>
    <Route path={EPaths.ONBOARDING_WELCOME} element={<OnboardingWelcome />} />
    <Route element={<OnboardingLayout />}>
      <Route
        path={EPaths.ONBOARDING_LINK_ACCOUNT}
        element={<AccountLinking />}
      />
      <Route
        path={EPaths.ONBOARDING_BUILD_PROFILE}
        element={<ProfileCreation />}
      />
      <Route path={EPaths.ONBOARDING_VIEW_DATA} element={<ViewData />} />
    </Route>
  </Route>
);

export const AuthFlowRoutes = (
  <Route element={<AuthFlowLayout />}>
    <Route path={EPaths.HOME} element={<Portfolio />} />
    <Route path={EPaths.MY_REWARDS} element={<EarnedRewards />} />
    <Route path={EPaths.MY_CAMPAIGNS} element={<CampaignsInfo />} />
    <Route
      path={EPaths.MARKETPLACE_CAMPAIGNS}
      element={<MarketPlaceCampaigns />}
    />
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
);
