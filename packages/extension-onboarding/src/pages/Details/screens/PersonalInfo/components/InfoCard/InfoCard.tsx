import { countries } from "@extension-onboarding/constants/countries";
import { useAppContext } from "@extension-onboarding/context/App";
import { useStyles } from "@extension-onboarding/pages/Details/screens/PersonalInfo/components/InfoCard/InfoCard.style";
import { PII } from "@extension-onboarding/services/interfaces/objects";
import { Box, Button, Divider, Grid, Typography } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import React, { FC, useEffect, useState } from "react";

interface IInfoCardProps {
  onEditClick: () => void;
}

const InfoCard: FC<IInfoCardProps> = ({ onEditClick }) => {
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
    <Box
      mt={4}
      bgcolor="#FCFCFC"
      p={3}
      pt={4}
      border="1px solid #ECECEC"
      borderRadius={8}
    >
      <Box display="flex">
        <Box display="flex" marginLeft="auto">
          <Button onClick={onEditClick} className={classes.actionButton}>
            <EditIcon />
            Edit
          </Button>
        </Box>
      </Box>
      <Grid container spacing={4}>
        {Item("Date of Birth", profile?.date_of_birth)}
        {Item(
          "Country",
          countries.find((country) => country.code === profile?.country_code)
            ?.name,
        )}
        {Item("Gender", profile?.gender)}
      </Grid>
    </Box>
  );
};
export default InfoCard;
