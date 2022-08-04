import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  container: {
    backdropFilter: "blur(.5px)",
    "& .MuiDialog-paper": {
      borderRadius: 12,
      maxWidth: 720,
    },
  },
  title: {
    color: "#232039",
    fontSize: 22.78,
    fontWeight: 700,
    fontFamily: "Space Grotesk",
  },
  description: {
    color: "#5D5A74",
    fontSize: 16,
    fontWeight: 500,
    fontFamily: "Space Grotesk",
  },
  accountTxt: {
    color: "#000000",
  },
}));
