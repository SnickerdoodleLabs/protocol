import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  container: {
    border: "1px solid #ECECEC",
    height: "400px",
    borderRadius: 8,
  },
  cardTitle: {
    paddingLeft: "24px",
    paddingTop: "10px",
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 500,
    fontSize: "20px",
    paddingBottom: "12px",
  },
  divider: {
    border: "1px solid #ECECEC",
    width: "calc(100%-48px)",
    marginLeft: "24px",
    marginRight: "24px",
  },
}));
