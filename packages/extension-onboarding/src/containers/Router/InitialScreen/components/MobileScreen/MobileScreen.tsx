import SwipeableViews from "react-swipeable-views";
import mobile1 from "@extension-onboarding/assets/images/mobile-sc1.svg";
import mobile2 from "@extension-onboarding/assets/images/mobile-sc2.svg";
import mobile3 from "@extension-onboarding/assets/images/mobile-sc3.svg";
import mobile4 from "@extension-onboarding/assets/images/mobile-sc4.svg";
import mobile5 from "@extension-onboarding/assets/images/mobile-sc5.svg";
import React, { useState } from "react";
import { MobileStepper } from "@material-ui/core";

const MobileScreen = () => {
  const [step, setStep] = useState<number>(0);
  console.log("hello");
  return (
    <>
      <SwipeableViews onChangeIndex={setStep} index={step}>
        <img style={{ width: "100%", height: "auto" }} src={mobile1} />
        <img style={{ width: "100%", height: "auto" }} src={mobile2} />
        <img style={{ width: "100%", height: "auto" }} src={mobile3} />
        <img style={{ width: "100%", height: "auto" }} src={mobile4} />
        <img style={{ width: "100%", height: "auto" }} src={mobile5} />
      </SwipeableViews>
      <MobileStepper
        variant="dots"
        steps={5}
        position="bottom"
        style={{ justifyContent: "center", background: "transparent" }}
        activeStep={step}
        backButton={null}
        nextButton={null}
      />
    </>
  );
};

export default MobileScreen;
