import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  description: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 400,
    fontSize: "24px",
    color: "#232039",
  },
  descriptionSmall: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 400,
    fontSize: "16px",
    color: "#232039",
  },
  title: {
    fontSize: "36px",
    fontWeight: 400,
    fontStyle: "italic",
    fontFamily: " 'Shrikhand', cursive ",
    margin: 0,
  },
}));
