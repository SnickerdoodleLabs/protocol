import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  actionButton: {
    "& .MuiButton-label": {
      textTransform: "none",
      fontFamily: "Roboto",
      fontWeight: 500,
      color: "#8079B4",
    },
  },
  itemLabel: {
    fontFamily: "'Roboto'",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "16px",
    lineHeight: "20px",
    color: "#5D5A74",
  },
  itemValue: {
    fontFamily: "'Roboto'",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "16px",
    lineHeight: "20px",
    color: "#232039",
  },
}));
