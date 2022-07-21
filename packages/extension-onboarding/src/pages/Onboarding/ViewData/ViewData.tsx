import { Box, Grid, Typography } from "@material-ui/core";
import React, { FC } from "react";
import PrimaryButton from "@extension-onboarding/components/PrimaryButton";
import { useAppContext } from "@extension-onboarding/Context/App";
import PersonalData from "./components/PersonalData";
import { useStyles } from "@extension-onboarding/pages/Onboarding/ViewData/ViewData.style";
import ChainData from "./components/ChainData";

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

          <Box display="flex" alignItems="center">
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
              <PersonalData title="FULL NAME" information="Jane Morris" />
              <Box className={classes.divider}></Box>
              <PersonalData title="BIRTHDAY" information="Jane Morris" />
              <Box className={classes.divider}></Box>
              <PersonalData title="GENDER" information="Jane Morris" />
              <Box className={classes.divider}></Box>
              <PersonalData title="EMAIL" information="Jane Morris" />
              <Box className={classes.divider}></Box>
              <PersonalData title="COUNTRY" information="Jane Morris" />
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
              <ChainData
                account={{
                  name: "Metamask",
                  accountAddress: "0x1Fc43980F776357cAa2a2dc163c0be95BD49fF3e",
                  key: "metamask",
                }}
              />
              <Box className={classes.dividerChainData}></Box>
              <ChainData
                account={{
                  name: "Metamask",
                  accountAddress: "0x1Fc43980F776357cAa2a2dc163c0be95BD49fF3e",
                  key: "metamask",
                }}
              />
              <Box className={classes.dividerChainData}></Box>
              <ChainData
                account={{
                  name: "Metamask",
                  accountAddress: "0x1Fc43980F776357cAa2a2dc163c0be95BD49fF3e",
                  key: "metamask",
                }}
              />
              <Box className={classes.dividerChainData}></Box>
              <ChainData
                account={{
                  name: "Metamask",
                  accountAddress: "0x1Fc43980F776357cAa2a2dc163c0be95BD49fF3e",
                  key: "metamask",
                }}
              />
              <Box className={classes.dividerChainData}></Box>
              <ChainData
                account={{
                  name: "Metamask",
                  accountAddress: "0x1Fc43980F776357cAa2a2dc163c0be95BD49fF3e",
                  key: "metamask",
                }}
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
