import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    justifyContent: "center",
  },
  columnContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  lineData: {
    width: "84px",
    height: "1px",
    background: "#000",
  },
  text: {
    fontFamily: "Space Grotesk",
    fontWeight: 500,
    fontSize: 16,
    color: "#232039",
    paddingTop: "24px",
  },
  textFaded: {
    fontFamily: "Space Grotesk",
    fontWeight: 500,
    fontSize: 16,
    color: "#232039",
    paddingTop: "24px",
    opacity: 0.5,
  },
}));
