import {
  FormControl,
  Select,
  SelectProps,
  makeStyles,
} from "@material-ui/core";
import { colors } from "@shared-components/v2/theme";
import React, { FC } from "react";

const useStyles = makeStyles((theme) => ({
  formControl: ({ height }: { useFullBorder: boolean; height: number }) => ({
    "& .MuiInputBase-root": {
      color: colors.MAINPURPLE500,
      paddingLeft: "10px",
      paddingRight: "10px",
      borderRadius: 40,
      backgroundColor: colors.MAINPURPLE50,
      height,
    },
    "& .MuiSelect-select.MuiSelect-select": {
      paddingRight: "0px",
    },
  }),
  select: {
    fontSize: "12px",
    "&:focus": {
      backgroundColor: "transparent",
    },
  },
  selectIcon: {
    position: "relative",
    top: "0px",
    color: "inherit",
    width: "18px",
    height: "18px",
    marginLeft: 13,
  },
  paper: {
    margin: 0,
    marginTop: 8,
    marginLeft: 12,
  },
  list: {
    paddingTop: 0,
    paddingBottom: 0,
    "& li": {
      color: colors.MAINPURPLE500,
      paddingRight: 36,
      paddingLeft: 10,
      paddingTop: 8,
      paddingBottom: 8,
    },
  },
}));

interface ICustomSelectProps extends SelectProps {
  useFullBorder?: boolean;
  height?: number;
}
export const CustomSelect: FC<ICustomSelectProps> = ({
  useFullBorder = false,
  height = 40,
  ...rest
}) => {
  const classes = useStyles({ useFullBorder, height });
  return (
    <FormControl className={classes.formControl}>
      <Select
        disableUnderline
        MenuProps={{
          classes: {
            list: classes.list,
            paper: classes.paper,
          },
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "center",
          },
          transformOrigin: {
            vertical: "top",
            horizontal: "center",
          },
          getContentAnchorEl: null,
        }}
        classes={{
          select: classes.select,
          icon: classes.selectIcon,
        }}
        {...rest}
      />
    </FormControl>
  );
};
