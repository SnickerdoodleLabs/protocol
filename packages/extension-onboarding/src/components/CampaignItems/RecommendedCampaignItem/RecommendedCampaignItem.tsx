import { useStyles } from "@extension-onboarding/components/CampaignItems/RecommendedCampaignItem/RecommendedCampaignItem.style";
import { EPaths } from "@extension-onboarding/containers/Router/Router.paths";
import useCampaignLogic from "@extension-onboarding/hooks/useCampaignLogic";
import { IWindowWithSdlDataWallet } from "@extension-onboarding/services/interfaces/sdlDataWallet/IWindowWithSdlDataWallet";
import {
  Box,
  Typography,
  Button as MaterialButton,
  withStyles,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { ETag, EVMContractAddress } from "@snickerdoodlelabs/objects";
import React, { FC } from "react";
import { generatePath, useNavigate } from "react-router";

declare const window: IWindowWithSdlDataWallet;
interface IRecommendedCampaignItemProps {
  consentContractAddress: EVMContractAddress;
  navigationPath?: EPaths;
  tag?: ETag;
}

const DetailsButton = withStyles({
  root: {
    paddingLeft: 8,
    paddingRight: 8,
    boxShadow: "0px 2px 0px rgba(0, 0, 0, 0.016)",
    color: "#262626",
    border: "1px solid",
    borderColor: "#B9B6D3",
    fontStyle: "normal",
    fontFamily: "Public Sans",
    borderRadius: 4,
    fontWeight: 400,
    height: 22,
    fontSize: "12px",
    lineHeight: "22px",
    textTransform: "none",
    backgroundColor: "#fff",
    "&:hover": {
      backgroundColor: "#fff",
    },
  },
})(MaterialButton);

const SubscribeButton = withStyles({
  root: {
    paddingLeft: 8,
    paddingRight: 8,
    boxShadow: "0px 2px 0px rgba(0, 0, 0, 0.016)",
    color: "#FFFFFF",
    border: "1px solid",
    borderColor: "#B9B6D3",
    borderRadius: 4,
    fontStyle: "normal",
    fontFamily: "Public Sans",
    fontWeight: 400,
    height: 22,
    fontSize: "12px",
    lineHeight: "22px",
    textTransform: "none",
    backgroundColor: "#8079B4",
    "&:hover": {
      backgroundColor: "#8079B4",
    },
  },
})(MaterialButton);
const RecommendedCampaignItem: FC<IRecommendedCampaignItemProps> = ({
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
    handleSubscribeButton,
  } = useCampaignLogic({ consentContractAddress });

  const navigate = useNavigate();

  const classes = useStyles();
  return (
    <Box
      display="flex"
      bgcolor="#fff"
      flexDirection={"column"}
      justifyContent="space-between"
      p={1.5}
      border=" 1px solid #E3E3E3"
      borderRadius={12}
    >
      <Box display="flex">
        <Box mr={1.5}>
          <img src={campaignInfo?.image} className={classes.image} />
        </Box>
        <Box display="flex" flex={1} flexDirection="column">
          <Box mb={0.5}>
            <Typography className={classes.name}>
              {isLoading ? (
                <Skeleton animation="wave" />
              ) : (
                `${campaignInfo?.rewardName}`
              )}
            </Typography>
          </Box>
          <Box mb={1}>
            <Typography className={classes.description}>
              {isLoading ? (
                <Skeleton animation="wave" />
              ) : (
                campaignInfo?.description
              )}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center">
            {isSubscribed && (
              <Box display="flex" alignItems="center">
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
            <Box display="flex" marginLeft="auto">
              <Box display="inline" mr={isSubscribed ? 0 : 1}>
                <DetailsButton
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
                  variant="contained"
                >
                  Details
                </DetailsButton>
              </Box>
              {!isSubscribed && (
                <SubscribeButton onClick={handleSubscribeButton}>
                  Subscribe
                </SubscribeButton>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
export default RecommendedCampaignItem;
