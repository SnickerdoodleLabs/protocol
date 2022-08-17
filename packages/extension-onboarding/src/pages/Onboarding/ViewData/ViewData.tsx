import PersonalInfoCard from "@extension-onboarding/components/PersonalInfoCard";
import AccountsCard from "@extension-onboarding/components/AccountsCard";
import PrimaryButton from "@extension-onboarding/components/PrimaryButton";
import { useAppContext } from "@extension-onboarding/context/App";
import ChainData from "@extension-onboarding/pages/Onboarding/ViewData/components/ChainData";
import { useStyles } from "@extension-onboarding/pages/Onboarding/ViewData/ViewData.style";
import { Box, Typography } from "@material-ui/core";
import React, { FC } from "react";

const ViewData: FC = () => {
  const { changeStepperStatus } = useAppContext();

  const classes = useStyles();
  return (
    <Box>
      <Box display="flex">
        <Box>
          <h3 className={classes.buildYourProfileText}>View your Data</h3>
          <p className={classes.infoText}>
            This information is in your data wallet. You own this data and it
            cannot be shared with any other party unless you approve it!
          </p>

          <Box display="flex" alignItems="flex-start">
            <PersonalInfoCard />
            <Box
              style={{
                border: "1px solid #ECECEC",
                width: "685px",
                minHeight: "400px",
                height: "100%",
                borderRadius: 8,
                marginLeft: "24px",
                paddingBottom: "16px",
              }}
            >
              <Typography className={classes.cardTitle}>
                On-chain Info
              </Typography>
              <AccountsCard
                onButtonClick={console.log}
                buttonText="VIEW DETAILS"
              />
            </Box>
          </Box>
        </Box>
      </Box>
      <Box className={classes.buttonContainer}>
        <PrimaryButton
          type="submit"
          onClick={() => {
            changeStepperStatus("next");
          }}
        >
          Finish
        </PrimaryButton>
      </Box>
    </Box>
  );
};

export default ViewData;
