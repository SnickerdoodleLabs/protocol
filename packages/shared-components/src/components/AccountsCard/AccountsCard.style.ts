import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  container: {
    border: "1px solid #ECECEC",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
  },
  accountsContainer: {
    maxHeight: 400,
    overflow: "auto",
  },
  title: {
    fontFamily: "Space Grotesk, sans-serif",
    fontWeight: 700,
    fontSize: "20px",
    paddingTop: "35px",
  },
  divider: {
    border: "1px solid #ECECEC",
    width: "calc(100%-48px)",
    marginLeft: "24px",
    marginRight: "24px",
    marginTop: "16px",
    marginBottom: "16px",
  },
}));
