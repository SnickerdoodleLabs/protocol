import { useStyles } from "@extension-onboarding/pages/Details/screens/EarnedRewards/components/DirectReward/DirectReward.style";
import { Box, Typography } from "@material-ui/core";
import { DirectReward } from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import React, { FC, useMemo } from "react";

interface IRewardItemProps {
  reward: DirectReward;
}
const RewardItem: FC<IRewardItemProps> = ({ reward }) => {
  const classes = useStyles();

  const transactionReceipt: ethers.providers.TransactionReceipt | null =
    useMemo(() => {
      let res;
      try {
        res = JSON.parse(
          reward.transactionReceipt,
        ) as ethers.providers.TransactionReceipt;
      } catch (e) {
        res = null;
      }
      return res;
    }, [reward]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      border="1px solid #D9D9D9"
      borderRadius={8}
      p={3}
      mb={2}
    >
      <Typography>chainID {reward.chainId}</Typography>
      <Typography>queryCID {reward.queryCID}</Typography>
    </Box>
  );
};
export default RewardItem;
