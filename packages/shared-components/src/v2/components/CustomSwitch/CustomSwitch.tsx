import { makeStyles } from "@material-ui/core/styles";
import MuiSwitch, { SwitchProps } from "@material-ui/core/Switch";
import React, { FC } from "react";

import {
  colors,
  fontWeights,
  typograpyVariants,
} from "@shared-components/v2/theme";
export const SDCustomSwitch: FC<SwitchProps> = (props) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <MuiSwitch {...props} focusRipple={false} color="default" />
    </div>
  );
};
const commonTextStyles = {
  position: "absolute",
  ...typograpyVariants.bodyMd,
  ...fontWeights.medium,
  top: "50%",
  transform: "translateY(-50%)",
  transition: "all 0.3s",
};
const useStyles = makeStyles((theme) => ({
  root: {
    "*:focus": {
      outline: "none !important",
      boxShadow: "none !important",
    },
    "& .MuiSwitch-root": {
      width: 80,
      height: 32,
      borderRadius: 34,
      padding: 0,
      margin: 0,
    },
    "& .MuiSwitch-switchBase": {
      padding: 4,
      background: "transparent",
      "& .MuiSwitch-thumb": {
        width: 24,
        height: 24,
        position: "relative",
        "&::before": {
          content:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 14 14' fill='none'><path d='M3.5 10.5L10.5 3.5M3.5 3.5L10.5 10.5' stroke='%239E9E9E' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/></svg>\")",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -41%)",
        },
      },
      "&.Mui-checked": {
        transform: "translateX(48px)",
        "& .MuiSwitch-thumb": {
          "&::before": {
            content:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 14 14' fill='none'><path d='M11.4699 4.0835L5.55983 9.91683L2.56641 6.84665' stroke='%23289F8A' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/></svg>\")",
          },
        },
      },
    },
    "& .MuiSwitch-switchBase:not(.Mui-checked) + .MuiSwitch-track": {
      opacity: 1,
      backgroundColor: "#EEE",
      "&::after": {
        ...commonTextStyles,
        content: '"No"',
        color: colors.GREY500,
        right: 24,
      },
    },
    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
      backgroundColor: colors.MINT500,
      opacity: 1,
      "&::before": {
        content: '"Allow"',
        left: 12,
        color: colors.WHITE,
        ...commonTextStyles,
      },
    },
  },
}));
