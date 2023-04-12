import Button from "@extension-onboarding/components/Button";
import { useStyles } from "@extension-onboarding/components/CampaignItems/DefaultCampaignItem/DefaultCampaignItem.style";
import LinearProgress from "@extension-onboarding/components/LinearProgress";
import { EPaths } from "@extension-onboarding/containers/Router/Router.paths";
import { useAppContext } from "@extension-onboarding/context/App";
import useCampaignLogic from "@extension-onboarding/hooks/useCampaignLogic";
import { IWindowWithSdlDataWallet } from "@extension-onboarding/services/interfaces/sdlDataWallet/IWindowWithSdlDataWallet";
import { Box, Typography } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { ETag, EVMContractAddress } from "@snickerdoodlelabs/objects";
import React, { FC } from "react";
import { useNavigate } from "react-router";
import { generatePath } from "react-router-dom";

declare const window: IWindowWithSdlDataWallet;
interface ICampaignItemProps {
  consentContractAddress: EVMContractAddress;
  onLeaveClick?: () => void;
  isSubscriptionsPage?: boolean;
  navigationPath?: EPaths;
  tag?: ETag;
}

const CampaignItem: FC<ICampaignItemProps> = ({
  onLeaveClick,
  isSubscriptionsPage = false,
  consentContractAddress,
  tag,
  navigationPath = tag
    ? generatePath(EPaths.MARKETPLACE_CAMPAIGN_DETAIL_WITH_TAG, { tag })
    : EPaths.MARKETPLACE_CAMPAIGN_DETAIL,
}) => {
  const {
    campaignInfo,
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
      border=" 1px solid #E3E3E3"
      borderRadius={16}
    >
      <Box mb={2}>
        <Typography className={classes.name}>
          {isLoading ? <Skeleton animation="wave" /> : `${campaignInfo?.title}`}
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
                            objectFit: "cover",
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
                        bgcolor="#E6F7FF"
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
          ) : possibleRewards ? (
            <Box mb={!isSubscriptionsPage ? 1.5 : 5}>
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
            {onLeaveClick && isSubscribed && (
              <Button onClick={onLeaveClick} buttonType="v2Danger">
                Unsubscribe
              </Button>
            )}
            <Box display="inline" ml={!onLeaveClick && isSubscribed ? 0 : 2}>
              <Button
                disabled={!possibleRewards || !campaignInfo}
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
export default CampaignItem;
