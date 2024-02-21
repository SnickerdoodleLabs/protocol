import { Theme, useTheme } from "@material-ui/core";
import { useState, useEffect, useMemo } from "react";

export const useMedia = () => {
  const [currentBreakpoint, setCurrentBreakpoint] = useState<
    "xs" | "sm" | "md" | "lg" | "xl"
  >("lg");

  const theme = useTheme<Theme>();

  const breakpoints: {
    name: "xs" | "sm" | "md" | "lg" | "xl";
    query: string;
  }[] = useMemo(() => {
    const { xs, sm, md, lg, xl } = theme.breakpoints.values;
    return [
      { name: "xs", query: `(max-width: ${sm - 1}px)` },
      {
        name: "sm",
        query: `(min-width: ${sm}px) and (max-width: ${md - 1}px)`,
      },
      {
        name: "md",
        query: `(min-width: ${md}px) and (max-width: ${lg - 1}px)`,
      },
      {
        name: "lg",
        query: `(min-width: ${lg}px) and (max-width: ${xl - 1}px)`,
      },
      { name: "xl", query: `(min-width: ${xl}px)` },
    ];
  }, [JSON.stringify(theme.breakpoints.values)]);

  useEffect(() => {
    const handleMediaChange = () => {
      const matchedBreakpoint = breakpoints.find(
        (breakpoint) => window.matchMedia(breakpoint.query).matches,
      );
      if (matchedBreakpoint) {
        setCurrentBreakpoint(matchedBreakpoint.name);
      }
    };
    // Call the handler initially
    handleMediaChange();

    // Add event listeners for all breakpoints
    breakpoints.forEach((breakpoint) => {
      const mediaQuery = window.matchMedia(breakpoint.query);
      mediaQuery.addEventListener("change", handleMediaChange);
    });

    // Clean up the event listeners
    return () => {
      breakpoints.forEach((breakpoint) => {
        const mediaQuery = window.matchMedia(breakpoint.query);
        mediaQuery.removeEventListener("change", handleMediaChange);
      });
    };
  }, [JSON.stringify(breakpoints)]);

  return currentBreakpoint;
};
