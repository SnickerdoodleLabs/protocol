import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  container: {
    width: "260px",
    height: "114px",
    background: "white",
    zIndex: 9999,
  },
  container2: {
    width: "96px",
    height: "114px",
    background: "#B9B6D3",
  },
  safeImg: {
    padding: "24px 0px",
  },

  closeImg: {
    position: "absolute",
    right: 8,
    top: 6,
    cursor: "pointer",
  },
  title: {
    fontSize: "17px",
    fontFamily: "Shrikhand",
    fontStyle: "italic",
    padding: "24px 24px 16px 24px",
    color: "#222137",
  },
  learnMore: {
    fontSize: "10px",
    fontFamily: "Space Grotesk",
    fontWeight: 500,
    textAlign: "right",
    padding: "0px 24px 16px 0px",
    color: "#797979",
    letterSpacing: "0.56px",
    textDecoration: "underline",
  },
  dontShow: {
    fontSize: "10px",
    fontFamily: "Space Grotesk",
    fontWeight: 300,
    textAlign: "right",
    paddingRight: "24px",
    paddingTop: "0px",
    color: "#3E3E3E",
    marginTop: "-15px",
  },
}));
