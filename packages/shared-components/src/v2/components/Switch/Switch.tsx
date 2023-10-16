import { Theme } from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/styles";
import React, { ChangeEvent, FC } from "react";

const useStyles = makeStyles((theme: Theme) => ({
  "sd-switchContainer": {
    alignItems: "center",
  },
  "sd-switchInput": {
    appearance: "none",
    width: "36px",
    height: "14px",
    borderRadius: "10px",
    position: "relative",
    cursor: "pointer",
    background: "#ccc",
    outline: "none",
    transition: "background 0.2s",
    "&:checked": {
      background: theme.palette.buttonColor ?? theme.palette.primary,
    },

    "&:before": {
      content: '""',
      position: "absolute",
      boxShadow: "rgba(0, 0, 0, 0.35) 0px 1px 3px",
      width: "20px",
      height: "20px",
      borderRadius: "50%",
      background: "#fff",
      top: -3,
      left: -1,
      transition: "transform 0.2s",
    },
    "&:checked:before": {
      transform: "translateX(18px)",
    },
    "&:disabled": {
      background: "#ccc",
      cursor: "not-allowed",
      "&:checked": {
        background: "#ccc",
      },
    },
  },
}));

interface ISwitchProps {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
}
export const SDSwitch: FC<ISwitchProps> = ({ checked, onChange, disabled }) => {
  const classes = useStyles();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange?.(event.target.checked);
  };

  return (
    <div className={classes["sd-switchContainer"]}>
      <input
        type="checkbox"
        className={classes["sd-switchInput"]}
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
      />
    </div>
  );
};
