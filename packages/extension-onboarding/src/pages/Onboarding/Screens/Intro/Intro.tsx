import Container from "@extension-onboarding/components/v2/Container";
import { useAppContext } from "@extension-onboarding/context/App";
import { useThemeContext } from "@extension-onboarding/context/ThemeContext";
import { EOnboardingState } from "@extension-onboarding/objects/interfaces/IUState";
import { Box, Grid, Toolbar, makeStyles } from "@material-ui/core";
import {
  SDButton,
  SDTypography,
  useMedia,
} from "@snickerdoodlelabs/shared-components";
import clsx from "clsx";
import React, { FC, useState, useEffect, ReactNode } from "react";

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
  const { setBackground } = useThemeContext();
  const classes = useStyles({ activeColor, color });
  useEffect(() => {
    setBackground("#FFF3DE");
    return () => {
      setBackground();
    };
  }, []);

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
  const classes = useIntroStyles();
  const { uiStateUtils } = useAppContext();
  return (
    <>
      <Toolbar className={classes.toolbar}>
        <img src="https://storage.googleapis.com/dw-assets/spa/icons-v2/sdl-horizontal.svg" />
      </Toolbar>
      <Container>
        <Box pt={{ xs: 2, sm: 8 }} />
        <Grid
          container
          {...(media == "xs" && {
            style: {
              flexDirection: "column-reverse",
            },
          })}
        >
          <Grid item xs={12} sm={7}>
            <Box mt={{ xs: 0, sm: 4 }}>
              <StepperIndicators
                onClick={setStep}
                steps={STEPS.length}
                activeStep={step}
                color="#ddd"
                activeColor="#292648"
              />
              <Box mt={{ xs: 2, sm: 4 }} />
              <SDTypography variant="displayXl" fontFamily="shrikhand">
                {STEPS[step].title}
              </SDTypography>
              <Box mt={1} />
              {STEPS[step].subtitle && (
                <SDTypography variant="headlineSm" fontFamily="shrikhand">
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
          <Grid item xs={12} sm={5}>
            <Box width="100%" display="flex" justifyContent="center">
              <img
                width={media === "xs" ? "40%" : "100%"}
                height="auto"
                src={STEPS[step].image}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Intro;
