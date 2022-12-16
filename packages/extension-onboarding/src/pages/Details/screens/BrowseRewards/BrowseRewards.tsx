import emptyCampaign from "@extension-onboarding/assets/images/empty-campaign.svg";
import { EModalSelectors } from "@extension-onboarding/components/Modals";
import CampaignItem from "@extension-onboarding/components/CampaignItem";
import { useLayoutContext } from "@extension-onboarding/context/LayoutContext";
import { useStyles } from "@extension-onboarding/pages/Details/screens/BrowseRewards/BrowseRewards.style";
import { IWindowWithSdlDataWallet } from "@extension-onboarding/services/interfaces/sdlDataWallet/IWindowWithSdlDataWallet";
import { Box, CircularProgress, Grid, Typography } from "@material-ui/core";
import BrokenImageIcon from "@material-ui/icons/BrokenImage";
import {
  EVMContractAddress,
  EWalletDataType,
  IpfsCID,
} from "@snickerdoodlelabs/objects";
import React, { FC, useEffect, useState } from "react";
import { Skeleton } from "@material-ui/lab";

declare const window: IWindowWithSdlDataWallet;

const BrowseRewards: FC = () => {
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

  const onReviewClick = (consentContractAddress: EVMContractAddress) => {};

  const classes = useStyles();

  const obj = [{ image: "", rewardName: "" }];

 

  return (
    <Box>
      <Box mb={5}>
        <Typography className={classes.title}>
          Browse Available Rewards
        </Typography>
      </Box>
      <Box mb={2}>
        <Typography className={classes.subTitle}>Featured Rewards</Typography>
        <Box mt={2} mb={5}>
          <img
            style={{ width: "100%" }}
            src="https://i.ibb.co/TBfCbXB/Group-626053.png"
          />
        </Box>
      </Box>
      <Box mb={2}>
        <Typography className={classes.subTitle}>
          Browse Available Rewards
        </Typography>
      </Box>
      <Box mb={2}>
        <Typography className={classes.description}>
          Your NFTs, from linked accounts and newly earned rewards.
        </Typography>
      </Box>
      {isLoading ? (
        <Box display="flex" alignItems="center" justifyContent="center" mt={15}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2}>
          {obj.map((rewardItem, index) => (
            <Grid item xs={12} sm={3}>
              <Box
                width="100%"
                display="flex"
                flexDirection="column"
                justifyContent="center"
                border="1px solid #D9D9D9"
                borderRadius={8}
              >
                <Box mx="auto" p={2} width="calc(100% - 32px)">
                  {rewardItem ? (
                    <img className={classes.image} src={rewardItem?.image} />
                  ) : isLoading ? (
                    <Box className={classes.imageLoader}>
                      <Skeleton variant="rect" width="100%" height="100%" />
                    </Box>
                  ) : (
                    <Box className={classes.imageLoader}>
                      <BrokenImageIcon className={classes.brokenImageIcon} />
                    </Box>
                  )}
                  <Box mt={1.5}>
                    <Typography
                      style={{
                        fontFamily: "Space Grotesk",
                        fontWeight: 700,
                        fontSize: 16,
                        lineHeight: "20px",
                        color: "rgba(35, 32, 57, 0.87)",
                      }}
                    >
                      {rewardItem?.rewardName}
                    </Typography>
                  </Box>
                  <Typography
                    style={{
                      fontFamily: "Space Grotesk",
                      fontWeight: 400,
                      fontSize: 16,
                      lineHeight: "24px",
                      color: "#9E9E9E",
                    }}
                  >
                    Limited collection
                  </Typography>
                  <Box display="flex" mt={1}>
                    <Box display="flex">
                      <Box>
                        <Typography
                          onClick={() => {
                          window.location.href="/rewards/marketplace/reward/QmTPfcSAr5FKWDmjbyudNae5NMAreqZfYqWUGFzvuWZQDh"
                          }}
                          className={classes.link}
                        >
                          {}
                          Review
                        </Typography>
                      </Box>
                      <Box ml={3}>
                        <Typography
                          onClick={() => {
                            onClaimClick("key" as EVMContractAddress);
                          }}
                          className={classes.link}
                        >
                          {}
                          Claim
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};
export default BrowseRewards;
