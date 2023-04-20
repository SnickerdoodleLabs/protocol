import { useStyles } from "@extension-onboarding/components/RewardItems/LazyReward/LazyReward.style";
import { useRewardItemsStyles } from "@extension-onboarding/components/RewardItems/RewardItems.style";
import { useAppContext } from "@extension-onboarding/context/App";
import { EBadgeType } from "@extension-onboarding/objects";
import { Box, Typography } from "@material-ui/core";
import {
  EVMContractAddress,
  EWalletDataType,
  LazyReward,
} from "@snickerdoodlelabs/objects";
import React from "react";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";

interface ILazyRewardProps {
  reward: LazyReward;
  consentContractAddress: EVMContractAddress;
  permissions: EWalletDataType[];
}
export default ({
  reward,
  permissions,
  consentContractAddress,
}: ILazyRewardProps) => {
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
