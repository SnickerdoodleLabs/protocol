import emptyCampaign from "@extension-onboarding/assets/images/empty-campaign.svg";
import { EModalSelectors } from "@extension-onboarding/components/Modals";
import CampaignItem from "@extension-onboarding/components/CampaignItem";
import { useLayoutContext } from "@extension-onboarding/context/LayoutContext";
import { useStyles } from "@extension-onboarding/pages/Details/screens/CampaignSettings/CampaignSettings.style";
import { IWindowWithSdlDataWallet } from "@extension-onboarding/services/interfaces/sdlDataWallet/IWindowWithSdlDataWallet";
import { Box, CircularProgress, Grid, Typography } from "@material-ui/core";
import { EVMContractAddress, IpfsCID } from "@snickerdoodlelabs/objects";
import React, { FC, useEffect, useState } from "react";

declare const window: IWindowWithSdlDataWallet;

const RewardsInfo: FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [
    campaignContractAddressesWithCID,
    setCampaignContractAddressesWithCID,
  ] = useState<Record<EVMContractAddress, IpfsCID>>();
  const { setModal, setLoadingStatus } = useLayoutContext();

  useEffect(() => {
    getInvitations();
  }, []);

  useEffect(() => {
    if (campaignContractAddressesWithCID) {
      setIsLoading(false);
    }
  }, [JSON.stringify(campaignContractAddressesWithCID)]);

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
      });
  };

  const onLeaveClick = (consentContractAddress: EVMContractAddress) => {
    setModal({
      modalSelector: EModalSelectors.CONFIRMATION_MODAL,
      onPrimaryButtonClick: () => {
        leaveCohort(consentContractAddress);
      },
      customProps: {
        title: "Leave",
        content: "Are you sure you want to leave from cohort?",
        primaryButtonText: "Leave",
      },
    });
  };

  const classes = useStyles();

  return (
    <Box>
      <Box mb={2}>
        <Typography className={classes.title}>
          Reward Program Subscriptions
        </Typography>
        <Box mt={0.5}>
          <Typography className={classes.description}>
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
        <Grid container spacing={2}>
          {campaignContractAddressesWithCID &&
          Object.keys(campaignContractAddressesWithCID).length ? (
            Object.keys(campaignContractAddressesWithCID)?.map((key) => (
              <Grid item key={key} xs={3}>
                <CampaignItem
                  onLeaveClick={() => {
                    onLeaveClick(key as EVMContractAddress);
                  }}
                  campaignCID={campaignContractAddressesWithCID[key]}
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
                pt={20}
              >
                <img
                  style={{ width: 330, height: "auto" }}
                  src={emptyCampaign}
                />
              </Box>
            </Box>
          )}
        </Grid>
      )}
    </Box>
  );
};
export default RewardsInfo;
