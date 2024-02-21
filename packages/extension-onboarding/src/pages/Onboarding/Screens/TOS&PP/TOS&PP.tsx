import Container from "@extension-onboarding/components/v2/Container";
import { PRIVACY_POLICY_URL, TERMS_OF_SERVICE_URL } from "@extension-onboarding/constants";
import { useAppContext } from "@extension-onboarding/context/App";
import { EOnboardingState } from "@extension-onboarding/objects/interfaces/IUState";
import {
  Toolbar,
  Box,
  Grid,
  makeStyles,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";
import {
  SDButton,
  SDCheckbox,
  SDTypography,
  colors,
} from "@snickerdoodlelabs/shared-components";
import React from "react";
export default () => {
  const classes = useStyles();
  const [checked, setChecked] = React.useState(false);
  const { uiStateUtils } = useAppContext();

  return (
    <>
      <Toolbar className={classes.toolbar}>
        <img src="https://storage.googleapis.com/dw-assets/spa/icons-v2/sdl-circle.svg" />
      </Toolbar>
      <Container>
        <Box mt={{ xs: 2, sm: 8 }} />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={7}>
            <SDTypography variant="displayLg" fontWeight="bold">
              Hooray! Get Started!
            </SDTypography>
            <Box mt={2} />
            <SDTypography variant="titleSm">
              Your Cookie Vault is ready!
            </SDTypography>
            <Box mt={2} />
            <SDCheckbox
              checked={checked}
              align="flex-start"
              onChange={() => {
                setChecked(!checked);
              }}
              label={
                <SDTypography mt={-0.5} variant="bodyLg">
                  By checking this box I agree to the Snickerdoodle <br />
                  <span
                    style={{ cursor: "pointer", textDecoration: "underline" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      window.open(TERMS_OF_SERVICE_URL, "_blank");
                    }}
                  >
                    Terms of Service
                  </span>
                  {` and `}
                  <span
                    style={{ cursor: "pointer", textDecoration: "underline" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      window.open(PRIVACY_POLICY_URL, "_blank");
                    }}
                  >
                    {` Privacy Policy.`}
                  </span>
                </SDTypography>
              }
            />
            <Box mt={10} />
            <SDButton
              onClick={() => {
                uiStateUtils.setOnboardingState(EOnboardingState.COMPLETED);
              }}
              disabled={!checked}
            >
              All Set
            </SDButton>
          </Grid>
          <Grid item xs={12} sm={5}>
            <img
              width="100%"
              src="https://storage.googleapis.com/dw-assets/spa/images-v2/onboarding-complete.svg"
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  toolbar: {
    backgroundColor: colors.DARKPURPLE500,
  },
}));
