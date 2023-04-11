import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  itemTitle: {
    fontFamily: "'Roboto",
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: "14px",
    lineHeight: "133.4%",
    color: "rgba(35, 32, 57, 0.87)",
  },
  itemValue: {
    fontFamily: "'Roboto",
    textTransform: "capitalize",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "16px",
    lineHeight: "160%",
    color: "#212121",
  },
}));
