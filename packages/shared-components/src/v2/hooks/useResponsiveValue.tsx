import { useMedia } from "@shared-components/v2/hooks/useMedia";

type BreakpointValues<T> = {
  xs?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
};

export const useResponsiveValue = () => {
  const currentBreakpoint = useMedia();

  const getResponsiveValue = <T,>(
    breakpoints: BreakpointValues<T>,
  ): T | undefined => {
    switch (currentBreakpoint) {
      case "xs":
        return (
          breakpoints.xs ??
          breakpoints.sm ??
          breakpoints.md ??
          breakpoints.lg ??
          breakpoints.xl
        );
      case "sm":
        return (
          breakpoints.sm ??
          breakpoints.xs ??
          breakpoints.md ??
          breakpoints.lg ??
          breakpoints.xl
        );
      case "md":
        return (
          breakpoints.md ??
          breakpoints.sm ??
          breakpoints.xs ??
          breakpoints.lg ??
          breakpoints.xl
        );
      case "lg":
        return (
          breakpoints.lg ??
          breakpoints.md ??
          breakpoints.sm ??
          breakpoints.xs ??
          breakpoints.xl
        );
      case "xl":
        return (
          breakpoints.xl ??
          breakpoints.lg ??
          breakpoints.md ??
          breakpoints.sm ??
          breakpoints.xs
        );
    }
  };

  return getResponsiveValue;
};
