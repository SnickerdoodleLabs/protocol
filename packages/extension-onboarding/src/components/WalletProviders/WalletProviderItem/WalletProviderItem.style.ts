import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  accountBoxContainer: {
    height: "80px",
    border: "1px solid #ECECEC",
    borderRadius: "12px",
    position: "relative",
  },
  providerContainer: {
    display: "flex",
    alignItems: "center",
  },
  providerText: {
    paddingLeft: "24px",
    paddingTop: "10px",
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 500,
    fontSize: "20px",
  },
  providerLogo: {
    paddingTop: "15px",
    paddingLeft: "25px",
  },
  linkedText: {
    paddingLeft: "24px",
    paddingTop: "10px",
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 500,
    fontSize: "12px",
    color: "#5D5A74",
    opacity: "0.6",
  },
  linkAccountContainer: {
    position: "absolute",
    right: "20px",
    paddingTop: "10px",
  },
  linkAccountButton: {
    border: "1px solid #B9B6D3",
    width: "142px",
    height: "42px",
    fontFamily: "'Inter'",
    fontWeight: 500,
    fontSize: "12px",
  },
  greenTick: { marginLeft: "-15px" },
}));
