import RewardItem from "@extension-onboarding/pages/Details/screens/RewardsInfo/components/RewardItem";
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

  useEffect(() => {
    getInvitations();
  }, []);

  useEffect(() => {
    setIsLoading(false);
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

  const onLeaveClick = (consentContractAddress: EVMContractAddress) => {
    setIsLoading(true);
    window.sdlDataWallet
      .leaveCohort(consentContractAddress)
      .mapErr((e) => {
        setIsLoading(false);
      })
      .map(() => {
        const metadata = { ...rewardContractAddressesWithCID };
        delete metadata[consentContractAddress];
        setRewardContractAddressesWithCID(metadata);
      });
  };

  const classes = useStyles();

  return (
    <Box>
      <Box mb={4}>
        <Typography className={classes.title}>Rewards</Typography>
      </Box>
      {isLoading ? (
        <Box display="flex" alignItems="center" justifyContent="center" mt={15}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2}>
          {rewardContractAddressesWithCID &&
            Object.keys(rewardContractAddressesWithCID)?.map((key, index) => (
              <RewardItem
                onLeaveClick={() => {
                  onLeaveClick(key as EVMContractAddress);
                }}
                key={index}
                rewardCID={rewardContractAddressesWithCID[key]}
              />
            ))}
        </Grid>
      )}
    </Box>
  );
};
export default RewardsInfo;
