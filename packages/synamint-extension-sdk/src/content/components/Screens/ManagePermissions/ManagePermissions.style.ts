import { makeStyles, createStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) =>
  createStyles({
    contentSubtitle: {
      fontFamily: "Space Grotesk",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "16px",
      lineHeight: "24px",
      color: "#000000",
    },
    sectionTitle: {
      fontFamily: "Space Grotesk",
      fontStyle: "normal",
      fontWeight: 700,
      fontSize: "18px",
      lineHeight: "24px",
      color: "#232039",
    },
    switchLabel: {
      "& .MuiTypography-body1": {
        fontFamily: "Space Grotesk",
        fontStyle: "normal",
        fontWeight: 500,
        fontSize: "18px",
        lineHeight: "28px",
        color: "#232039",
      },
    },
  }),
);
