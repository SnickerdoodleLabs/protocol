import emptySubscriptions from "@extension-onboarding/assets/images/empty-subscriptions.svg";
import { DefaultCampaignItem } from "@extension-onboarding/components/CampaignItems";
import { EAlertSeverity } from "@extension-onboarding/components/CustomizedAlert";
import { EModalSelectors } from "@extension-onboarding/components/Modals";
import Typography from "@extension-onboarding/components/Typography";
import { EPaths } from "@extension-onboarding/containers/Router/Router.paths";
import { useAppContext } from "@extension-onboarding/context/App";
import { useLayoutContext } from "@extension-onboarding/context/LayoutContext";
import { useNotificationContext } from "@extension-onboarding/context/NotificationContext";
import { useStyles } from "@extension-onboarding/pages/Details/screens/CampaignSettings/CampaignSettings.style";
import { IWindowWithSdlDataWallet } from "@extension-onboarding/services/interfaces/sdlDataWallet/IWindowWithSdlDataWallet";
import { Box, CircularProgress, Grid } from "@material-ui/core";
import { EVMContractAddress, IpfsCID } from "@snickerdoodlelabs/objects";
import React, { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

declare const window: IWindowWithSdlDataWallet;

const RewardsInfo: FC = () => {
  const navigate = useNavigate();
  const { setAlert } = useNotificationContext();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { earnedRewards, updateOptedInContracts } = useAppContext();
  const [
    campaignContractAddressesWithCID,
    setCampaignContractAddressesWithCID,
  ] = useState<Record<EVMContractAddress, IpfsCID>>();
  const { setModal, setLoadingStatus } = useLayoutContext();

  useEffect(() => {
    getInvitations();
  }, []);

  useEffect(() => {
    if (campaignContractAddressesWithCID && earnedRewards) {
      setIsLoading(false);
    }
  }, [
    JSON.stringify(campaignContractAddressesWithCID),
    JSON.stringify(earnedRewards),
  ]);

  const getInvitations = () => {
    return window.sdlDataWallet
      .getAcceptedInvitationsCID()
      .mapErr((e) => {
        setIsLoading(false);
      })
      .map((metaData) => {
        setCampaignContractAddressesWithCID(metaData);
      });
  };

  const leaveCohort = (consentContractAddress: EVMContractAddress) => {
    setLoadingStatus(true);
    window.sdlDataWallet
      .leaveCohort(consentContractAddress)
      .mapErr((e) => {
        setLoadingStatus(false);
      })
      .map(() => {
        const metadata = { ...campaignContractAddressesWithCID };
        delete metadata[consentContractAddress];
        setCampaignContractAddressesWithCID(metadata);
        setLoadingStatus(false);
        updateOptedInContracts();
        setAlert({
          severity: EAlertSeverity.SUCCESS,
          message: `Unsubscribed Successfully`,
        });
      });
  };

  const onLeaveClick = (consentContractAddress: EVMContractAddress) => {
    setModal({
      modalSelector: EModalSelectors.LEAVE_COHORT_MODAL,
      onPrimaryButtonClick: () => {
        leaveCohort(consentContractAddress);
      },
    });
  };

  const classes = useStyles();

  return (
    <Box>
      <Box mb={4.5}>
        <Typography variant="pageTitle">
          Reward Program Subscriptions
        </Typography>
        <Box mt={1}>
          <Typography variant="pageDescription">
            These are the reward programs you follow. Through these subscription
            contracts, you have agreed to share anonymized business insights
            with only these reward programs, in exchange for rewards.
          </Typography>
        </Box>
      </Box>
      {isLoading ? (
        <Box display="flex" alignItems="center" justifyContent="center" mt={15}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={5}>
          {campaignContractAddressesWithCID &&
          Object.keys(campaignContractAddressesWithCID).length ? (
            Object.keys(campaignContractAddressesWithCID)?.map((key) => (
              <Grid item key={key} xs={6}>
                <DefaultCampaignItem
                  navigationPath={EPaths.REWARDS_SUBSCRIPTION_DETAIL}
                  isSubscriptionsPage
                  onLeaveClick={() => {
                    onLeaveClick(key as EVMContractAddress);
                  }}
                  consentContractAddress={key as EVMContractAddress}
                />
              </Grid>
            ))
          ) : (
            <Box width="100%" display="flex">
              <Box
                justifyContent="center"
                alignItems="center"
                width="100%"
                display="flex"
                pt={5.25}
                flexDirection="column"
              >
                <img
                  style={{ width: 330, height: "auto" }}
                  src={emptySubscriptions}
                />
                <Typography className={classes.emptyText}>
                  You don’t have any rewards program subscriptions yet.
                </Typography>
                <Box
                  mt={0.5}
                  onClick={() => {
                    navigate(EPaths.MARKETPLACE);
                  }}
                  boxShadow=" 0px 2px 0px rgba(0, 0, 0, 0.016)"
                  borderRadius={4}
                  border="1px solid #D9D9D9"
                  bgcolor="#fff"
                  py={1}
                  px={2}
                  style={{ cursor: "pointer" }}
                >
                  <Typography className={classes.btnText}>
                    Rewards Marketlace
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </Grid>
      )}
    </Box>
  );
};
export default RewardsInfo;
