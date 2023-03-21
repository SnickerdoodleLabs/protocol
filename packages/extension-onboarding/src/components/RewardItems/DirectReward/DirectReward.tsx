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
      width="100%"
      height={192}
      style={{ objectFit: "contain", borderRadius: 8 }}
      src={`${apiGateway.config.ipfsFetchBaseUrl}${reward.image}`}
    />
  );

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
      <Box width="100%" position="relative">
        {image}
        <img className={rewardItemsClasses.badge} src={earnedBadge} />
      </Box>

      <Box mt={1.5}>
        <Typography className={rewardItemsClasses.title}>
          {reward.name}
        </Typography>
      </Box>
      <Typography className={rewardItemsClasses.description}>
        {reward.description}
      </Typography>
    </Box>
  );
};
