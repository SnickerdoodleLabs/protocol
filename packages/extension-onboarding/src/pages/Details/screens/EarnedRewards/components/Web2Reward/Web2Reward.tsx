import { useStyles } from "@extension-onboarding/pages/Details/screens/EarnedRewards/components/Web2Reward/Web2Reward.style";
import { Box, Grid } from "@material-ui/core";
import { Web2Reward } from "@snickerdoodlelabs/objects";
import React, { FC } from "react";

interface IRewardItemProps {
  reward: Web2Reward;
}
const RewardItem: FC<IRewardItemProps> = ({ reward }) => {
  const classes = useStyles();

  return null;
};
export default RewardItem;
