import emptyReward from "@extension-onboarding/assets/images/empty-marketplace-rewads.svg";
import { EModalSelectors } from "@extension-onboarding/components/Modals";
import RewardItem from "@extension-onboarding/components/RewardItem";
import { useLayoutContext } from "@extension-onboarding/context/LayoutContext";
import { useStyles } from "@extension-onboarding/pages/Details/screens/MarketPlaceRewards/MarketPlaceRewards.style";
import { IWindowWithSdlDataWallet } from "@extension-onboarding/services/interfaces/sdlDataWallet/IWindowWithSdlDataWallet";
import { Box, CircularProgress, Grid, Typography } from "@material-ui/core";
import {
  EVMContractAddress,
  EWalletDataType,
  IpfsCID,
} from "@snickerdoodlelabs/objects";
import React, { FC, useEffect, useState } from "react";

declare const window: IWindowWithSdlDataWallet;

const MarketPlaceRewards: FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [rewardContractAddressesWithCID, setRewardContractAddressesWithCID] =
    useState<Record<EVMContractAddress, IpfsCID>>();
  const { setModal, setLoadingStatus } = useLayoutContext();
  useEffect(() => {
    getInvitations();
  }, []);

  useEffect(() => {
    if (rewardContractAddressesWithCID) {
      if (isLoading) {
        setIsLoading(false);
      }
    }
  }, [JSON.stringify(rewardContractAddressesWithCID)]);

  const getInvitations = () => {
    return window.sdlDataWallet
      .getAvailableInvitationsCID()
      .mapErr((e) => {
        setIsLoading(false);
      })
      .map((metaData) => {
        setRewardContractAddressesWithCID(metaData);
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
        const metadata = { ...rewardContractAddressesWithCID };
        delete metadata[consentContractAddress];
        setRewardContractAddressesWithCID(metadata);
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
        <Typography className={classes.title}>Available Rewards</Typography>
        <Typography className={classes.description}>
          Find and claim more rewards.
        </Typography>
      </Box>
      {isLoading ? (
        <Box display="flex" alignItems="center" justifyContent="center" mt={15}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2}>
          {rewardContractAddressesWithCID &&
          Object.keys(rewardContractAddressesWithCID).length ? (
            Object.keys(rewardContractAddressesWithCID)?.map((key, index) => (
              <RewardItem
                button={
                  <Typography
                    onClick={() => {
                      onClaimClick(key as EVMContractAddress);
                    }}
                    className={classes.link}
                  >
                    Claim Reward
                  </Typography>
                }
                key={key}
                rewardCID={rewardContractAddressesWithCID[key]}
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
                <img style={{ width: 330, height: "auto" }} src={emptyReward} />
              </Box>
            </Box>
          )}
        </Grid>
      )}
    </Box>
  );
};
export default MarketPlaceRewards;
