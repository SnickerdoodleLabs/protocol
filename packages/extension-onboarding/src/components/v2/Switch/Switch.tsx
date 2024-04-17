import { SwitchProps } from "@material-ui/core/Switch";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import { SDSwitch, colors } from "@snickerdoodlelabs/shared-components";
import React from "react";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    custom: {
      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
        backgroundColor: colors.MAINPURPLE900,
        background: "unset",
      },
    },
  }),
);
const Switch: React.FC<SwitchProps> = ({ classes, ...rest }) => {
  const _classes = useStyles();
  return <SDSwitch {...rest} className={_classes.custom} />;
};

export default Switch;
