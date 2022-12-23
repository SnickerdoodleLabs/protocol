import { useStyles } from "@extension-onboarding/pages/Details/screens/MarketplaceCollection/MarketplaceCollection.style";
import { IWindowWithSdlDataWallet } from "@extension-onboarding/services/interfaces/sdlDataWallet/IWindowWithSdlDataWallet";
import { Box, CircularProgress, Grid, Typography } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import React, { FC, useEffect, useState } from "react";
import { DirectReward, EVMContractAddress } from "@snickerdoodlelabs/objects";
import CampaignItem from "@extension-onboarding/components/CampaignItem";
import DirectRewardItem from "../EarnedRewards/components/DirectReward";

declare const window: IWindowWithSdlDataWallet;
interface IRewardComponentProps {
  reward: DirectReward;
}
const RewardComponent: FC<IRewardComponentProps> = ({ reward }) => {
  const classes = useStyles();
  const onReviewClick = (arg0: EVMContractAddress) => {
    window.location.href = `/rewards/marketplace/reward/${"ID"}`;
    throw new Error("Function not implemented.");
  };

  const onClaimClick = (arg0: EVMContractAddress) => {
    throw new Error("Function not implemented.");
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      border="1px solid #D9D9D9"
      borderRadius={12}
      p={3}
      mb={2}
    >
      <img src={reward?.image ? reward.image : ""} />
      <Box mt={1.5}>
        <Typography
          style={{
            fontFamily: "Space Grotesk",
            fontWeight: 700,
            fontSize: 16,
            lineHeight: "20px",
            color: "rgba(35, 32, 57, 0.87)",
          }}
        >
          reward name
        </Typography>
      </Box>
      <Typography
        style={{
          fontFamily: "Space Grotesk",
          fontWeight: 400,
          fontSize: 16,
          lineHeight: "24px",
          color: "#9E9E9E",
        }}
      >
        Limited collection
      </Typography>
      <Box display="flex" mt={1}>
        <Box>
          <Typography
            onClick={() => {
              onReviewClick("key" as EVMContractAddress);
            }}
            className={classes.link}
          >
            {}
            Review
          </Typography>
        </Box>
        <Box ml={3}>
          <Typography
            onClick={() => {
              onClaimClick("key" as EVMContractAddress);
            }}
            className={classes.link}
          >
            {}
            Claim
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
export default RewardComponent;
