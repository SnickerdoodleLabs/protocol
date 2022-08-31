import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  name: {
    fontFamily: "Inter",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: 14.05,
    lineHeight: "17px",
    color: "#8079B4",
  },
  link: {
    textDecorationLine: "underline",
    cursor: "pointer",
    fontFamily: "Inter",
    fontStyle: "normal",
    fontWeight: 300,
    fontSize: 10,
    color: "red",
  },
  image: {
    width: "100%",
    aspectRatio: "4/3",
    objectFit: "cover",
  },
  imageLoader: {
    width: "100%",
    aspectRatio: "4/3",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  brokenImageIcon: {
    fontSize: 60,
    color: "#D9D9D9",
  },
}));
