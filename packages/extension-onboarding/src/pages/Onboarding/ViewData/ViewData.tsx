import AccountsCard from "@extension-onboarding/components/AccountsCard";
import { EModalSelectors } from "@extension-onboarding/components/Modals";
import PersonalInfoCard from "@extension-onboarding/components/PersonalInfoCard";
import PrimaryButton from "@extension-onboarding/components/PrimaryButton";
import { LOCAL_STORAGE_SDL_INVITATION_KEY } from "@extension-onboarding/constants";
import { useAppContext } from "@extension-onboarding/context/App";
import { useLayoutContext } from "@extension-onboarding/context/LayoutContext";
import { useStyles } from "@extension-onboarding/pages/Onboarding/ViewData/ViewData.style";
import { IWindowWithSdlDataWallet } from "@extension-onboarding/services/interfaces/sdlDataWallet/IWindowWithSdlDataWallet";
import { Box, Grid, Typography } from "@material-ui/core";
import React, { FC } from "react";

declare const window: IWindowWithSdlDataWallet;
const ViewData: FC = () => {
  const { changeStepperStatus } = useAppContext();
  const { setModal } = useLayoutContext();
  const classes = useStyles();
  return (
    <Box>
      <Box>
        <Box>
          <h3 className={classes.buildYourProfileText}>View your Data</h3>
          <p className={classes.infoText}>
            This information is in your data wallet. You own this data and it
            cannot be shared with any other party unless you approve it!
          </p>

          <Grid container spacing={2}>
            <Grid item sm={5}>
              <PersonalInfoCard />
            </Grid>
            <Grid item sm={7}>
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
                useDivider
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Box className={classes.buttonContainer}>
        <PrimaryButton
          type="submit"
          onClick={() => {
            if (localStorage.getItem(LOCAL_STORAGE_SDL_INVITATION_KEY)) {
              const params = new URLSearchParams(
                JSON.parse(
                  localStorage.getItem(LOCAL_STORAGE_SDL_INVITATION_KEY)!,
                ),
              );
              sessionStorage.removeItem("appMode");
              window.open(
                window.location.origin + "?" + params.toString(),
                "_self",
              );
              return;
            }
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
