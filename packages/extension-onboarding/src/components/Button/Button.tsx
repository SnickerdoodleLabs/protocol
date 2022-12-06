import { ButtonProps, Button as MaterialButton } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import React, { FC } from "react";

const CustomButtonPrimary = withStyles({
  root: {
    color: "#fff",
    fontStyle: "normal",
    fontFamily: "Inter",
    fontWeight: 500,
    fontSize: "14px",
    lineHeight: "17px",
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
    fontSize: "14px",
    lineHeight: "17px",
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
    backgroundColor: "#5A5292",
    "&:hover": {
      backgroundColor: "#5A5292",
    },
  },
})(MaterialButton);

interface IButtonProps extends ButtonProps {
  buttonType?: "primary" | "secondary" | "main";
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
    default:
      return (
        <CustomButtonMain {...restProps} variant="contained">
          {children}
        </CustomButtonMain>
      );
  }
};

export default Button;
