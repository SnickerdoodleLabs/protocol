import { Switch, SwitchProps, Theme, makeStyles } from "@material-ui/core";
import { colors } from "@shared-components/v2/theme/theme";
import clsx from "clsx";
import React, { FC } from "react";

interface SwitchV2Props extends SwitchProps {}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    marginLeft: 10,
    width: 44,
    height: 24,
    padding: 0,
  },
  switchBase: {
    padding: 2,
    "&$checked": {
      transform: "translateX(20px)",
      color: theme.palette.common.white,
      "& + $track": {
        opacity: 1,
        background: theme.palette.buttonColor || theme.palette.primary.main,
        bacgroundColor: "transparent",
        border: "none",
      },
    },
    "&$focusVisible $thumb": {},
  },
  thumb: {
    width: 20,
    height: 20,
    backgroundColor: colors.WHITE,
  },
  track: {
    backgroundColor: theme.palette.borderColor,
    borderRadius: 12,
  },
  checked: {},
  focusVisible: {},
}));

export const SDSwitch: FC<SwitchV2Props> = ({ classes, ...rest }) => {
  const _classes = useStyles();
  return (
    <Switch
      classes={{
        root: _classes.root,
        switchBase: clsx(_classes.switchBase, classes?.switchBase),
        thumb: _classes.thumb,
        track: _classes.track,
        checked: _classes.checked,
      }}
      {...rest}
    />
  );
};
