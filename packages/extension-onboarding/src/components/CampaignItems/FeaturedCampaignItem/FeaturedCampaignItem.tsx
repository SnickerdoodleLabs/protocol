import Button from "@extension-onboarding/components/Button";
import { useStyles } from "@extension-onboarding/components/CampaignItems/FeaturedCampaignItem/FeaturedCampaignItem.style";
import LinearProgress from "@extension-onboarding/components/LinearProgress";
import { EPaths } from "@extension-onboarding/containers/Router/Router.paths";
import { useAppContext } from "@extension-onboarding/context/App";
import useCampaignLogic from "@extension-onboarding/hooks/useCampaignLogic";
import { IWindowWithSdlDataWallet } from "@extension-onboarding/services/interfaces/sdlDataWallet/IWindowWithSdlDataWallet";
import { Box, Typography } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { ETag, EVMContractAddress } from "@snickerdoodlelabs/objects";
import React, { FC, useEffect, useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router";
import { generatePath } from "react-router-dom";

declare const window: IWindowWithSdlDataWallet;
interface IFeaturedCampaignItemProps {
  consentContractAddress: EVMContractAddress;
  navigationPath?: EPaths;
  tag?: ETag;
}

const FeaturedCampaignItem: FC<IFeaturedCampaignItemProps> = ({
  consentContractAddress,
  tag,
  navigationPath = tag
    ? generatePath(EPaths.MARKETPLACE_CAMPAIGN_DETAIL_WITH_TAG, { tag })
    : EPaths.MARKETPLACE_CAMPAIGN_DETAIL,
}) => {
  const {
    campaignInfo,
    subscriberCount,
    isLoading,
    isSubscribed,
    possibleRewards,
    collectedRewards,
    handleSubscribeButton,
  } = useCampaignLogic({ consentContractAddress });

  const navigate = useNavigate();
  const classes = useStyles();
  const { apiGateway } = useAppContext();
  return (
    <Box
      display="flex"
      bgcolor="#fff"
      flexDirection={"column"}
      justifyContent="space-between"
      p={3}
      border="0.955437px solid #E3E3E3"
      borderRadius={12}
    >
      <Box display="flex">
        <Box display="flex" height={188} position="relative" mr={2}>
          <img src={campaignInfo?.image} className={classes.image} />
          {subscriberCount > 0 && (
            <Box
              display="flex"
              alignItems="center"
              width={46}
              height={46}
              borderRadius={23}
              bgcolor="#5A5292"
              position="absolute"
              bottom={0}
              border="1px solid #FFFFFF"
              right={0}
            >
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                mx={0.75}
              >
                <Box mr={0.5}>
                  <img
                    width={11.2}
                    height={12}
                    src="https://storage.googleapis.com/dw-assets/spa/icons/profile.png"
                  />
                </Box>
                <Typography className={classes.subscriberCount}>
                  {subscriberCount > 99 ? "99+" : subscriberCount}
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
        <Box display="flex" flex={1} flexDirection="column">
          <Typography className={classes.name}>
            {isLoading ? (
              <Skeleton animation="wave" />
            ) : (
              `${campaignInfo?.rewardName}`
            )}
          </Typography>
          <Box mt={2} mb={2} height={42}>
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
                    {possibleRewards?.slice(0, 7).map((reward, index) => {
                      return (
                        <img
                          key={index}
                          width={56}
                          height={56}
                          style={{
                            borderRadius: 4,
                            border: "1px solid #FFFFFF",
                            marginLeft: index === 0 ? 0 : -8,
                          }}
                          src={`${apiGateway.config.ipfsFetchBaseUrl}/${reward.image}`}
                        />
                      );
                    })}
                    {possibleRewards.length > 7 ? (
                      <Box
                        width={50}
                        height={50}
                        ml={-1}
                        border="1px solid #FFFFFF"
                        borderRadius={4}
                        bgcolor="#ddd"
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Typography>+{possibleRewards.length - 7}</Typography>
                      </Box>
                    ) : (
                      <Box height={50} />
                    )}
                  </>
                ) : (
                  <Box height={56} />
                )}
              </Box>
            </Box>
          ) : possibleRewards ? (
            <Box>
              <Box display="flex" justifyContent="space-between" mb={0.5}>
                <Typography className={classes.earnedText}>
                  {collectedRewards.length} Rewards Earned
                </Typography>
                <Typography className={classes.leftText}>
                  {possibleRewards.length - collectedRewards.length} Left
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={
                  (collectedRewards.length * 100) /
                  (possibleRewards.length || 1)
                }
              />

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
            </Box>
          ) : (
            <Box mb={5} height={31.3125} />
          )}

          <Box marginLeft="auto">
            <Box display="inline">
              <Button
                onClick={() => {
                  navigate(navigationPath, {
                    state: {
                      possibleRewards,
                      info: campaignInfo,
                      consentContractAddress,
                      tag,
                    },
                  });
                }}
                buttonType="v2"
              >
                Details
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
export default FeaturedCampaignItem;
