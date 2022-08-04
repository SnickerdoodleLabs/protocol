import { Box, Grid, Typography } from "@material-ui/core";
import React, { FC } from "react";
import PrimaryButton from "@extension-onboarding/components/PrimaryButton";
import { useAppContext } from "@extension-onboarding/context/App";
import PersonalData from "./components/PersonalData";
import { useStyles } from "@extension-onboarding/pages/Onboarding/ViewData/ViewData.style";
import ChainData from "./components/ChainData";
import { countries } from "@extension-onboarding/constants/countries";

const ViewData: FC = () => {
  const { changeStepperStatus, linkedAccounts, getUserObject } =
    useAppContext();

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
            <Box
              style={{
                border: "1px solid #ECECEC",
                width: "500px",
                height: "400px",
                borderRadius: 8,
              }}
            >
              <Typography className={classes.cardTitle}>
                Personal Info
              </Typography>
              <PersonalData
                title="FULL NAME"
                information={`${getUserObject()?.given_name} ${
                  getUserObject()?.family_name
                }`}
              />
              <Box className={classes.divider}></Box>
              <PersonalData
                title="Date of Birth"
                information={getUserObject()?.date_of_birth}
              />
              <Box className={classes.divider}></Box>
              <PersonalData
                title="GENDER"
                information={getUserObject()?.gender}
              />
              <Box className={classes.divider}></Box>
              <PersonalData
                title="EMAIL"
                information={getUserObject()?.email_address}
              />
              <Box className={classes.divider}></Box>
              <PersonalData
                title="COUNTRY"
                information={
                  countries.find(
                    (country) =>
                      country.code == getUserObject()?.country_code ?? "US",
                  )?.name
                }
              />
            </Box>

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
              {linkedAccounts.map((account, index) => {
                return (
                  <Box>
                    <ChainData account={account} />
                    {index + 1 !== linkedAccounts.length && (
                      <Box className={classes.dividerChainData} />
                    )}
                  </Box>
                );
              })}
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
