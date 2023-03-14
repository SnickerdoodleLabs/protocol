import { ButtonProps, Button as MaterialButton } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import React, { FC } from "react";

const CustomButtonPrimary = withStyles({
  root: {
    color: "#fff",
    fontStyle: "normal",
    fontFamily: "Inter",
    fontWeight: 500,
    height: 43,
    fontSize: "16px",
    lineHeight: "24px",
    textTransform: "none",
    backgroundColor: "#8079B4",
    "&:hover": {
      backgroundColor: "#6d65a9",
    },
  },
})(MaterialButton);

const CustomButtonSecondary = withStyles({
  root: {
    color: "#454165",
    textTransform: "none",
    boxShadow: "none",
    fontStyle: "normal",
    fontFamily: "Inter",
    fontWeight: 500,
    height: 43,
    fontSize: "16px",
    lineHeight: "24px",
    border: "1px solid",
    borderColor: "#B9B6D3",
    backgroundColor: "#fff",
    "&:hover": {
      backgroundColor: "#fff",
    },
  },
})(MaterialButton);

const CustomButtonMain = withStyles({
  root: {
    color: "#F2F4F7",
    textTransform: "none",
    boxShadow: "none",
    fontStyle: "normal",
    fontFamily: "Inter",
    fontSize: "16px",
    lineHeight: "24px",
    border: "1px solid",
    borderColor: "#B9B6D3",
    fontWeight: 500,
    height: 43,
    backgroundColor: "#8079B4",
    "&:hover": {
      backgroundColor: "#6d65a9",
    },
  },
})(MaterialButton);

const CustomButtonV2 = withStyles({
  root: {
    color: "#262626",
    borderRadius: 4,
    textTransform: "none",
    boxShadow: "0px 2px 0px rgba(0, 0, 0, 0.016)",
    fontStyle: "normal",
    fontFamily: "Public Sans",
    fontSize: "14px",
    lineHeight: "22px",
    border: "1px solid",
    borderColor: "#D9D9D9",
    fontWeight: 400,
    height: 40,
    backgroundColor: "#fff",
    "&:hover": {
      backgroundColor: "#fff",
    },
  },
})(MaterialButton);

const CustomButtonV2Danger = withStyles({
  root: {
    color: "#D15151",
    borderRadius: 4,
    textTransform: "none",
    boxShadow: "0px 2px 0px rgba(0, 0, 0, 0.016)",
    fontStyle: "normal",
    fontFamily: "Public Sans",
    fontSize: "14px",
    lineHeight: "22px",
    border: "1px solid",
    borderColor: "#D15151",
    fontWeight: 400,
    height: 40,
    backgroundColor: "#fff",
    "&:hover": {
      backgroundColor: "#fff",
    },
  },
})(MaterialButton);

interface IButtonProps extends ButtonProps {
  buttonType?: "primary" | "secondary" | "main" | "v2" | "v2Danger";
}

const Button: FC<IButtonProps> = ({
  children,
  buttonType = "main",
  ...restProps
}: IButtonProps) => {
  switch (buttonType) {
    case "secondary":
      return (
        <CustomButtonSecondary {...restProps} variant="contained">
          {children}
        </CustomButtonSecondary>
      );
    case "primary":
      return (
        <CustomButtonPrimary {...restProps} variant="contained">
          {children}
        </CustomButtonPrimary>
      );

    case "v2":
      return (
        <CustomButtonV2 {...restProps} variant="contained">
          {children}
        </CustomButtonV2>
      );
    case "v2Danger":
      return (
        <CustomButtonV2Danger {...restProps} variant="contained">
          {children}
        </CustomButtonV2Danger>
      );
    default:
      return (
        <CustomButtonMain {...restProps} variant="contained">
          {children}
        </CustomButtonMain>
      );
  }
};

export default Button;
