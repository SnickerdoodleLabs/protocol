import Container from "@extension-onboarding/components/v2/Container";
import { useAppContext } from "@extension-onboarding/context/App";
import { useThemeContext } from "@extension-onboarding/context/ThemeContext";
import { EOnboardingState } from "@extension-onboarding/objects/interfaces/IUState";
import { Box, Grid, Toolbar, makeStyles } from "@material-ui/core";
import {
  SDButton,
  SDTypography,
  useMedia,
  useResponsiveValue,
} from "@snickerdoodlelabs/shared-components";
import clsx from "clsx";
import React, { FC, useState, useEffect, ReactNode, useMemo } from "react";

interface IStep {
  title: ReactNode;
  subtitle?: string;
  description: ReactNode;
  image: string;
}

const STEPS: IStep[] = [
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
interface IIntroProps {
  onIntroComplete: () => void;
}

const useStyles = makeStyles((theme) => ({
  wrapper: ({ color }: { activeColor: string; color: string }) => ({
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 20,
    height: 20,
    borderRadius: 10,
    borderColor: "transparent",
    border: `1px solid`,
    "&:hover": {
      borderColor: color,
    },
  }),
  wrapperActive: ({ activeColor }: { activeColor: string; color: string }) => ({
    cursor: "default",
    borderColor: activeColor,
    "&:hover": {
      borderColor: activeColor,
    },
    transition: "border-color 0.5s",
  }),
  item: ({ color }: { activeColor: string; color: string }) => ({
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: color,
  }),
  itemActive: ({ activeColor }: { activeColor: string; color: string }) => ({
    backgroundColor: activeColor,
    transition: "background-color 0.5s",
  }),
}));

const StepperIndicators: FC<{
  steps: number;
  activeStep: number;
  activeColor: string;
  color: string;
  onClick: (index: number) => void;
}> = ({ steps, activeStep, activeColor, color, onClick }) => {
  const classes = useStyles({ activeColor, color });

  return (
    <Box display="flex" alignItems="center">
      {Array.from({ length: steps }).map((_, index) => {
        return (
          <Box
            mr={1.25}
            key={`${index}.dot`}
            onClick={() => {
              if (index != activeStep) onClick(index);
            }}
            className={clsx(classes.wrapper, {
              [classes.wrapperActive]: index == activeStep,
            })}
          >
            <Box
              className={clsx(classes.item, {
                [classes.itemActive]: index == activeStep,
              })}
            />
          </Box>
        );
      })}
    </Box>
  );
};

const useIntroStyles = makeStyles((theme) => ({
  toolbar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },

  container: {
    "& .MuiDialog-paper": {
      borderRadius: 12,
      maxWidth: 640,
      [theme.breakpoints.down("xs")]: {
        margin: 8,
      },
    },
    "& .MuiDialog-paperFullWidth": {
      overflow: "visible",
      [theme.breakpoints.down("xs")]: {
        width: "unset",
        minWidth: "90%",
      },
    },
  },
}));

const Intro: FC = () => {
  const [step, setStep] = useState(0);
  const media = useMedia();
  const getResponsiveValue = useResponsiveValue();
  const classes = useIntroStyles();
  const { uiStateUtils } = useAppContext();
  const { setBackground } = useThemeContext();
  useEffect(() => {
    setBackground("#FFF3DE");
    return () => {
      setBackground();
    };
  }, []);

  const render = useMemo(() => {
    if (media === "xs") {
      return (
        <Box
          width="100%"
          minHeight="calc(100vh - 56px)"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexDirection="column"
        >
          <>
            <Box pt={3} />
            <img width="50%" height="auto" src={STEPS[step].image} />
            <Box mt={3} />
            <SDTypography
              align="center"
              variant="headlineLg"
              fontFamily="shrikhand"
            >
              {STEPS[step].title}
            </SDTypography>
            {STEPS[step].subtitle && (
              <SDTypography
                mt={1.5}
                align="center"
                variant="titleLg"
                fontFamily="shrikhand"
              >
                {STEPS[step].subtitle}
              </SDTypography>
            )}
            <SDTypography mt={3} align="center" variant="titleMd">
              {STEPS[step].description}
            </SDTypography>
          </>
          <Box
            mt="auto"
            width="100%"
            alignItems={"center"}
            mb={1.5}
            display="flex"
            flexDirection="column"
          >
            <StepperIndicators
              onClick={setStep}
              steps={STEPS.length}
              activeStep={step}
              color="#ddd"
              activeColor="#292648"
            />
            <Box mt={4} />
            <SDButton
              fullWidth
              onClick={
                step === STEPS.length - 1
                  ? () => {
                      uiStateUtils.setOnboardingState(
                        EOnboardingState.CYRPTO_ACCOUNT_LINKING,
                      );
                    }
                  : () => {
                      setStep(step + 1);
                    }
              }
              variant="contained"
              color="primary"
            >
              {step == 0 ? "Start" : "Next"}
            </SDButton>
          </Box>
        </Box>
      );
    } else {
      return (
        <>
          <Box pt={8} />
          <Grid container>
            <Grid item xs={7}>
              <Box mt={4}>
                <StepperIndicators
                  onClick={setStep}
                  steps={STEPS.length}
                  activeStep={step}
                  color="#ddd"
                  activeColor="#292648"
                />
                <Box mt={4} />
                <SDTypography variant="displayLg" fontFamily="shrikhand">
                  {STEPS[step].title}
                </SDTypography>

                {STEPS[step].subtitle && (
                  <SDTypography
                    mt={1}
                    variant="headlineSm"
                    fontFamily="shrikhand"
                  >
                    {STEPS[step].subtitle}
                  </SDTypography>
                )}
                <Box mt={4} />
                <SDTypography variant="titleMd">
                  {STEPS[step].description}
                </SDTypography>
                <Box mt={6} />
                <SDButton
                  onClick={
                    step === STEPS.length - 1
                      ? () => {
                          uiStateUtils.setOnboardingState(
                            EOnboardingState.CYRPTO_ACCOUNT_LINKING,
                          );
                        }
                      : () => {
                          setStep(step + 1);
                        }
                  }
                  variant="contained"
                  color="primary"
                >
                  {step == 0 ? "Start" : "Next"}
                </SDButton>
              </Box>
            </Grid>
            <Grid item xs={5}>
              <Box width="100%" display="flex" justifyContent="center">
                <img width="100%" height="auto" src={STEPS[step].image} />
              </Box>
            </Grid>
          </Grid>
        </>
      );
    }
  }, [media === "xs", step]);

  return (
    <>
      <Toolbar className={classes.toolbar}>
        <img src="https://storage.googleapis.com/dw-assets/spa/icons-v2/sdl-horizontal.svg" />
      </Toolbar>
      <Container>{render}</Container>
    </>
  );
};

export default Intro;
