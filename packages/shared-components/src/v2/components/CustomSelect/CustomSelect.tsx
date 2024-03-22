import {
  FormControl,
  Select,
  SelectProps,
  makeStyles,
} from "@material-ui/core";
import React, { FC } from "react";

const useStyles = makeStyles((theme) => ({
  formControl: ({ useFullBorder }: { useFullBorder: boolean }) => ({
    "& .MuiInputBase-root": {
      color: theme.palette.textBody,
      paddingLeft: "12px",
      paddingRight: "12px",
      borderRadius: useFullBorder ? 8 : "0px 8px 8px 0px",
      border: "1px solid",
      borderColor: theme.palette.borderColor,
      ...(!useFullBorder && { borderLeft: "none" }),
      height: "40px",
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
    marginLeft: 16,
  },
  paper: {
    margin: 0,
  },
  list: {
    paddingTop: 0,
    paddingBottom: 0,
    "& li": {
      paddingRight: 24,
      paddingTop: 8,
      paddingBottom: 8,
      fontSize: "12px",
    },
  },
}));

interface ICustomSelectProps extends SelectProps {
  useFullBorder?: boolean;
}
export const CustomSelect: FC<ICustomSelectProps> = ({
  useFullBorder = false,
  ...rest
}) => {
  const classes = useStyles({ useFullBorder });
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
