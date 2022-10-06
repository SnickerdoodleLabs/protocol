import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  title: {
    fontFamily: "Shrikhand",
    fontSize: 36,
    fontWeight: 400,
    color: "#232039",
  },
  description: {
    fontFamily: "Space Grotesk",
    fontWeight: 400,
    fontSize: 18,
    lineHeight: "23px",
  },
  info: {
    fontFamily: "'Space Grotesk'",
    fontStyle: "normal",
    fontWeight: 700,
    fontSize: "20px",
    lineHeight: "26px",
    color: "#232039",
  },
  dividerText: {
    fontFamily: "'Space Grotesk'",
    fontStyle: "normal",
    fontWeight: 700,
    fontSize: "20px",
    lineHeight: "20px",
    color: "#232039",
  },
  itemLabel: {
    fontFamily: "'Space Grotesk'",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "16px",
    lineHeight: "20px",
    color: "#5D5A74",
  },
  itemValue: {
    fontFamily: "'Space Grotesk'",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "16px",
    lineHeight: "20px",
    color: "#232039",
  },
  actionButton: {
    "& .MuiButton-label": {
      textTransform: "none",
      fontFamily: "Space Grotesk",
      fontSize: 18,
      fontWeight: 500,
      color: "#8079B4",
    },
  },
  infoText: {
    fontFamily: "Space Grotesk",
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
  editButton: {
    fontFamily: "Space Grotesk",
    fontSize: 16,
    fontWeight: 500,
    color: "#8079B4",
  },
  googleButton: {
    width: "330px !important",
    height: "52px !important",
    border: "1px solid #D9D9D9 !important",
    borderRadius: "8px !important",
    fontFamily: "'Space Grotesk', sans-serif !important",
    fontSize: "14px !important",
    fontWeight: 500,
    color: "black !important",
    letterSpacing: "1px !important",
    justifyContent: "center",
  },
  formLabel: {
    fontSize: 16,
    fontWeight: 500,
    fontFamily: "Space Grotesk",
    color: "#232039",
  },
  input: {
    height: 55,
    border: "1px solid #D9D9D9",
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
        fontFamily: "Space Grotesk",
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
