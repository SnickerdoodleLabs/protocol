import Container from "@extension-onboarding/components/v2/Container";
import {
  PRIVACY_POLICY_URL,
  TERMS_OF_SERVICE_URL,
} from "@extension-onboarding/constants";
import { useAppContext } from "@extension-onboarding/context/App";
import { useDataWalletContext } from "@extension-onboarding/context/DataWalletContext";
import { useThemeContext } from "@extension-onboarding/context/ThemeContext";
import { EOnboardingState } from "@extension-onboarding/objects/interfaces/IUState";
import StepIndicators from "@extension-onboarding/pages/Onboarding//StepIndicators";
import StepRenderer from "@extension-onboarding/pages/Onboarding//StepRenderer";
import { Toolbar, makeStyles } from "@material-ui/core";
import { SDCheckbox, SDTypography } from "@snickerdoodlelabs/shared-components";
import React, { FC, useMemo, useEffect, ReactNode, useCallback } from "react";

const Onboarding: FC = () => {
  const { sdlDataWallet } = useDataWalletContext();
  const { onboardingState, uiStateUtils } = useAppContext();
  const { setBackground } = useThemeContext();
  const [currentStepIndex, setCurrentStepIndex] = React.useState(0);
  const [checked, setChecked] = React.useState(false);
  const classes = useStyles();

  useEffect(() => {
    setBackground("#FFF3DE");
    return () => {
      setBackground();
    };
  }, []);

  useEffect(() => {
    if (onboardingState === EOnboardingState.TOS_PP) {
      setCurrentStepIndex(INTRO_STEPS.length);
    }
  }, [onboardingState]);

  const totalSteps = useMemo(() => INTRO_STEPS.length + 1, []);
  const indicator = useMemo(() => {
    return (
      <StepIndicators
        steps={totalSteps}
        activeStep={currentStepIndex}
        onClick={(index) => {}}
        color="#ddd"
        activeColor="#292648"
      />
    );
  }, [currentStepIndex]);

  const onCompleted = useCallback(() => {
    sdlDataWallet.requestOptIn().map(() => {
      uiStateUtils.setOnboardingState(EOnboardingState.COMPLETED);
    });
  }, []);

  const renderStep = useMemo(() => {
    if (currentStepIndex === INTRO_STEPS.length) {
      return (
        <StepRenderer
          title="Almost done!"
          description="Your new Cookie Vault is just about ready to use"
          image="https://storage.googleapis.com/dw-assets/spa/images-v2/onboarding-complete.svg"
          btnDisabled={!checked}
          renderItem={
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
          }
          btnText="Finish"
          indicators={indicator}
          onClick={onCompleted}
        />
      );
    } else {
      const step = INTRO_STEPS[currentStepIndex];
      return (
        <StepRenderer
          title={step.title}
          subtitle={step.subtitle}
          description={step.description}
          image={step.image}
          indicators={indicator}
          onClick={() => {
            if (currentStepIndex === INTRO_STEPS.length - 1) {
              uiStateUtils.setOnboardingState(EOnboardingState.TOS_PP);
            } else {
              setCurrentStepIndex(currentStepIndex + 1);
            }
          }}
          btnText={currentStepIndex === 0 ? "Start" : "Next"}
        />
      );
    }
  }, [currentStepIndex, checked, indicator]);

  return (
    <>
      <Toolbar className={classes.toolbar}>
        <img src="https://storage.googleapis.com/dw-assets/spa/icons-v2/sdl-horizontal.svg" />
      </Toolbar>
      <Container>{renderStep}</Container>
    </>
  );
};

interface IIntroStep {
  title: ReactNode;
  subtitle?: string;
  description: ReactNode;
  image: string;
}

const INTRO_STEPS: IIntroStep[] = [
  {
    title: (
      <span>
        Welcome to your
        <br />
        Cookie Vault
      </span>
    ),
    subtitle: "powered by Snickerdoodle",
    description: (
      <span>
        Your secure space to control your data and earn rewards for sharing
        <br />
        insights - all on your terms.
      </span>
    ),
    image: "https://storage.googleapis.com/dw-assets/spa/images-v2/intro-1.svg",
  },
  {
    title: (
      <span>
        Control your
        <br />
        data
      </span>
    ),
    description: (
      <span>
        Store and manage your data securely on your device, your data is only
        <br /> shared when you say so. You are ALWAYS in control.
      </span>
    ),
    image: "https://storage.googleapis.com/dw-assets/spa/images-v2/intro-2.svg",
  },
  {
    title: (
      <span>
        Earn rewards
        <br />
        for sharing
      </span>
    ),
    description: (
      <span>
        Share your anonymized data securely and help shape the future of
        <br />
        products and services. In return, enjoy exclusive rewards from brands
        <br />
        that value your insights.
      </span>
    ),
    image: "https://storage.googleapis.com/dw-assets/spa/images-v2/intro-3.svg",
  },
];

const useStyles = makeStyles((theme) => ({
  toolbar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
}));
export default Onboarding;
