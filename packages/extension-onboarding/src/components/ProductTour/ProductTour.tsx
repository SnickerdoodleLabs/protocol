import pdTour from "@extension-onboarding/assets/images/pd-tour.svg";
import Button from "@extension-onboarding/components/Button/Button";
import ProductTourInitial from "@extension-onboarding/components/Modals/ProductTourInitial";
import ProductTourStart from "@extension-onboarding/components/Modals/ProductTourStart";
import { useStyles } from "@extension-onboarding/components/ProductTour/ProductTour.style";
import { EPaths } from "@extension-onboarding/containers/Router/Router.paths";
import { Box, Typography } from "@material-ui/core";
import React, { FC, useCallback, useMemo, useState } from "react";
import Joyride, {
  CallBackProps,
  Step,
  TooltipRenderProps,
} from "react-joyride";
import { useNavigate } from "react-router-dom";

export interface IProductTourProps {}

enum ETourState {
  INITIAL_MODAL,
  START_TOUR_MODAL,
  ACTIVE,
}

enum ETourCompleteState {
  COMPLETED = "COMPLETED",
}

const Tooltip = ({
  backProps,
  continuous,

  index,
  isLastStep,
  primaryProps,
  skipProps,
  step,
  closeProps,
  tooltipProps,
}: TooltipRenderProps) => {
  const classes = useStyles();
  return (
    <Box
      {...tooltipProps}
      maxWidth={475}
      borderRadius={16}
      overflow="hidden"
      bgcolor="#fff"
    >
      <Box>
        <img src={pdTour} width="100%" />
      </Box>
      <Box mt={1} mb={4} mx={2}>
        {step.title && (
          <Typography className={classes.title}>{step.title}</Typography>
        )}

        {step.content && (
          <Box mt={2}>
            <Typography className={classes.description}>
              {step.content}
            </Typography>
          </Box>
        )}
        <Box mt={5} display="flex">
          <Box ml="auto" display="flex" alignItems="center">
            {!isLastStep && (
              <Box mr={2}>
                <Button {...closeProps} buttonType="secondary">
                  Close
                </Button>
              </Box>
            )}
            <Button {...primaryProps}>{isLastStep ? "Done" : "Next"}</Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const steps: Step[] = [
  {
    title: "What is a Reward Marketplace?",
    target: `#sb-${0}`,
    disableBeacon: true,
    content: (
      <>
        You can browse and claim digital collectibles in<br />
         the marketplace.
        <br />
        Earn them by renting out your anonymized <br /> 
        data!
      </>
    ),
    placement: "right-start",
  },
  {
    title: "About My Data Dashboard",
    target: `#sb-${1}`,
    disableBeacon: true,
    content: (
      <>
        Link, view, anonymize, and monetize your data, all in one place. You are
        in control. No one has access to your raw data except you.
      </>
    ),
    placement: "right-start",
  },
  {
    title: "Manage privacy settings in a central location",
    target: `#sb-${2}`,
    disableBeacon: true,
    content: (
      <>
        Choose which data points to anonymize and rent out in exchange for
        rewards.
      </>
    ),
    placement: "right-start",
  },
  {
    title: "Link more accounts to get more rewards!",
    target: `#sb-link-account`,
    disableBeacon: true,
    content: (
      <>Linking additional wallets makes you eligible for more reward offers.
       It also allows you to view your NFTs and Tokens from all your accounts on your Data Dashboard.</>
    ),
    placement: "right-start",
  },
];

const ProductTour: FC<IProductTourProps> = ({}: IProductTourProps) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState<boolean>(
    localStorage.getItem("SDL_UserCompletedIntro") !==
      ETourCompleteState.COMPLETED,
  );
  const [tourState, setTourState] = useState<ETourState>(
    ETourState.INITIAL_MODAL,
  );

  const closeInitialModal = useCallback(() => {
    setTourState(ETourState.START_TOUR_MODAL);
  }, []);

  const startTour = useCallback(() => {
    setTourState(ETourState.ACTIVE);
  }, []);

  const endTour = () => {
    localStorage.setItem(
      "SDL_UserCompletedIntro",
      ETourCompleteState.COMPLETED,
    );
    setIsActive(false);
    navigate(EPaths.MY_REWARDS);
  };

  const handleCallBack = (data: CallBackProps) => {
    if (data.action === "next" && data.type === "step:after") {
      if (data.index === 0) {
        // navigate(EPaths.MY_REWARDS);
      }
      if (data.index === 1) {
        // navigate(EPaths.WEB3_SETTINGS);
      }
    }
    if (data.status === "finished" || data.action === "close") {
      // navigate(EPaths.HOME);
      endTour();
    }
  };

  const component = useMemo(() => {
    if (!isActive) {
      return null;
    }
    switch (tourState) {
      case ETourState.INITIAL_MODAL:
        return <ProductTourInitial onButtonClick={closeInitialModal} />;

      case ETourState.START_TOUR_MODAL:
        return (
          <ProductTourStart onNextClick={startTour} onCancelClick={endTour} />
        );
      case ETourState.ACTIVE:
        return (
          <Joyride
            continuous
            disableCloseOnEsc
            tooltipComponent={Tooltip}
            disableOverlayClose
            spotlightClicks={false}
            callback={handleCallBack}
            steps={steps}
          />
        );
      default:
        return null;
    }
  }, [tourState, isActive]);

  return <>{component}</>;
};
export default ProductTour;
