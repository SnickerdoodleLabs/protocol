import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  accountBoxContainer: {
    border: "1px solid #ECECEC",
    borderRadius: "12px",
    padding: "12px",
    position: "relative",
  },
  providerContainer: {
    // parent
    display: "flex",
    alignItems: "center",
    border: "1px solid #ECECEC",
    borderRadius: "12px",
    background: "#FFFFFF",
  },
  discordLinkedAccountContainer: {
    display: "flex",
    alignItems: "center",
    borderBottom: "1px solid #ECECEC",
  },
  providerText: {
    marginLeft: "12px",
    fontFamily: "public-sans",
  },
  serversTextBox: {
    boxShadow: "inset 0px -1px 0px #F0F0F0",
    marginTop: "22px",
  },
  serversText: {
    paddingLeft: "24px",
    paddingTop: "10px",
    fontFamily: "public-sans",
    fontWeight: 500,

    margin: "20px",
  },
  serversTextContainer: {
    marginTop: "22px",
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
    border: "1px solid #ECECEC",
    borderRadius: "12px",
    marginTop: "22px",
  },
  discordMediaItemLinkedAccountContainer: {
    // parent
    flex: "1 1 0px",
    display: "flex",
    alignItems: "center",
    boxShadow: "inset 0px -1px 0px #F0F0F0",

    background: "#FFFFFF",

    padding: "24px",
  },
  discordIcon: {
    paddingTop: "15px",
    paddingLeft: "25px",
    height: "50px",
    width: "50px",
  },
  discordGuildIcon: {
    width: "70px",
    height: "70px",
    paddingTop: "15px",
    paddingLeft: "25px",
  },
  mainProvider: {
    border: "none",
    marginBottom: "16px",
  },
  discordGuildRow: {
    // gg sans actual font
    width: "100%",
  },
  discordGuildNoIcon: {
    // gg sans actual font
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 500,
    fontSize: "42px",
    color: "white",
    background: "black",
    textAlign: "center",
    width: "70px",
    height: "70px",
  },
  discordGuildNoIconContainer: {
    paddingLeft: "24px",
    paddingTop: "10px",
  },
  discordGuildsContainerRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    width: "100%",
    flexWrap: "wrap",
  },
  discordGuildsContainerColumn: {
    display: "flex",
    flexdDirection: "column",
    flexBasis: "100%",
    flex: 1,
  },
  discordGuildName: {
    fontFamily: "roboto",
    fontStyle: "normal",
    fontWeight: 500,
    lineHeight: "160%",
    textAlign: "left",
    color: "#212121",
  },
  discordGuildMemberText: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "18px",
    lineHeight: "160%",
    color: "#9E9E9E",
  },
  greenTick: { marginLeft: "-15px" },
}));
