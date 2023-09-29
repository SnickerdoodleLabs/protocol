import React from "react";
import { createUseStyles, useTheme } from "react-jss";

import { ITheme } from "@web-integration/implementations/app/ui/lib/interfaces/index.js";
import { defaultDarkTheme } from "@web-integration/implementations/app/ui/lib/theme/index.js";

const styleObject = {
  spinner: {
    display: "inline-block",
    border: "4px solid rgba(0, 0, 0, 0.1)",
    borderTop: ({ theme }) => `4px solid ${(theme as ITheme).palette.primary}`,
    borderLeft: ({ theme }) => `4px solid ${(theme as ITheme).palette.primary}`,
    borderRadius: "50%",
    width: ({ size = 0 }) => (size ? size : 36),
    height: ({ size = 0 }) => (size ? size : 36),
    animation: "$spin 1s linear infinite",
  },
  "@keyframes spin": {
    from: {
      transform: "rotate(0deg)",
    },
    to: {
      transform: "rotate(360deg)",
    },
  },
};

type classListType = keyof typeof styleObject;

const useStyles = createUseStyles<classListType, ISpinnerProps, ITheme>(
  styleObject,
);

interface ISpinnerProps {
  size?: number;
}

export const Spinner = ({ size }: ISpinnerProps) => {
  const theme = useTheme<ITheme>() || defaultDarkTheme;
  const classes = useStyles({ size, theme });

  return <div className={classes.spinner}></div>;
};
