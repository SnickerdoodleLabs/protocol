import { useMedia } from "@core-iframe/app/ui/lib/hooks";
import {
  IFlex,
  ITheme,
} from "@core-iframe/app/ui/lib/interfaces";
import {
  flexStyles,
  gridColumnStyles,
} from "@core-iframe/app/ui/lib/styles";
import { defaultDarkTheme } from "@core-iframe/app/ui/lib/theme";
import clsx from "clsx";
import React, {
  ReactNode,
  HTMLProps,
  Children,
  cloneElement,
  useMemo,
} from "react";
import { createUseStyles, useTheme } from "react-jss";

interface IGridProps extends HTMLProps<HTMLDivElement>, IFlex {
  children: ReactNode;
  container?: boolean;
  item?: boolean;
  spacing?: number;
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
}

const styleObject = {
  container: {
    boxSizing: "border-box",
    display: "flex",
    flexWrap: "wrap",
    margin: ({ spacing = 0, theme }) =>
      `-${(spacing / 2) * theme.constants.coef}px`,
    width: ({ spacing = 0, theme }) =>
      `calc(100% + ${spacing * theme.constants.coef}px)`,
  },
  item: {
    boxSizing: "border-box",
    flexBasis: "100%",
    maxWidth: "100%",
    flexGrow: 0,
    padding: ({ spacing = 0, theme }) =>
      `${(spacing / 2) * theme.constants.coef}px`,
  },
  ...gridColumnStyles,
  ...flexStyles,
};
type classListType = keyof typeof styleObject;

const useStyles = createUseStyles<classListType, Partial<IGridProps>, ITheme>(
  styleObject,
  { name: "sd-grid" },
);

export const Grid = ({
  container,
  spacing,
  children,
  className,
  xs,
  sm,
  md,
  lg,
  xl,
  ...rest
}: IGridProps) => {
  const theme = useTheme<ITheme>() || defaultDarkTheme;
  const classes = useStyles({ spacing, ...rest, theme });
  const currentMediaSize = useMedia();

  const itemColClass = useMemo(() => {
    if (container) {
      return undefined;
    }
    switch (currentMediaSize) {
      case "xs":
        return classes[`col-${xs || 12}`];
      case "sm":
        return classes[`col-${sm || xs || 12}`];
      case "md":
        return classes[`col-${md || sm || xs || 12}`];
      case "lg":
        return classes[`col-${lg || md || sm || xs || 12}`];
      case "xl":
        return classes[`col-${xl || lg || md || sm || xs || 12}`];
    }
  }, [currentMediaSize, xs, sm, md, lg, xl, container]);

  const containerClassNames = useMemo(() => {
    if (!container) {
      return undefined;
    }
    const classList: string[] = [];
    Object.keys(rest).forEach((key) => {
      const item = classes[key];
      if (item) {
        classList.push(item);
      }
    });
    return clsx([classes.container, ...classList, className]);
  }, [classes, className, rest, container]);

  if (container) {
    return (
      <div className={containerClassNames}>
        {Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return cloneElement(child, {
              spacing: spacing || 0,
            } as IGridProps);
          }
          return child;
        })}
      </div>
    );
  }
  return (
    <div className={clsx([classes.item, itemColClass, className])}>
      {children}
    </div>
  );
};
