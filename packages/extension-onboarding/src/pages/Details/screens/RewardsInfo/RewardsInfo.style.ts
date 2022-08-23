import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  title: {
    fontFamily: "Shrikhand",
    fontSize: 36,
    fontWeight: 400,
    color: "#232039",
  },
  description: {
    fontFamily: "Space Grotesk",
    fontWeight: 400,
    fontSize: 18,
    lineHeight: "23px",
  },
  editButton: {
    fontFamily: "Space Grotesk",
    fontSize: 16,
    fontWeight: 500,
    color: "#8079B4",
  },
}));
