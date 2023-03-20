import { useStyles } from "@extension-onboarding/components/RewardItems/PossibleReward/PossibleReward.style";
import { useRewardItemsStyles } from "@extension-onboarding/components/RewardItems/RewardItems.style";
import { useAppContext } from "@extension-onboarding/context/App";
import { EBadgeType } from "@extension-onboarding/objects";
import { Box, Typography } from "@material-ui/core";
import { EWalletDataType, PossibleReward } from "@snickerdoodlelabs/objects";
import React from "react";

interface IPossibleRewardProps {
  reward: PossibleReward;
  badgeType?: EBadgeType;
}
export default ({
  reward,
  badgeType = EBadgeType.None,
}: IPossibleRewardProps) => {
  const { apiGateway } = useAppContext();
  const classes = useStyles();
  const rewardItemsClasses = useRewardItemsStyles();

  const image = (
    <img
      className={classes.img}
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
        <Box
          width={40}
          position="absolute"
          top={0}
          height={40}
          bgcolor="red"
        ></Box>
      </Box>
      <Box p={1.5} display="flex" flexDirection="column">
        <Box mb={0.5}>
          <Typography className={classes.title}>{reward.name}</Typography>
        </Box>
        <Typography className={classes.description}>
          {reward.description}
        </Typography>
      </Box>
    </Box>
  );
};
