import { Box } from "@material-ui/core";
import React, { useMemo } from "react";

import CampaignPopup from "@extension-onboarding/components/Modals/CampaignPopup/CampaignPopup";
import Sidebar from "@extension-onboarding/components/Sidebar";
import {
  EScreens,
  useAuthFlowRouteContext,
} from "@extension-onboarding/context/AuthFlowRouteContext";
import CampaignsInfo from "@extension-onboarding/pages/Details/screens/CampaignsInfo";
import EarnedRewards from "@extension-onboarding/pages/Details/screens/EarnedRewards";
import MarketPlaceCampaigns from "@extension-onboarding/pages/Details/screens/MarketplaceCampaigns";
import { useStyles } from "@extension-onboarding/pages/Details/Details.style";
import DataPermissionSettings from "@extension-onboarding/pages/Details/screens/DataPermissionsSettings";
import OnChainInfo from "@extension-onboarding/pages/Details/screens/OnChainIfo";
import PersonalInfo from "@extension-onboarding/pages/Details/screens/PersonalInfo";
import Portfolio from "@extension-onboarding/pages/Details/screens/Portfolio";

const Details = () => {
  const classes = useStyles();
  const { activeScreen } = useAuthFlowRouteContext();
  const renderScreen = useMemo(() => {
    switch (activeScreen) {
      case EScreens.PORTFOLIO: {
        return <Portfolio />;
      }
      case EScreens.OWNED_REWARDS: {
        return <EarnedRewards />;
      }
      case EScreens.MARKET_PLACE_CAMPAIGNS: {
        return <MarketPlaceCampaigns />;
      }
      case EScreens.OPTED_IN_CAMPAIGNS: {
        return <CampaignsInfo />;
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

  return (
    <Box display="flex" maxHeight="100vh" className={classes.container}>
      <Sidebar />
      <CampaignPopup />
      <Box
        display="flex"
        style={{ overflowY: "auto" }}
        p={6}
        flex={1}
        flexDirection="column"
      >
        {/* {renderRewardCard} */}
        {renderScreen}
      </Box>
    </Box>
  );
};

export default Details;
