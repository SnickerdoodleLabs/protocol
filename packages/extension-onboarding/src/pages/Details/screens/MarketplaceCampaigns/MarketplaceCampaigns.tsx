import emptyCampaign from "@extension-onboarding/assets/images/empty-campaign.svg";
import { EModalSelectors } from "@extension-onboarding/components/Modals";
import CampaignItem from "@extension-onboarding/components/CampaignItem";
import { useLayoutContext } from "@extension-onboarding/context/LayoutContext";
import { useStyles } from "@extension-onboarding/pages/Details/screens/MarketplaceCampaigns/MarketplaceCampaigns.style";
import { IWindowWithSdlDataWallet } from "@extension-onboarding/services/interfaces/sdlDataWallet/IWindowWithSdlDataWallet";
import { Box, CircularProgress, Grid, Typography } from "@material-ui/core";
import {
  EVMContractAddress,
  EWalletDataType,
  IpfsCID,
} from "@snickerdoodlelabs/objects";
import React, { FC, useEffect, useState } from "react";

declare const window: IWindowWithSdlDataWallet;

const MarketPlaceCampaigns: FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [
    campaignContractAddressesWithCID,
    setCampaignContractAddressesWithCID,
  ] = useState<Record<EVMContractAddress, IpfsCID>>();
  const { setModal, closeModal, setLoadingStatus } = useLayoutContext();
  useEffect(() => {
    getInvitations();
  }, []);

  useEffect(() => {
    if (campaignContractAddressesWithCID) {
      if (isLoading) {
        setIsLoading(false);
      }
    }
  }, [JSON.stringify(campaignContractAddressesWithCID)]);

  const getInvitations = () => {
    return window.sdlDataWallet
      .getAvailableInvitationsCID()
      .mapErr((e) => {
        setIsLoading(false);
      })
      .map((metaData) => {
        setCampaignContractAddressesWithCID(metaData);
      });
  };

  const acceptInvitation = (
    dataTypes: EWalletDataType[] | null,
    consentContractAddress: EVMContractAddress,
  ) => {
    setLoadingStatus(true);
    return window.sdlDataWallet
      .acceptInvitation(dataTypes, consentContractAddress)
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

  const onClaimClick = (consentContractAddress: EVMContractAddress) => {
    return window.sdlDataWallet
      .getApplyDefaultPermissionsOption()
      .map((option) => {
        if (option) {
          acceptInvitation(null, consentContractAddress);
          return;
        }
        setModal({
          modalSelector: EModalSelectors.PERMISSION_SELECTION,
          onPrimaryButtonClick: () => {
            acceptInvitation(null, consentContractAddress);
            closeModal();
          },
          customProps: {
            onManageClicked: () => {
              setModal({
                modalSelector: EModalSelectors.MANAGE_PERMISSIONS,
                onPrimaryButtonClick: (dataTpes: EWalletDataType[]) => {
                  acceptInvitation(dataTpes, consentContractAddress);
                },
              });
            },
          },
        });
      });
  };

  const classes = useStyles();

  return (
    <Box>
      <Box mb={4}>
        <Typography className={classes.title}>Available Campaigns</Typography>
        <Typography className={classes.description}>
          Browse campaigns and opt in.
        </Typography>
      </Box>
      {isLoading ? (
        <Box display="flex" alignItems="center" justifyContent="center" mt={15}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2}>
          {campaignContractAddressesWithCID &&
          Object.keys(campaignContractAddressesWithCID).length ? (
            Object.keys(campaignContractAddressesWithCID)?.map((key, index) => (
              <CampaignItem
                button={
                  <Typography
                    onClick={() => {
                      onClaimClick(key as EVMContractAddress);
                    }}
                    className={classes.link}
                  >
                    Opt-in
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
        </Grid>
      )}
    </Box>
  );
};
export default MarketPlaceCampaigns;
