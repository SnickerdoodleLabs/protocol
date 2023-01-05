import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  title: {
    fontFamily: "Shrikhand",
    fontSize: 30,
    fontWeight: 400,
    color: "#101828",
  },
  subTitle: {
    fontFamily: "Space Grotesk",
    fontSize: 24,
    fontWeight: 700,
    color: "#232039",
  },
  description: {
    fontFamily: "Space Grotesk",
    fontSize: 14,
    fontWeight: 400,
    color: "#616161",
  },
  link: {
    textDecorationLine: "underline",
    cursor: "pointer",
    fontFamily: "Inter",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: 14.5,
    lineHeight: "17px",
    color: "#8079B4",
  },
}));
