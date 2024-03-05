import { Button as MuiButton, Theme, ButtonProps } from "@material-ui/core";
import { withStyles, useTheme } from "@material-ui/styles";
import React from "react";

const customColors = ["danger", "warn", "button"] as const;

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
        borderColor: theme.palette.error.main,
      },
      borderColor: theme.palette.error.main,
    },
    text: {
      color: theme.palette.error.main,
      backgroundColor: "transparent",
      borderColor: "transparent",
    },
  }))(MuiButton),
  warn: withStyles((theme: Theme) => ({
    root: {},
    contained: {
      backgroundColor: theme.palette.warning.main,
      color: theme.palette.common.white,
      "&:hover": {
        backgroundColor: theme.palette.warning.dark,
      },
    },
    outlined: {
      color: theme.palette.warning.main,
      backgroundColor: "transparent",
      "&:hover": {
        borderColor: theme.palette.warning.main,
      },
      borderColor: theme.palette.warning.main,
    },
    text: {
      color: theme.palette.warning.main,
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

interface CustomButtonProps extends Omit<ButtonProps, "color"> {
  color?: string;
}

const CustomColoredButton = withStyles((theme: Theme) => ({
  root: {},
  text: (props: CustomButtonProps) => ({
    color: props.color,
    "&:hover": {
      backgroundColor: "transparent",
      color: props.color,
    },
  }),
  outlined: (props: CustomButtonProps) => ({
    color: props.color,
    border: `2px solid ${props.color}`,
    "&:hover": {
      backgroundColor: props.color,
      color: theme.palette.common.white,
      border: `2px solid ${props.color}`,
    },
  }),
  contained: (props: CustomButtonProps) => ({
    color: theme.palette.common.white,
    backgroundColor: props.color,
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
      color: theme.palette.common.white,
    },
  }),
}))(({ color, ...rest }: CustomButtonProps) => {
  return <MuiButton {...rest} />;
});

interface IButtonProps extends Omit<ButtonProps, "color"> {
  color?: ButtonProps["color"] | (typeof customColors)[number] | string;
}

const validMuiButtonColors: ButtonProps["color"][] = [
  "default",
  "inherit",
  "primary",
  "secondary",
  undefined,
];

export const SDButton = ({ className, color, ...rest }: IButtonProps) => {
  if (color && customColors.includes(color as (typeof customColors)[number])) {
    const CustomButton = customButtons[color];
    return <CustomButton {...rest} />;
  }
  if (validMuiButtonColors.includes(color as ButtonProps["color"])) {
    return (
      <MuiButton
        color={color as ButtonProps["color"]}
        className={className}
        {...rest}
      />
    );
  }
  return <CustomColoredButton color={color as string} {...rest} />;
};
