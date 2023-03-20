import { useStyles } from "@extension-onboarding/components/RewardItems/DirectReward/DirectReward.style";
import { useRewardItemsStyles } from "@extension-onboarding/components/RewardItems/RewardItems.style";
import { useAppContext } from "@extension-onboarding/context/App";
import { EBadgeType } from "@extension-onboarding/objects";
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
      {image}

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
