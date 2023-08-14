import { Box, Grid } from "@material-ui/core";
import { LazyReward } from "@snickerdoodlelabs/objects";
import React, { FC } from "react";

import { useStyles } from "@extension-onboarding/pages/Details/screens/EarnedRewards/components/LazyReward/LazyReward.style";

interface IRewardItemProps {
  reward: LazyReward;
}
const RewardItem: FC<IRewardItemProps> = ({ reward }) => {
  const classes = useStyles();

  return null;
};
export default RewardItem;
