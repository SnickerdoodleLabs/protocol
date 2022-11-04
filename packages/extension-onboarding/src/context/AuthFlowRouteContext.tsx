import portfolioIcon from "@extension-onboarding/assets/icons/portfolio.svg";
import rewardsIcon from "@extension-onboarding/assets/icons/rewards.svg";
import settingsIcon from "@extension-onboarding/assets/icons/settings.svg";
import React, { createContext, FC, useContext, useState } from "react";
import { useLocation } from "react-router-dom";

export enum EScreens {
  OWNED_REWARDS = "owned-rewards",
  OPTED_IN_CAMPAIGNS = "opted-in-campaigns",
  MARKET_PLACE_CAMPAIGNS = "marketplace-campaigns",
  PORTFOLIO = "portfolio",
  SETTINGS = "settings",
  ON_CHAIN_INFO_SETTINGS = "on-chain-info-settings",
  DEMOGRAPHIC_INFO_SETTINGS = "demographic-info-settings",
  DATA_PERMISSIONS_SETTING = "data-permissions-setting",
  SCAM_FILTER_SETTINGS = "scam-filter-settings",
}

export interface ISubroute {
  title: string;
  screen: EScreens;
}
export interface IRoute {
  icon: string;
  title: string;
  screen: EScreens | null;
  subroutes: ISubroute[] | null;
}

export const routes: IRoute[] = [
  {
    icon: portfolioIcon,
    title: "My Portfolio",
    screen: EScreens.PORTFOLIO,
    subroutes: null,
  },
  {
    icon: rewardsIcon,
    title: "Rewards",
    screen: null,
    subroutes: [{ title: "My Rewards", screen: EScreens.OWNED_REWARDS }],
  },
  {
    icon: rewardsIcon,
    title: "Campaigns",
    screen: null,
    subroutes: [
      { title: "My Campaigns", screen: EScreens.OPTED_IN_CAMPAIGNS },
      { title: "Available Campaigns", screen: EScreens.MARKET_PLACE_CAMPAIGNS },
    ],
  },
  {
    icon: settingsIcon,
    title: "Settings",
    screen: null,
    subroutes: [
      { title: "Web 3 Info", screen: EScreens.ON_CHAIN_INFO_SETTINGS },
      { title: "Web 2 Info", screen: EScreens.DEMOGRAPHIC_INFO_SETTINGS },
      { title: "Data Permissions", screen: EScreens.DATA_PERMISSIONS_SETTING },
      { title: "Scam Filter", screen: EScreens.SCAM_FILTER_SETTINGS },
    ],
  },
];

interface IAuthFlowRouteContext {
  setActiveScreen: (EScreens) => void;
  activeScreen: EScreens;
}

const SCREENS_OBJ = {
  portfolio: EScreens.PORTFOLIO,
  rewards: EScreens.OWNED_REWARDS,
  settings: EScreens.ON_CHAIN_INFO_SETTINGS,
};

const AuthFlowRouteContext = createContext<IAuthFlowRouteContext>(
  {} as IAuthFlowRouteContext,
);

export const AuthFlowRouteContextProvider: FC = ({ children }) => {
  const { search } = useLocation();
  const screen = new URLSearchParams(search).get("screen");
  const [activeScreen, setActiveScreen] = useState<EScreens>(
    screen != undefined && SCREENS_OBJ[screen] != undefined
      ? SCREENS_OBJ[screen]
      : EScreens.PORTFOLIO,
  );

  return (
    <AuthFlowRouteContext.Provider value={{ activeScreen, setActiveScreen }}>
      {children}
    </AuthFlowRouteContext.Provider>
  );
};

export const useAuthFlowRouteContext = () => useContext(AuthFlowRouteContext);
