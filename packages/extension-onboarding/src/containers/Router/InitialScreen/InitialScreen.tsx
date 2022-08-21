import Loading from "@extension-onboarding/containers/Router/InitialScreen/components/Loading";
import MobileScreen from "@extension-onboarding/containers/Router/InitialScreen/components/MobileScreen";
import WebScreen from "@extension-onboarding/containers/Router/InitialScreen/components/WebScreen";
import useIsMobile from "@extension-onboarding/hooks/useIsMobile";
import { Box } from "@material-ui/core";
import React, { useEffect, useMemo, useState } from "react";

MobileScreen;
const InitialScreen = () => {
  let timeout;

  const isMobile = useIsMobile();
  const [isTimeOutEnded, setIsTimeOutEnded] = useState<boolean>(false);

  useEffect(() => {
    timeout = setTimeout(onTimeOutEnded, 4000);
    return () => {
      clearTimeout(timeout);
    };
  }, []);
  useEffect(() => {
    if (isMobile) {
      clearTimeout(timeout);
    }
  }, [isMobile]);

  const onTimeOutEnded = () => {
    setIsTimeOutEnded(true);
  };

  const content = useMemo(() => {
    switch (true) {
      case isMobile: {
        return <MobileScreen />;
      }
      case isTimeOutEnded: {
        return <WebScreen />;
      }
      default: {
        return <Loading />;
      }
    }
  }, [isMobile, isTimeOutEnded]);
  return <Box>{content}</Box>;
};

export default InitialScreen;
