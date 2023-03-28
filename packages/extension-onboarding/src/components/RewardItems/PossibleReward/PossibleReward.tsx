import availableBadge from "@extension-onboarding/assets/images/badge-available.svg";
import permissionRequiredBadge from "@extension-onboarding/assets/images/badge-permission-required.svg";
import waitingBadge from "@extension-onboarding/assets/images/badge-waiting.svg";
import { useStyles } from "@extension-onboarding/components/RewardItems/PossibleReward/PossibleReward.style";
import { useRewardItemsStyles } from "@extension-onboarding/components/RewardItems/RewardItems.style";
import { useAppContext } from "@extension-onboarding/context/App";
import { EBadgeType } from "@extension-onboarding/objects";
import { Box, Typography } from "@material-ui/core";
import {
  EVMContractAddress,
  EWalletDataType,
  PossibleReward,
} from "@snickerdoodlelabs/objects";
import React from "react";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";

interface IPossibleRewardProps {
  reward: PossibleReward;
  consentContractAddress: EVMContractAddress;
  badgeType?: EBadgeType;
}
export default ({
  reward,
  consentContractAddress,
  badgeType = EBadgeType.None,
}: IPossibleRewardProps) => {
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

  const getBadgeImageSrc = () => {
    switch (true) {
      case badgeType === EBadgeType.MorePermissionRequired:
        return permissionRequiredBadge;
      case badgeType === EBadgeType.Available:
        return availableBadge;
      case badgeType === EBadgeType.Waiting:
        return waitingBadge;
      default:
        return null;
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      border="2px solid #F0F0F0"
      borderRadius={4}
      onClick={() => {
        navigate(`${pathname}/reward-detail`, {
          state: {
            consentContractAddress,
            reward,
          },
        });
      }}
    >
      <Box width="100%" position="relative">
        {image}
        {getBadgeImageSrc() && (
          <img className={rewardItemsClasses.badge} src={getBadgeImageSrc()} />
        )}
      </Box>
      <Box p={1.5} display="flex" flexDirection="column">
        <Box mb={0.5}>
          <Typography className={rewardItemsClasses.title}>
            {reward.name}
          </Typography>
        </Box>
        <Typography className={rewardItemsClasses.description}>
          {reward.description}
        </Typography>
      </Box>
    </Box>
  );
};
