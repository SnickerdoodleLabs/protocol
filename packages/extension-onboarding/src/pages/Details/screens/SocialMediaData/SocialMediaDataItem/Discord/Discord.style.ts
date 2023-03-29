import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  accountBoxContainer: {
    border: "1px solid #ECECEC",
    borderRadius: "12px",
    padding: "24px",
    position: "relative",
  },
  providerContainer: {
    // parent
    display: "flex",
    alignItems: "center",
    border: "1px solid #ECECEC",
    borderRadius: "12px",
  },
  discordLinkedAccountContainer: {
    display: "flex",
    alignItems: "center",
    borderBottom: "1px solid #ECECEC",
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
    marginLeft: "auto",
    right: "20px",
    paddingTop: "10px",
    marginRight: "20px",
  },
  unlinkAccountButton: {
    border: "1px solid red",
    width: "142px",
    height: "42px",
    fontFamily: "'Inter'",
    fontWeight: 500,
    fontSize: "15px",
    textTransform: "none",
    color: "red",
  },
  linkAccountButton: {
    border: "1px solid #B9B6D3",
    width: "142px",
    height: "42px",
    fontFamily: "'Inter'",
    fontWeight: 500,
    fontSize: "15px",
    textTransform: "none",
  },
  discordMediaItemProviderContainer: {
    // parent
    display: "flex",
    flexDirection: "column",
    border: "1px solid #ECECEC",
    borderRadius: "12px",
  },
  discordMediaItemLinkedAccountContainer: {
    // parent
    display: "flex",
    border: "1px solid #ECECEC",
    borderRadius: "12px",
    alignItems: "center",
  },
  discordIcon: {
    paddingTop: "15px",
    paddingLeft: "25px",
    height: "32px",
    width: "32px",
  },
  discordGuildIcon : {
    width: "57px",
    height: "57px",
    paddingTop: "15px",
    paddingLeft: "25px",
  },
  mainProvider: {
    border: "none",
    marginBottom: "16px",
  },
  discordGuildNoIcon : {
    // gg sans actual font
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 500,
    fontSize: "32px",
    color: "white",
    background : "black",
    textAlign: "center",
    width: "57px",
    height: "57px",
  },
  discordGuildNoIconContainer : {
    paddingLeft: "24px",
    paddingTop: "10px",
  },
  greenTick: { marginLeft: "-15px" },
}));
