import { defaultDarkTheme } from "@web-integration/implementations/app/ui/lib/theme/index.js";
import { useState, useEffect } from "react";

const defaultBreakpoint = "md"; // Define your default breakpoint here

const breakpoints = defaultDarkTheme.breakPoints;

type BreakpointType = keyof typeof breakpoints;


export const useMedia = () => {
  const getBreakPoint = () => {
    if (typeof window !== "undefined") {
      const screenWidth = window.innerWidth;

      if (screenWidth < breakpoints.sm) {
        return "xs";
      } else if (screenWidth < breakpoints.md) {
        return "sm";
      } else if (screenWidth < breakpoints.lg) {
        return "md";
      } else if (screenWidth < breakpoints.xl) {
        return "lg";
      } else {
        return "xl";
      }
    }

    return defaultBreakpoint as BreakpointType;
  };

  const [currentBreakpoint, setCurrentBreakpoint] = useState<BreakpointType>(
    getBreakPoint()
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
