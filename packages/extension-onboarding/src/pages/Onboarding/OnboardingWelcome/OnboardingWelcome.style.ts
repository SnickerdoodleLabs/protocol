import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  bgImage: {
    position: "absolute",
    top: -50,
    zIndex: -1,
    left: 0,
    right: 0,
    marginLeft: "auto",
    marginRight: "auto",
  },
  content: {
    left: 0,
    right: 0,
  },
  logo: {
    width: 385,
  },
  title: {
    fontSize: "35px",
    lineHeight: "52px",
    fontWeight: 400,
    fontStyle: "italic",
    fontFamily: "Shrikhand, cursive ",
  },

  description: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 400,
    fontSize: 20,
    color: "#232039",
    letterSpacing: "0.035em",
  },
}));
