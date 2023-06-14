import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  permissionsTitle: {
    fontFamily: "'Roboto'",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "16px",
    lineHeight: "24px",
    color: "#262626",
  },
  permissionsDescription: {
    fontFamily: "'Roboto'",
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: "12px",
    lineHeight: "20px",
    letterSpacing: "0.25px",
    color: "#616161",
  },
  selectAll: {
    fontFamily: "'Roboto'",
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: "16px",
    lineHeight: "16px",
    color: "#8079B4",
    cursor: "pointer",
  },
  selectInput: {
    height: 36,
    border: "1px solid #D9D9D9",
    fontFamily: "'Roboto'",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "14px",
    lineHeight: "16px",
    borderRadius: 8,
    justifyContent: "center",
    width: "-webkit-fill-available",
    "& .MuiInput-underline:before": {
      content: "none !important",
    },
    "& .MuiInput-underline:after": {
      content: "none !important",
    },
    "& .MuiInputBase-inputAdornedEnd": {
      fontSize: 14,
      marginLeft: 12,
      fontFamily: "'Roboto'",
      fontStyle: "normal",
      fontWeight: 500,
      lineHeight: "16px",
    },
    "& fieldset": {
      border: "unset",
    },
    "&:hover fieldset": {
      border: "unset",
    },
    "& .MuiInputBase-inputAdornedEnd:focus": {
      backgroundColor: "transparent !important",
    },
    "& .MuiSelect-nativeInput": {
      color: "#000 !important",
    },
    "& .MuiSvgIcon-root": {
      fontSize: 24,
      color: "#8079B4",
    },
    "& .MuiSelect-select:focus": {
      backgroundColor: "transparent !important",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      border: "1px solid #D9D9D9",
    },
    "&input::placeholder": {
      fontFamily: "'Roboto'",
      fontStyle: "normal",
      fontWeight: 500,
      fontSize: "14px",
      lineHeight: "16px",
      color: "#929292",
    },
  },
  placeHolder: {
    fontFamily: "'Roboto'",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "14px",
    lineHeight: "16px",
    color: "#929292",
  },
  menuItem: {
    fontSize: 14,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: 500,
    fontFamily: "Space Grotesk",
    color: "#232039",
  },
  errorMessage: {
    margin: 0,
    marginLeft: 14,
    marginRight: 14,
    color: "#f44336",
    fontSize: "0.75rem",
    marginTop: 3,
    textAlign: "left",
    fontWeight: 400,
    lineHeight: 1.66,
    letterSpacing: "0.03333em",
  },
}));
