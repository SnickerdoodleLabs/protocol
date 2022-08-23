import PersonalInfoCard from "@extension-onboarding/components/PersonalInfoCard";
import PrimaryButton from "@extension-onboarding/components/PrimaryButton";
import ProfileForm from "@extension-onboarding/components/ProfileForm/ProfileForm";
import { useStyles } from "@extension-onboarding/pages/Details/screens/RewardsInfo/RewardsInfo.style";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Typography,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import React, { FC, useEffect, useMemo, useState } from "react";
import { IWindowWithSdlDataWallet } from "@extension-onboarding/services/interfaces/sdlDataWallet/IWindowWithSdlDataWallet";
import { IOpenSeaMetadata } from "@snickerdoodlelabs/objects";
import RewardItem from "./components/RewardItem";
declare const window: IWindowWithSdlDataWallet;

const RewardsInfo: FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [rewardMetaData, setRewardMetaData] = useState<{
    accepted: IOpenSeaMetadata[];
    rejected: IOpenSeaMetadata[];
  }>();

  useEffect(() => {
    setIsLoading(false);
  }, [JSON.stringify(rewardMetaData)]);

  const getInvitations = () => {
    window.sdlDataWallet
      .getInvitationsMetadata()
      .mapErr((e) => {
        setIsLoading(false);
      })
      .map((metaData) => {
        setRewardMetaData(metaData);
      });
  };

  useEffect(() => {
    getInvitations();
  }, []);
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
          {rewardMetaData?.accepted?.map((metadata, index) => (
            <RewardItem key={index} rewardItem={metadata} />
          ))}
        </Grid>
      )}
    </Box>
  );
};
export default RewardsInfo;
