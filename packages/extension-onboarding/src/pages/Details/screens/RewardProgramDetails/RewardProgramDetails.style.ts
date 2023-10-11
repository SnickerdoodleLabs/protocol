import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  image: {
    aspectRatio: "1",
    objectFit: "cover",
    borderRadius: "50%",
  },
  title: {
    fontFamily: "'Roboto'",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "24px",
    lineHeight: "44px",
    letterSpacing: "-0.02em",
    color: "#424242",
  },
  description: {
    fontFamily: "'Roboto'",
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: "16px",
    lineHeight: "20px",
    color: "#757575",
  },
  infoTitle: {
    fontFamily: "'Space Grotesk'",
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: "11px",
    lineHeight: "133.4%",
    color: "rgba(35, 32, 57, 0.87)",
  },
  infoText: {
    fontFamily: "'Space Grotesk'",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "14px",
    lineHeight: "133.4%",
    color: "rgba(35, 32, 57, 0.87)",
  },
  subscribedText: {
    fontFamily: "'Roboto'",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "16px",
    lineHeight: "13px",
    display: "flex",
    alignItems: "center",
    color: "#28A745",
  },
  subscribeButtonDekstop: {
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  subscribeButtonTabletMobile: {
    marginTop: "12px",
    display: "none",
    [theme.breakpoints.down("sm")]: {
      display: "flex",
    },
  },
  rewardMobile: {
    display: "none",
    [theme.breakpoints.down("xs")]: {
      display: "flex",
    },
  },
  rewardTabletMobile: {
    display: "none",
    [theme.breakpoints.down("sm")]: {
      display: "flex",
    },
  },
  rewardDekstop: {
    display: "flex",
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
  rentDekstop: {
    display: "block",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
}));
