import Sidebar from "@extension-onboarding/components/Sidebar";
import {
  EScreens,
  useAuthFlowRouteContext,
} from "@extension-onboarding/context/AuthFlowRouteContext";
import RewardsInfo from "@extension-onboarding/pages/Details/screens/RewardsInfo";
import MarketPlaceRewards from "@extension-onboarding/pages/Details/screens/MarketPlaceRewards";
import { useStyles } from "@extension-onboarding/pages/Details/Details.style";
import OnChainInfo from "@extension-onboarding/pages/Details/screens/OnChainIfo";
import DataPermissionSettings from "@extension-onboarding/pages/Details/screens/DataPermissionsSettings";
import PersonalInfo from "@extension-onboarding/pages/Details/screens/PersonalInfo";
import Portfolio from "@extension-onboarding/pages/Details/screens/Portfolio";
import { Box } from "@material-ui/core";
import React, { useMemo } from "react";
import RewardCard from "@extension-onboarding/components/Modals/RewardCard/RewardCard";

const Details = () => {
  const classes = useStyles();
  const { activeScreen } = useAuthFlowRouteContext();
  const renderScreen = useMemo(() => {
    switch (activeScreen) {
      case EScreens.PORTFOLIO: {
        return <Portfolio />;
      }
      case EScreens.OWNED_REWARDS:
        return <RewardsInfo />;
      case EScreens.MARKET_PLACE_REWARDS: {
        return <MarketPlaceRewards />;
      }
      case EScreens.DATA_PERMISSIONS_SETTING: {
        return <DataPermissionSettings />;
      }
      case EScreens.ON_CHAIN_INFO_SETTINGS: {
        return <OnChainInfo />;
      }
      case EScreens.DEMOGRAPHIC_INFO_SETTINGS: {
        return <PersonalInfo />;
      }
      default: {
        return null;
      }
    }
  }, [activeScreen]);

  const renderRewardCard = useMemo(() => {
    const queryParams = new URLSearchParams(window.location.search);
    let method = queryParams.get("method");
    let consentAddress = queryParams.get("consentAddress");
    let tokenId = queryParams.get("tokenId");
    let signature = queryParams.get("signature");
    if (tokenId && signature && consentAddress) {
      return <RewardCard />;
    } else {
      return null;
    }
  }, []);

  return (
    <Box display="flex" maxHeight="100vh" className={classes.container}>
      <Sidebar />
      <Box
        display="flex"
        style={{ overflowY: "auto" }}
        p={6}
        flex={1}
        flexDirection="column"
      >
        {renderRewardCard}
        {renderScreen}
      </Box>
    </Box>
  );
};

export default Details;
