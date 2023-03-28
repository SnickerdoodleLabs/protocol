import { useRewardItemsStyles } from "@extension-onboarding/components/RewardItems/RewardItems.style";
import { useStyles } from "@extension-onboarding/components/RewardItems/Web2Reward/Web2Reward.style";
import { useAppContext } from "@extension-onboarding/context/App";
import { EBadgeType } from "@extension-onboarding/objects";
import { Box, Typography } from "@material-ui/core";
import {
  EVMContractAddress,
  EWalletDataType,
  Web2Reward,
} from "@snickerdoodlelabs/objects";
import React from "react";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";

interface IWeb2RewardProps {
  reward: Web2Reward;
  permissions: EWalletDataType[];
  consentContractAddress: EVMContractAddress;
}
export default ({
  reward,
  permissions,
  consentContractAddress,
}: IWeb2RewardProps) => {
  const { apiGateway } = useAppContext();
  const classes = useStyles();
  const rewardItemsClasses = useRewardItemsStyles();
  const navigate = useNavigate();
  const { pathname } = useLocation();

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
      onClick={() => {
        navigate(`${pathname}/reward-detail`, {
          state: {
            consentContractAddress,
            reward,
            permissions,
          },
        });
      }}
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
