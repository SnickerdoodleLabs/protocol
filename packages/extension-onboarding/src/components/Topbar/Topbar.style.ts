import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  topbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
    [theme.breakpoints.down("sm")]: {
      display: "flex",
    },
  },
  menuContainer: {
    position: "absolute",
    top: "88px",
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "#fff",
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
    zIndex: 1,
    borderRadius: 0,
    padding: theme.spacing(2),
    flex: 1,
    overflowY: "auto",
  },
  logoImage: {
    width: "48px",
    height: "48px",
  },
  menuButton: {
    width: "40px",
    height: "40px",
    borderRadius: "8px",
    backgroundColor: "#D2CEE3",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  menuIcon: {
    width: "24px",
    height: "24px",
  },
}));
