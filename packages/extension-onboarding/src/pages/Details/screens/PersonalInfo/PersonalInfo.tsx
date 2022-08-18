import PersonalInfoCard from "@extension-onboarding/components/PersonalInfoCard";
import { useStyles } from "@extension-onboarding/pages/Details/screens/OnChainIfo/OnChainInfo.style";
import { Box, Typography } from "@material-ui/core";
import React, { FC } from "react";

const PersonalInfo: FC = () => {
  const classes = useStyles();
  return (
    <Box>
      <Box display="flex">
        <Box className={classes.yourLinkedAccountContainer}>
          <Box mb={2} mt={7}>
            <Typography className={classes.sectionTitle}>
              Your Linked Accounts
            </Typography>
          </Box>
          <PersonalInfoCard />
        </Box>
      </Box>
    </Box>
  );
};
export default PersonalInfo;
