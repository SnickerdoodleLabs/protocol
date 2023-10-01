import { useState, useEffect } from "react";

import { breakPoints } from "@core-iframe/app/ui/lib/theme/theme.defaults";



const defaultBreakpoint = "md"; // Define your default breakpoint here

type BreakpointType = keyof typeof breakPoints;

export const useMedia = () => {
  const getBreakPoint = () => {
    if (typeof window !== "undefined") {
      const screenWidth = window.innerWidth;

      if (screenWidth < breakPoints.sm) {
        return "xs";
      } else if (screenWidth < breakPoints.md) {
        return "sm";
      } else if (screenWidth < breakPoints.lg) {
        return "md";
      } else if (screenWidth < breakPoints.xl) {
        return "lg";
      } else {
        return "xl";
      }
    }

    return defaultBreakpoint as BreakpointType;
  };

  const [currentBreakpoint, setCurrentBreakpoint] = useState<BreakpointType>(
    getBreakPoint(),
  );

  useEffect(() => {
    const handleMediaChange = () => {
      setCurrentBreakpoint(getBreakPoint());
    };

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleMediaChange);

      return () => {
        window.removeEventListener("resize", handleMediaChange);
      };
    }
    // Return a cleanup function that does nothing for SSR
    return () => {};
  }, []);

  return currentBreakpoint;
};
