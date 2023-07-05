import { Badge, Box, Typography } from "@material-ui/core";
import { DirectReward } from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import React, { FC, useMemo } from "react";

import { useAppContext } from "@extension-onboarding/context/App";
import { useStyles } from "@extension-onboarding/pages/Details/screens/EarnedRewards/components/DirectReward/DirectReward.style";

interface IRewardItemProps {
  reward: DirectReward;
  count: number;
}
const RewardItem: FC<IRewardItemProps> = ({ reward, count }) => {
  const classes = useStyles();
  const { apiGateway } = useAppContext();

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
      {count > 1 ? (
        <Badge badgeContent={count} color="primary" className={classes.badge}>
          {image}
        </Badge>
      ) : (
        image
      )}
      <Box mt={1.5}>
        <Typography
          style={{
            fontFamily: "Space Grotesk",
            fontWeight: 700,
            fontSize: 16,
            lineHeight: "20px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
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
