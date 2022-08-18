import CardItem from "@extension-onboarding/components/PersonalInfoCard/components/CardItem";
import { useStyles } from "@extension-onboarding/components/PersonalInfoCard/PersonalInfoCard.style";
import { countries } from "@extension-onboarding/constants/countries";
import { useAppContext } from "@extension-onboarding/context/App";
import { PII } from "@extension-onboarding/services/interfaces/objects";
import { Box, Typography } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";

import React, { useEffect, useState, ReactNode } from "react";

interface IPersonalInfoCardProps {
  topRightContent?: ReactNode;
}

const PersonalInfoCard = ({ topRightContent }: IPersonalInfoCardProps) => {
  const [profile, setProfile] = useState<PII>(new PII());
  useEffect(() => {
    fillProfileData();
  }, []);
  const { dataWalletGateway } = useAppContext();

  const fillProfileData = async () => {
    try {
      const profileInfo = await dataWalletGateway.profileService.getProfile();
      setProfile(profileInfo);
    } catch (e) {}
  };
  const classes = useStyles();
  return (
    <Box className={classes.container}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography className={classes.cardTitle}>Personal Info</Typography>
        {topRightContent && topRightContent}
      </Box>
      <CardItem
        title="FULL NAME"
        information={`${profile?.given_name} ${profile?.family_name}`}
      />
      <Box className={classes.divider}></Box>
      <CardItem title="Date of Birth" information={profile?.date_of_birth} />
      <Box className={classes.divider}></Box>
      <CardItem title="GENDER" information={profile?.gender} />
      <Box className={classes.divider}></Box>
      <CardItem title="EMAIL" information={profile?.email_address} />
      <Box className={classes.divider}></Box>
      <CardItem
        title="COUNTRY"
        information={
          countries.find((country) => country.code === profile?.country_code)
            ?.name
        }
      />
    </Box>
  );
};

export default PersonalInfoCard;
