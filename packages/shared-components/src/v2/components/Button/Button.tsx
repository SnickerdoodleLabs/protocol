import { Button as MuiButton, Theme, ButtonProps } from "@material-ui/core";
import { withStyles, useTheme } from "@material-ui/styles";
import React from "react";

const customColors = ["danger", "button"] as const;

const customButtons = {
  danger: withStyles((theme: Theme) => ({
    root: {},
    contained: {
      backgroundColor: theme.palette.error.main,
      color: theme.palette.common.white,
      "&:hover": {
        backgroundColor: theme.palette.error.dark,
      },
    },
    outlined: {
      color: theme.palette.error.main,
      backgroundColor: "transparent",
      "&:hover": {
        borderColor: theme.palette.error.dark,
      },
      borderColor: theme.palette.error.main,
    },
    text: {
      color: theme.palette.error.main,
      backgroundColor: "transparent",
      borderColor: "transparent",
    },
  }))(MuiButton),
  button: withStyles((theme: Theme) => ({
    root: {
      color: theme.palette.buttonContrastColor,
      background: theme.palette.buttonColor,
      "&:hover": {
        background: theme.palette.buttonColor,
      },
    },
  }))(MuiButton),
};

interface IButtonProps extends Omit<ButtonProps, "color"> {
  color?: ButtonProps["color"] | (typeof customColors)[number];
}

export const SDButton = ({ className, color, ...rest }: IButtonProps) => {
  if (color && customColors.includes(color as (typeof customColors)[number])) {
    const CustomButton = customButtons[color];
    return <CustomButton {...rest} />;
  }

  return (
    <MuiButton
      color={color as ButtonProps["color"]}
      className={className}
      {...rest}
    />
  );
};
