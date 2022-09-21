import { countries } from "@extension-onboarding/constants/countries";
import { useAppContext } from "@extension-onboarding/context/App";
import { useStyles } from "@extension-onboarding/pages/Details/screens/PersonalInfo/components/InfoCard/InfoCard.style";
import { PII } from "@extension-onboarding/services/interfaces/objects";
import { Box, Divider, Grid, Typography } from "@material-ui/core";

import React, { FC, useEffect, useState } from "react";

const InfoCard: FC = () => {
  const classes = useStyles();
  const [profile, setProfile] = useState<PII>(new PII());
  useEffect(() => {
    fillProfileData();
  }, []);
  const { dataWalletGateway } = useAppContext();

  const fillProfileData = () => {
    dataWalletGateway.profileService.getProfile().map((profileInfo) => {
      setProfile(profileInfo);
    });
  };
  const Item = (label, value) => {
    return (
      <Grid item sm={6}>
        <Grid container>
          <Grid item sm={6}>
            <Typography className={classes.itemLabel}>{label}</Typography>
          </Grid>
          <Grid item sm={6}>
            <Typography className={classes.itemLabel}>{value}</Typography>
          </Grid>
        </Grid>
        <Box mt={3}>
          <Divider />
        </Box>
      </Grid>
    );
  };
  return (
    <>
      <Grid container spacing={4}>
        {Item("Date of Birth", profile?.date_of_birth)}
        {Item(
          "Country",
          countries.find((country) => country.code === profile?.country_code)
            ?.name,
        )}
        {Item("Gender", profile?.gender)}
      </Grid>
    </>
  );
};
export default InfoCard;
