import React, { FC, ChangeEvent } from "react";
import { createUseStyles, useTheme } from "react-jss";

import { ITheme } from "@core-iframe/app/ui/lib/interfaces";
import { defaultDarkTheme } from "@core-iframe/app/ui/lib/theme";

const styleObject = {
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
      background: ({ theme }) =>
        (theme as ITheme).palette.button ?? (theme as ITheme).palette.primary,
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
};

type classListType = keyof typeof styleObject;

const useStyles = createUseStyles<classListType, {}, ITheme>(styleObject);
interface ISwitchProps {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
}
export const Switch: FC<ISwitchProps> = ({ checked, onChange, disabled }) => {
  const theme = useTheme<ITheme>() || defaultDarkTheme;
  const classes = useStyles({ theme });

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
