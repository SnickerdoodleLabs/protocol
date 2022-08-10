import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  primaryButton: {
    textTransform: "unset",
    padding: "21px 36px 10px 22px",
    boxShadow: "8px 8px 0px 0px rgb(0 0 0)",
    background: "#8079B4",
    color: "#fff",
    borderColor: "#000",
    borderRadius: 0,
    "&:hover": {
      backgroundColor: "black",
      borderColor: "inherit",
    },
  },
  primaryButtonIcon: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 14,
  },
}));
