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
      <Box mb={4}>
        <Typography className={classes.title}>My Campaigns</Typography>
        <Typography className={classes.description}>
          Check out what you've earned from sharing insights!
        </Typography>
      </Box>
      {isLoading ? (
        <Box display="flex" alignItems="center" justifyContent="center" mt={15}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {campaignContractAddressesWithCID &&
          Object.keys(campaignContractAddressesWithCID).length ? (
            Object.keys(campaignContractAddressesWithCID)?.map((key) => (
              <CampaignItem
                button={
                  <Typography
                    onClick={() => {
                      onLeaveClick(key as EVMContractAddress);
                    }}
                    className={classes.link}
                  >
                    Leave
                  </Typography>
                }
                key={key}
                campaignCID={campaignContractAddressesWithCID[key]}
              />
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
        </>
      )}
    </Box>
  );
};
export default RewardsInfo;
