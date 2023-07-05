import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Checkbox, { CheckboxProps } from "@material-ui/core/Checkbox";

const useStyles = makeStyles({
  root: {
    "&:hover": {
      backgroundColor: "transparent",
    },
  },
  icon: {
    width: 16,
    height: 16,
    border: "1px solid #D0D5DD",
    borderRadius: 4,
    backgroundColor: "#fff",
    "$root.Mui-focusVisible &": {
      outline: "2px auto rgba(19,124,189,.6)",
      outlineOffset: 2,
    },
    "input:hover ~ &": {
      backgroundColor: "#fff",
    },
    "input:disabled ~ &": {
      boxShadow: "none",
      background: "rgba(206,217,224,.5)",
    },
  },
  checkedIcon: {
    backgroundColor: "#fff",
    borderRadius: 3,
    // backgroundImage:
    //   "linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))",
    "&:before": {
      display: "block",
      width: 16,
      height: 16,
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none'%3E%3Cg%3E%3Ctitle%3ELayer 1%3C/title%3E%3Cpath fill='none' id='svg_1' stroke-linejoin='round' stroke-linecap='round' stroke-width='1.6666' stroke='%23252525' d='m12,5.25l-5.5,5.5l-2.5,-2.5'/%3E%3C/g%3E%3C/svg%3E%0A")`,
      content: '""',
    },
    "input:hover ~ &": {
      backgroundColor: "#F9F9F9",
    },
  },
});

export default (props: CheckboxProps) => {
  const classes = useStyles();

  return (
    <Checkbox
      className={classes.root}
      disableRipple
      color="default"
      checkedIcon={<span className={clsx(classes.icon, classes.checkedIcon)} />}
      icon={<span className={classes.icon} />}
      inputProps={{ "aria-label": "decorative checkbox" }}
      {...props}
    />
  );
};
