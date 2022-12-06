import EarnedRewards from "@extension-onboarding/pages/Details/screens/EarnedRewards";
import MarketplaceCampaigns from "@extension-onboarding/pages/Details/screens/MarketplaceCampaigns";
import { Box } from "@material-ui/core";
import React, { FC } from "react";

const MarketplaceRewardsTemp: FC = () => {
  return (
    <>
      <EarnedRewards />
      <Box mt={8} mb={20}>
        <MarketplaceCampaigns />
      </Box>
    </>
  );
};

export default MarketplaceRewardsTemp;
