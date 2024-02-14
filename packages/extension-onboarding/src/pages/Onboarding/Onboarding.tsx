import { useAppContext } from "@extension-onboarding/context/App";
import { EOnboardingState } from "@extension-onboarding/objects/interfaces/IUState";
import Intro from "@extension-onboarding/pages/Onboarding/Screens/Intro";
import Profile from "@extension-onboarding/pages/Onboarding/Screens/Profile";
import TOS_PP from "@extension-onboarding/pages/Onboarding/Screens/TOS&PP";
import React, { FC, useState, useMemo, useEffect } from "react";

const Onboarding: FC = () => {
  const { onboardingState } = useAppContext();

  const renderStep = useMemo(() => {
    switch (onboardingState) {
      case EOnboardingState.INTRO:
        return <Intro />;
      case EOnboardingState.CYRPTO_ACCOUNT_LINKING:
      case EOnboardingState.SOCIAL_ACCOUNT_LINKING:
        // case EOnboardingState.NEWSLETTER_SUBSCRIPTION:
        return <Profile currentStep={onboardingState} />;
      case EOnboardingState.TOS_PP:
        return <TOS_PP />;
      default:
        return null;
    }
  }, [onboardingState]);

  return renderStep;
};

export default Onboarding;
