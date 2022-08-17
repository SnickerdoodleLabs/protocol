import PersonalInfoCard from "@extension-onboarding/components/PersonalInfoCard";
import AccountsCard from "@extension-onboarding/components/AccountsCard";
import PrimaryButton from "@extension-onboarding/components/PrimaryButton";
import { useAppContext } from "@extension-onboarding/context/App";
import ChainData from "@extension-onboarding/pages/Onboarding/ViewData/components/ChainData";
import { useStyles } from "@extension-onboarding/pages/Onboarding/ViewData/ViewData.style";
import { Box, Typography } from "@material-ui/core";
import React, { FC } from "react";
import { IWindowWithSdlDataWallet } from "@extension-onboarding/services/interfaces/sdlDataWallet/IWindowWithSdlDataWallet";
import { useLayoutContext } from "@extension-onboarding/context/LayoutContext";
import { EModalSelectors } from "@extension-onboarding/components/Modals";
declare const window: IWindowWithSdlDataWallet;
const ViewData: FC = () => {
  const { changeStepperStatus } = useAppContext();
  const { setModal } = useLayoutContext();
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

            <Box ml={3}>
              <AccountsCard
                onButtonClick={(account) => {
                  setModal({
                    modalSelector: EModalSelectors.VIEW_ACCOUNT_DETAILS,
                    customProps: { account },
                    onPrimaryButtonClick: () => {},
                  });
                }}
                buttonText="VIEW DETAILS"
                topContent={
                  <Box>
                    <Typography className={classes.cardTitle}>
                      On-chain Info
                    </Typography>
                  </Box>
                }
                width={650}
                useDivider
              />
            </Box>
          </Box>
        </Box>
      </Box>
      <Box className={classes.buttonContainer}>
        <PrimaryButton
          type="submit"
          onClick={() => {
            window.sdlDataWallet.closeTab();
          }}
        >
          Finish
        </PrimaryButton>
      </Box>
    </Box>
  );
};

export default ViewData;
