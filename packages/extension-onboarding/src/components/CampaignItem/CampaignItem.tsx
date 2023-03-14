import BrokenImageIcon from "@material-ui/icons/BrokenImage";
import { useStyles } from "@extension-onboarding/components/CampaignItem/CampaignItem.style";
import LinearProgress from "@extension-onboarding/components/LinearProgress";
import Button from "@extension-onboarding/components/Button";
import { IWindowWithSdlDataWallet } from "@extension-onboarding/services/interfaces/sdlDataWallet/IWindowWithSdlDataWallet";
import { Box, Grid, Typography } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import {
  EarnedReward,
  EVMContractAddress,
  IOpenSeaMetadata,
  IpfsCID,
  PossibleReward,
} from "@snickerdoodlelabs/objects";
import React, { ReactNode, FC, useEffect, useState, useMemo } from "react";

declare const window: IWindowWithSdlDataWallet;
interface ICampaignItemProps {
  campaignCID: IpfsCID;
  consentContractAddress: EVMContractAddress;
  onLeaveClick: () => void;
  earnedRewards: EarnedReward[];
}
interface IRewardCount {
  total: number;
  earned: number;
}
const CampaignItem: FC<ICampaignItemProps> = ({
  campaignCID,
  onLeaveClick,
  consentContractAddress,
  earnedRewards,
}) => {
  const [campaignInfo, setCampaignInfo] = useState<IOpenSeaMetadata>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [possibleRewards, setPossibleRewards] = useState<PossibleReward[]>();

  const classes = useStyles();

  useEffect(() => {
    getRewardItem();
    getPossibleRewards();
  }, []);

  useEffect(() => {
    if (campaignInfo) {
      setIsLoading(false);
    }
  }, [JSON.stringify(campaignInfo)]);

  const getRewardItem = () => {
    window.sdlDataWallet
      .getInvitationMetadataByCID(campaignCID)
      .map((metadata) => {
        setCampaignInfo(metadata);
      })
      .mapErr((e) => {
        setIsLoading(false);
      });
  };

  const getPossibleRewards = () => {
    window.sdlDataWallet
      ?.getPossibleRewards?.([consentContractAddress])
      .map((possibleRewards) =>
        setPossibleRewards(possibleRewards[consentContractAddress]),
      );
  };

  const rewardCount: IRewardCount | null = useMemo(() => {
    if (possibleRewards) {
      const earnedCount = possibleRewards.reduce((acc, item) => {
        acc += earnedRewards.filter(
          (reward) => reward.queryCID === item.queryCID,
        ).length;
        return acc;
      }, 0);
      return { total: possibleRewards.length, earned: earnedCount };
    }
    return null;
  }, [JSON.stringify(possibleRewards)]);

  return (
    <Box
      display="flex"
      flexDirection={"column"}
      justifyContent="space-between"
      p={3}
      border=" 1px solid #E3E3E3"
      borderRadius={16}
    >
      <Box mb={2}>
        <Typography className={classes.name}>
          {isLoading ? (
            <Skeleton animation="wave" />
          ) : (
            `${campaignInfo?.rewardName} Rewards Program`
          )}
        </Typography>
      </Box>
      <Box display="flex">
        <Box width="30%" mr={2}>
          <img src={campaignInfo?.image} className={classes.image} />
        </Box>
        <Box display="flex" flex={1} flexDirection="column">
          <Box mb={2} height={42}>
            <Typography className={classes.description}>
              {isLoading ? (
                <Skeleton animation="wave" height={42} />
              ) : (
                campaignInfo?.description
              )}
            </Typography>
          </Box>
          {rewardCount ? (
            <Box>
              <Box display="flex" justifyContent="space-between" mb={0.5}>
                <Typography className={classes.earnedText}>
                  {rewardCount.earned} Rewards Earned
                </Typography>
                <Typography className={classes.leftText}>
                  {rewardCount.total - rewardCount?.earned} Left
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={(rewardCount.earned * 100) / (rewardCount.total || 1)}
              />
            </Box>
          ) : (
            <Box height={31.3125} />
          )}
          <Box mt={5} marginLeft="auto">
            <Box display="inline" mr={2}>
              <Button buttonType="v2">Details</Button>
            </Box>
            <Button onClick={onLeaveClick} buttonType="v2Danger">
              Unsubscribe
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
export default CampaignItem;
