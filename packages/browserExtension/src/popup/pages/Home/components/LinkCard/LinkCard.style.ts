import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  container: {
    border: "1px solid #ECECEC",
    borderRadius: 8,
    height: 60,
    cursor: "pointer",
  },
  linkTitle: {
    fontFamily: "Roboto",
    fontWeight: 500,
    fontSize: "16px",
    lineHeight: "20px",
    color: "#FFF",
  },
}));
