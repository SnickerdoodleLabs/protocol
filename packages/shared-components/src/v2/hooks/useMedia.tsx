import { Theme, useTheme } from "@material-ui/core";
import { useState, useEffect } from "react";

const defaultBreakpoint = "md"; // Define your default breakpoint here

export const useMedia = () => {
  const theme = useTheme<Theme>();

  const getBreakPoint = () => {
    if (typeof window !== "undefined") {
      const screenWidth = window.outerWidth;
      console.log(screenWidth, "screenWidth");

      if (screenWidth < theme.breakpoints.values.sm) {
        return "xs";
      } else if (screenWidth < theme.breakpoints.values.md) {
        return "sm";
      } else if (screenWidth < theme.breakpoints.values.lg) {
        return "md";
      } else if (screenWidth < theme.breakpoints.values.xl) {
        return "lg";
      } else {
        return "xl";
      }
    }

    return defaultBreakpoint;
  };

  const [currentBreakpoint, setCurrentBreakpoint] = useState<
    "xs" | "sm" | "md" | "lg" | "xl"
  >(getBreakPoint());

  console.log(theme.breakpoints.values.xs, "theme.breakpoints.values.xs"),
    console.log(theme.breakpoints.values.sm, "theme.breakpoints.values.sm"),
    console.log(theme.breakpoints.values.md, "theme.breakpoints.values.md"),
    console.log(theme.breakpoints.values.lg, "theme.breakpoints.values.lg"),
    console.log(currentBreakpoint, "currentBreakpoint");
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
