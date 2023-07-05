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

interface IButtonProps extends ButtonProps {
  buttonType: "primary" | "secondary";
}

const Button: FC<IButtonProps> = ({
  children,
  buttonType,
  ...restProps
}: IButtonProps) => {
  return buttonType === "secondary" ? (
    <CustomButtonSecondary {...restProps} variant="contained">
      {children}
    </CustomButtonSecondary>
  ) : (
    <CustomButtonPrimary {...restProps} variant="contained">
      {children}
    </CustomButtonPrimary>
  );
};

export default Button;
