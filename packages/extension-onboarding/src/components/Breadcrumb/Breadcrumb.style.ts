import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  currentPath: {
    fontFamily: "'Roboto'",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "14px",
    lineHeight: "16px",
    color: "#202223",
  },
  link: {
    all: "unset",
    cursor: "pointer",
    fontFamily: "'Space Grotesk'",
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: "14px",
    lineHeight: "18px",
    color: "#202223",
    "&:hover": {
      textDecoration: "underline",
    },
  },
  disabled: {
    fontFamily: "'Space Grotesk'",
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: "14px",
    lineHeight: "18px",
    color: "#202223",
    opacity: 0.7,
  },
}));
