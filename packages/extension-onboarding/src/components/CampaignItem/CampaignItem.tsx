import { useStyles } from "@extension-onboarding/components/CampaignItem/CampaignItem.style";
import LinearProgress from "@extension-onboarding/components/LinearProgress";
import Button from "@extension-onboarding/components/Button";
import { IWindowWithSdlDataWallet } from "@extension-onboarding/services/interfaces/sdlDataWallet/IWindowWithSdlDataWallet";
import { Box, Typography } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import {
  EVMContractAddress,
  IOpenSeaMetadata,
  PossibleReward,
} from "@snickerdoodlelabs/objects";
import React, { ReactNode, FC, useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { EPaths } from "@extension-onboarding/containers/Router/Router.paths";
import { useAppContext } from "@extension-onboarding/context/App";

declare const window: IWindowWithSdlDataWallet;
interface ICampaignItemProps {
  consentContractAddress: EVMContractAddress;
  onLeaveClick?: () => void;
  isSubscriptionsPage?: boolean;
}
interface IRewardCount {
  total: number;
  earned: number;
}
const CampaignItem: FC<ICampaignItemProps> = ({
  onLeaveClick,
  isSubscriptionsPage = false,
  consentContractAddress,
}) => {
  const [campaignInfo, setCampaignInfo] = useState<IOpenSeaMetadata>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [possibleRewards, setPossibleRewards] = useState<PossibleReward[]>();
  const navigate = useNavigate();
  const classes = useStyles();
  const { optedInContracts, apiGateway, earnedRewards } = useAppContext();

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
      .getConsentContractCID(consentContractAddress)
      .map((campaignCID) =>
        window.sdlDataWallet
          .getInvitationMetadataByCID(campaignCID)
          .map((metadata) => {
            setCampaignInfo(metadata);
          })
          .mapErr((e) => {
            setIsLoading(false);
          }),
      );
  };

  const getPossibleRewards = () => {
    window.sdlDataWallet
      ?.getPossibleRewards?.([consentContractAddress])
      .map((possibleRewards) =>
        setPossibleRewards(possibleRewards[consentContractAddress]),
      );
  };

  const isSubscribed = useMemo(() => {
    return optedInContracts.includes(consentContractAddress);
  }, [optedInContracts]);

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

  const isMultiButton = useMemo(() => {
    return !!onLeaveClick;
  }, [onLeaveClick]);

  return (
    <Box
      display="flex"
      bgcolor="#fff"
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
          {!isSubscribed ? (
            <Box mb={1.5}>
              <Typography className={classes.rewardText}>Rewards</Typography>
              <Box mt={0.5} display="flex" alignItems="center">
                {possibleRewards ? (
                  <>
                    {possibleRewards?.slice(0, 5).map((reward, index) => {
                      return (
                        <img
                          key={index}
                          width={32}
                          height={32}
                          style={{
                            borderRadius: 4,
                            border: "1px solid #FFFFFF",
                            marginLeft: index === 0 ? 0 : -8,
                          }}
                          src={`${apiGateway.config.ipfsFetchBaseUrl}/${reward.image}`}
                        />
                      );
                    })}
                    {possibleRewards.length > 5 ? (
                      <Box
                        width={40}
                        height={40}
                        ml={-1}
                        border="1px solid #FFFFFF"
                        borderRadius={4}
                        bgcolor="#ddd"
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Typography>+{possibleRewards.length - 5}</Typography>
                      </Box>
                    ) : (
                      <Box height={40} />
                    )}
                  </>
                ) : (
                  <Box height={42} />
                )}
              </Box>
            </Box>
          ) : rewardCount ? (
            <Box mb={!isSubscriptionsPage ? 1.5 : 5}>
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
              {!isSubscriptionsPage && (
                <Box mt={1.25} display="flex" alignItems="center">
                  <Box mr={0.5}>
                    <img
                      width={10}
                      height={8}
                      src="https://storage.googleapis.com/dw-assets/spa/icons/check-mark.png"
                    />
                  </Box>
                  <Typography className={classes.subscribedText}>
                    Subscribed
                  </Typography>
                </Box>
              )}
            </Box>
          ) : (
            <Box mb={5} height={31.3125} />
          )}

          <Box marginLeft="auto">
            <Box display="inline" mr={isMultiButton && isSubscribed ? 2 : 0}>
              <Button
                onClick={() => {
                  navigate(EPaths.REWARDS_SUBSCRIPTION_DETAIL, {
                    state: {
                      possibleRewards,
                      info: campaignInfo,
                      consentContractAddress,
                    },
                  });
                }}
                buttonType="v2"
              >
                Details
              </Button>
            </Box>
            {onLeaveClick && isSubscribed && (
              <Button onClick={onLeaveClick} buttonType="v2Danger">
                Unsubscribe
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
export default CampaignItem;
