import Permissions from "@extension-onboarding/components/Permissions";
import { useStyles } from "@extension-onboarding/components/RewardItems/DirectReward/DirectReward.style";
import { useRewardItemsStyles } from "@extension-onboarding/components/RewardItems/RewardItems.style";
import { useAppContext } from "@extension-onboarding/context/App";
import { Box, Typography } from "@material-ui/core";
import {
  DirectReward,
  EVMContractAddress,
  EWalletDataType,
} from "@snickerdoodlelabs/objects";
import React from "react";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";

interface IDirectRewardProps {
  reward: DirectReward;
  consentContractAddress: EVMContractAddress;
  permissions: EWalletDataType[];
}
export default ({
  reward,
  permissions,
  consentContractAddress,
}: IDirectRewardProps) => {
  const { apiGateway } = useAppContext();
  const classes = useStyles();
  const rewardItemsClasses = useRewardItemsStyles();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const image = (
    <img
      className={rewardItemsClasses.img}
      src={`${apiGateway.config.ipfsFetchBaseUrl}${reward.image}`}
    />
  );

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      border="0.847302px solid rgba(22, 22, 26, 0.08)"
      p={1}
      borderRadius={14}
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
      <Box width="100%" position="relative">
        {image}
      </Box>

      <Box mb={0.75} display="flex" flexDirection="column">
        <Typography className={rewardItemsClasses.title}>
          {reward.name}
        </Typography>
      </Box>
      <Box
        py={0.75}
        px={1.5}
        bgcolor="rgba(22, 22, 26, 0.04)"
        borderRadius={10}
      >
        <Box mb={0.5}>
          <Typography className={rewardItemsClasses.priceTitle}>
            Price:
          </Typography>
        </Box>
        <Permissions
          displayType="row"
          rowItemProps={{ width: 20, mr: 0.75 }}
          permissions={permissions}
        />
      </Box>
    </Box>
  );
};
