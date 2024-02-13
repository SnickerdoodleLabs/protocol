import Container from "@extension-onboarding/components/v2/Container";
import { useAppContext } from "@extension-onboarding/context/App";
import { EOnboardingState } from "@extension-onboarding/objects/interfaces/IUState";
import AccountLinking from "@extension-onboarding/pages/Onboarding/Screens/Profile/AccountLinking";
import EMailForm from "@extension-onboarding/pages/Onboarding/Screens/Profile/EMailForm";
import SocialAccountLinking from "@extension-onboarding/pages/Onboarding/Screens/Profile/SocialAccountLinking";
import { Box, Grid, Toolbar, makeStyles } from "@material-ui/core";
import { SDTypography, colors } from "@snickerdoodlelabs/shared-components";
import React, { FC, useCallback } from "react";

interface IProfileProps {
  currentStep: EOnboardingState;
}

const ProfileSteps = {
  [EOnboardingState.CYRPTO_ACCOUNT_LINKING]: {
    index: 0,
    title: "Connect Your Wallets",
    description:
      "Link your wallets for seamless reward collection; sharing your anonymized web3 data enhances earning potential.",
    component: AccountLinking,
    image:
      "https://storage.googleapis.com/dw-assets/spa/images-v2/link-account.svg",
  },
  [EOnboardingState.SOCIAL_ACCOUNT_LINKING]: {
    index: 1,
    title: "Connect Your Socials",
    component: SocialAccountLinking,
    description:
      "Manage your social footprint with ease. Decide who sees what and unlock rewards for sharing your anonymized social data.",
    image:
      "https://storage.googleapis.com/dw-assets/spa/images-v2/link-social-account.svg",
  },
  [EOnboardingState.NEWSLETTER_SUBSCRIPTION]: {
    index: 2,
    title: "Get Updates",
    component: EMailForm,
    description:
      "Subscribe to our newsletter for the latest features and happenings at Snickerdoodle Labs.",
    image:
      "https://storage.googleapis.com/dw-assets/spa/images-v2/email-form.svg",
  },
};

const Profile: FC<IProfileProps> = ({ currentStep }) => {
  const { uiStateUtils } = useAppContext();
  const classes = useStyles();

  const handleStepComplete = (step: EOnboardingState) => {
    switch (step) {
      case EOnboardingState.CYRPTO_ACCOUNT_LINKING:
        uiStateUtils.setOnboardingState(
          EOnboardingState.SOCIAL_ACCOUNT_LINKING,
        );
        break;
      case EOnboardingState.SOCIAL_ACCOUNT_LINKING:
        uiStateUtils.setOnboardingState(
          EOnboardingState.NEWSLETTER_SUBSCRIPTION,
        );
        break;
      case EOnboardingState.NEWSLETTER_SUBSCRIPTION:
        uiStateUtils.setOnboardingState(EOnboardingState.TOS_PP);
        break;
    }
  };

  const getComponent = useCallback(() => {
    const C = ProfileSteps[currentStep].component;
    return (
      <C
        onComplete={() => {
          handleStepComplete(currentStep);
        }}
      />
    );
  }, [currentStep]);

  return (
    <>
      <Toolbar className={classes.toolbar}>
        <img src="https://storage.googleapis.com/dw-assets/spa/icons-v2/sdl-circle.svg" />
      </Toolbar>
      <Container>
        <Box pt={{ xs: 2, sm: 8 }} />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={7}>
            <Box
              display="flex"
              gridGap={12}
              mt={{ xs: 0, sm: 4 }}
              mb={{ xs: 2, sm: 4 }}
            >
              {Object.values(ProfileSteps).map((_, index) => (
                <Box
                  key={index}
                  width={44}
                  height={4}
                  borderRadius={7}
                  bgcolor={
                    index <= ProfileSteps[currentStep].index
                      ? colors.MAINPURPLE400
                      : colors.GREY300
                  }
                />
              ))}
            </Box>
            <SDTypography variant="displayMd" fontWeight="bold">
              {ProfileSteps[currentStep].title}
            </SDTypography>
            <Box mt={2} />
            <SDTypography variant="bodyLg">
              {ProfileSteps[currentStep].description}
            </SDTypography>
            <Box mt={2} />
            {getComponent()}
          </Grid>
          <Grid item xs={12} sm={5}>
            <img width="100%" src={ProfileSteps[currentStep].image} />
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

export default Profile;
