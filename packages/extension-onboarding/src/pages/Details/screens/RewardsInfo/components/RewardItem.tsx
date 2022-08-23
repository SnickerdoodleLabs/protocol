import PersonalInfoCard from "@extension-onboarding/components/PersonalInfoCard";
import PrimaryButton from "@extension-onboarding/components/PrimaryButton";
import ProfileForm from "@extension-onboarding/components/ProfileForm/ProfileForm";
import { useStyles } from "@extension-onboarding/pages/Details/screens/RewardsInfo/RewardsInfo.style";
import { Box, Button, Grid, Typography } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import { IOpenSeaMetadata } from "@snickerdoodlelabs/objects";
import React, { FC, useMemo, useState } from "react";

interface RewardItemProps {
  rewardItem: IOpenSeaMetadata;
  rejected?: boolean;
}
const RewardItem: FC<RewardItemProps> = ({ rewardItem, rejected = false }) => {
  const classes = useStyles();

  return (
    <Grid item xs={12} sm={3}>
      <Box
        width="100%"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        textAlign="center"
        border="1px solid #D9D9D9"
        borderRadius={8}
        style={{ ...(rejected && { opacity: 0.5 }) }}
      >
        <Box mx="auto" p={2} minHeight="120">
          <img
            width="100%"
            style={{ aspectRatio: "4/3" }}
            src={rewardItem.image}
          />
        </Box>

        <Box my={2}>
          <Typography>{rewardItem.rewardName}</Typography>
        </Box>
      </Box>
    </Grid>
  );
};
export default RewardItem;
