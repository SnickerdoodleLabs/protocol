import EarnedRewards from "@extension-onboarding/pages/Details/screens/EarnedRewards";
import { LOCAL_STORAGE_REWARDS_MARKETPLACE_INTRODUCTION } from "@extension-onboarding/constants";
import { Box, IconButton } from "@material-ui/core";
import React, { FC, useEffect, useState } from "react";
import MarketPlaceIntroduction from "@extension-onboarding/assets/images/rewards-marketplace-introduction.svg";
import CloseIcon from "@material-ui/icons/Close";
import BrowseRewards from "@extension-onboarding/pages/Details/screens/BrowseRewards/BrowseRewards";

const MarketplaceRewardsTemp: FC = () => {
  const [showIntroduction, setShowIntroduction] = useState(true);

  useEffect(() => {
    if (localStorage.getItem(LOCAL_STORAGE_REWARDS_MARKETPLACE_INTRODUCTION)) {
      setShowIntroduction(false);
    }
  }, []);

  const closeIntroduction = () => {
    localStorage.setItem(
      LOCAL_STORAGE_REWARDS_MARKETPLACE_INTRODUCTION,
      "true",
    );
    setShowIntroduction(false);
  };
  return (
    <>
      {showIntroduction && (
        <Box mb={3} display="flex" position="relative">
          <Box style={{ position: "absolute", top: 16, right: 16 }}>
            <IconButton
              disableFocusRipple
              disableRipple
              disableTouchRipple
              aria-label="close"
              onClick={closeIntroduction}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <img src={MarketPlaceIntroduction} />
        </Box>
      )}
      <EarnedRewards />
      <Box mt={8} mb={20}>
        <BrowseRewards />
      </Box>
    </>
  );
};

export default MarketplaceRewardsTemp;
