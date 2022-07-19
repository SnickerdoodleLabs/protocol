import { Button, makeStyles,ButtonProps } from '@material-ui/core';
import React, { FC } from 'react'
import clsx from "clsx";

export interface IPrimaryButtonProps extends ButtonProps{
    
}

const PrimaryButton:FC<IPrimaryButtonProps> =({children,className,...restProps}) => {
    const classes = useStyles();
  return (
    <Button
    variant="outlined"
    color="primary"
    {...restProps}
    className={clsx(classes.primaryButton,{
     
      ...(className && { [className]: true }),
    })}
  >
   {children}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 17 16"
      fill="#fff"
      fillRule="evenodd"
      strokeLinecap="square"
      strokeWidth={2}
      stroke="#fff"
      aria-hidden="true"
      className={classes.primaryButtonIcon}
    >
      <path d="M1.808 14.535 14.535 1.806" className="arrow-body" />
      <path
        d="M3.379 1.1h11M15.241 12.963v-11"
        className="arrow-head"
      />
    </svg>
  </Button>
  )
}

const useStyles = makeStyles({
    primaryButton: {
      textTransform: "unset",
      padding: "21px 36px 10px 22px",
      boxShadow: "8px 8px 0px 0px rgb(0 0 0)",
      background: "#8079B4",
      color: "#fff",
      borderColor: "#000",
      borderRadius: 0,
      "&:hover": {
        backgroundColor: "black",
        borderColor: "inherit",
      },
    },
    primaryButtonIcon: {
      position: "absolute",
      top: 4,
      right: 4,
      width: 14,
    },
  });
  export default PrimaryButton;