import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  container: {
    "& .MuiDialog-paper": {
      borderRadius: 12,
      maxWidth: 640,
    },
    zIndex: "999 !important",
  },
  title: {
    color: "#101828",
    fontFamily: "Roboto",
    fontSize: "22px",
    fontStyle: "normal",
    fontWeight: 700,
    lineHeight: "normal",
  },
  description: {
    color: "#8D8B9E",
    textAlign: "center",
    fontFamily: "Roboto",
    fontSize: "12px",
    fontStyle: "normal",
    fontWeight: 500,
    lineHeight: "normal",
  },
  label: {
    color: "#232039",
    fontFamily: "Roboto",
    fontSize: "18px",
    fontStyle: "normal",
    fontWeight: 500,
    lineHeight: "20px",
  },
}));
