import emptyReward from "@extension-onboarding/assets/images/empty-reward.svg";
import { EModalSelectors } from "@extension-onboarding/components/Modals";
import RewardItem from "@extension-onboarding/components/RewardItem";
import { useLayoutContext } from "@extension-onboarding/context/LayoutContext";
import { useStyles } from "@extension-onboarding/pages/Details/screens/RewardsInfo/RewardsInfo.style";
import { IWindowWithSdlDataWallet } from "@extension-onboarding/services/interfaces/sdlDataWallet/IWindowWithSdlDataWallet";
import { Box, CircularProgress, Grid, Typography } from "@material-ui/core";
import { EVMContractAddress, IpfsCID } from "@snickerdoodlelabs/objects";
import React, { FC, useEffect, useState } from "react";

declare const window: IWindowWithSdlDataWallet;

const RewardsInfo: FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [rewardContractAddressesWithCID, setRewardContractAddressesWithCID] =
    useState<Record<EVMContractAddress, IpfsCID>>();
  const { setModal, setLoadingStatus } = useLayoutContext();

  useEffect(() => {
    getInvitations();
  }, []);

  useEffect(() => {
    if (rewardContractAddressesWithCID) {
      setIsLoading(false);
    }
  }, [JSON.stringify(rewardContractAddressesWithCID)]);

  const getInvitations = () => {
    return window.sdlDataWallet
      .getAcceptedInvitationsCID()
      .mapErr((e) => {
        setIsLoading(false);
      })
      .map((metaData) => {
        setRewardContractAddressesWithCID(metaData);
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
        const metadata = { ...rewardContractAddressesWithCID };
        delete metadata[consentContractAddress];
        setRewardContractAddressesWithCID(metadata);
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
        title: "Burn Reward",
        content: "Are you sure you want to burn this reward?",
        primaryButtonText: "Burn",
      },
    });
  };

  const classes = useStyles();

  return (
    <Box>
      <Box mb={4}>
        <Typography className={classes.title}>My Rewards</Typography>
        <Typography className={classes.description}>
          See what you've earned from sharing insights!
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
            Object.keys(rewardContractAddressesWithCID)?.map((key) => (
              <RewardItem
                button={
                  <Typography
                    onClick={() => {
                      onLeaveClick(key as EVMContractAddress);
                    }}
                    className={classes.link}
                  >
                    Burn
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
export default RewardsInfo;
