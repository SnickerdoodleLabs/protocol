import earnedBadge from "@extension-onboarding/assets/images/badge-earned.svg";
import { useStyles } from "@extension-onboarding/components/RewardItems/DirectReward/DirectReward.style";
import { useRewardItemsStyles } from "@extension-onboarding/components/RewardItems/RewardItems.style";
import { useAppContext } from "@extension-onboarding/context/App";
import { Box, Typography } from "@material-ui/core";
import { DirectReward, EWalletDataType } from "@snickerdoodlelabs/objects";
import React from "react";

interface IDirectRewardProps {
  reward: DirectReward;
  permissions?: EWalletDataType[];
}
export default ({ reward, permissions }: IDirectRewardProps) => {
  const { apiGateway } = useAppContext();
  const classes = useStyles();
  const rewardItemsClasses = useRewardItemsStyles();

  const image = (
    <img
      className={rewardItemsClasses.img}
      src={`${apiGateway.config.ipfsFetchBaseUrl}${reward.image}`}
    />
  );

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      border="2px solid #F0F0F0"
      borderRadius={4}
    >
      <Box width="100%" position="relative">
        {image}
        <img className={rewardItemsClasses.badge} src={earnedBadge} />
      </Box>

      <Box p={1.5} display="flex" flexDirection="column">
        <Box mb={0.5}>
          <Typography className={rewardItemsClasses.title}>
            {reward.name}
          </Typography>
        </Box>
        <Typography className={rewardItemsClasses.description}>
          {reward.description}
        </Typography>
      </Box>
    </Box>
  );
};
