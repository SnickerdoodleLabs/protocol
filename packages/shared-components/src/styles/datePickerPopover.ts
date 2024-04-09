import { makeStyles } from "@material-ui/core/styles";

export const useDatePickerPopoverStyles = makeStyles({
  paper: {
    "& .MuiTypography-subtitle1": {
      fontSize: 16,
    },
    "& .MuiTypography-h5": {
      fontSize: 18,
    },
    "& .MuiSvgIcon-root": {
      width: 24,
      height: 24,
    },
    "& .MuiTypography-body2": {
      fontSize: "12px",
    },
    "& .MuiTypography-caption": {
      fontSize: "14px",
    },
    "& .MuiPickersToolbarButton-toolbarBtn": {
      all: "unset",
      position: "absolute",
      cursor: "pointer",
      top: 12,
      left: 148,
      zIndex: 999,
    },
    "& .MuiPickersDatePickerRoot-toolbar": {
      all: "unset",
    },
    "& .MuiPickersToolbarText-toolbarTxt": {
      all: "unset",
      color: "transparent",
      fontSize: 0,
    },
    "& .MuiPickersCalendarHeader-switchHeader": {
      justifyContent: "flex-end",
    },
    "& .MuiPickersToolbarText-toolbarTxt::after": {
      content: '"⌄"',
      color: "#000",
      fontWeight: "bold",
      fontSize: 20,
    },
    "& .MuiPickersToolbarText-toolbarTxt.MuiTypography-h4": {
      display: "none",
    },
    "& .MuiPickersToolbarText-toolbarBtnSelected": {
      display: "none",
    },
    "& .MuiPickersDay-daySelected": {
      backgroundColor: "#5A5292",
      fontWeight: 700,
    },
    "& .MuiPickersCalendarHeader-transitionContainer": {
      all: "unset",
      "& .MuiTypography-alignCenter": {
        display: "none",
      },
      "& .MuiTypography-alignCenter:first-child": {
        all: "unset",
        fontFamily: "Roboto",
        fontSize: 16,
        fontWeight: "bold",
        position: "absolute",
        top: 20,
        left: 16,
        textAlign: "right",
        minWidth: 130,
      },
    },
    "& .MuiPickersCalendarHeader-iconButton": {
      "&:hover": {
        backgroundColor: "transparent",
      },
      "& .MuiIconButton-label": {
        color: "#000",
      },
    },
  },
});
