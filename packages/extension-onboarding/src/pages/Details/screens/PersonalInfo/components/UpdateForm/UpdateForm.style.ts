import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  info: {
    fontFamily: "'Roboto'",
    fontStyle: "normal",
    fontWeight: 700,
    fontSize: "20px",
    lineHeight: "26px",
    color: "#232039",
  },
  dividerText: {
    fontFamily: "Roboto",
    fontStyle: "normal",
    fontWeight: 700,
    fontSize: "20px",
    lineHeight: "20px",
    color: "#232039",
  },
  actionButton: {
    "& .MuiButton-label": {
      textTransform: "none",
      fontFamily: "Roboto",
      fontWeight: 500,
      color: "#8079B4",
    },
  },
  infoText: {
    fontFamily: "Roboto",
    fontSize: 12,
    fontWeight: 400,
    color: "#616161",
  },
  divider: {
    display: "flex",
    flex: 1,
    backgroundColor: "#D9D9D9",
    height: "1px",
  },
  googleButton: {
    width: "330px !important",
    height: "52px !important",
    border: "1px solid #D9D9D9 !important",
    borderRadius: "8px !important",
    fontFamily: "'Roboto !important",
    fontSize: "14px !important",
    fontWeight: 500,
    color: "black !important",
    justifyContent: "center",
  },
  formLabel: {
    fontSize: 16,
    fontWeight: 500,
    fontFamily: "Roboto",
    color: "#232039",
  },
  input: {
    height: 55,
    border: "1px solid #D9D9D9",
    fontFamily: "Roboto",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
    color: "#929292",
  },
  errorMessage: {
    margin: 0,
    marginRight: 14,
    color: "#f44336",
    fontSize: "0.75rem",
    marginTop: 3,
    textAlign: "left",
    fontWeight: 400,
    lineHeight: 1.66,
    letterSpacing: "0.03333em",
  },
  selectInput: {
    height: 55,
    border: "1px solid #D9D9D9",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
    "& .MuiSelect-nativeInput": {
      color: "#000 !important",
    },
    "& .MuiSelect-select:focus": {
      backgroundColor: "#fff !important",
    },
  },
}));

export const usePopoverStyles = makeStyles({
  paper: {
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
