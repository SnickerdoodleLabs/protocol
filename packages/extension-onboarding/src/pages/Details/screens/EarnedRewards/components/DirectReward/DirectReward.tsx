import { useAppContext } from "@extension-onboarding/context/App";
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
  const { apiGateway } = useAppContext();

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
      borderRadius={12}
      p={3}
      mb={2}
    >
      <img
        width="100%"
        height={192}
        style={{ objectFit: "contain", borderRadius: 8 }}
        src={`${apiGateway.config.ipfsFetchBaseUrl}${reward.image}`}
      />
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
          {reward.name}
        </Typography>
      </Box>
      <Typography
        style={{
          fontFamily: "Space Grotesk",
          fontWeight: 400,
          fontSize: 16,
          lineHeight: "24px",
          color: "#9E9E9E",
          textOverflow: "ellipsis",
          overflow: "hidden",
          whiteSpace: "nowrap",
        }}
      >
        {reward.description}
      </Typography>
    </Box>
  );
};
export default RewardItem;
