import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  providerLogo: {
    height: 44,
    width: "auto",
  },
  providerName: {
    fontFamily: "'Space Grotesk''",
    fontStyle: "normal",
    fontWeight: 700,
    fontSize: "20px",
    lineHeight: "38px",
    textAlign: "center",
    color: "#101828",
  },
  divider: {
    height: 1,
    width: "100%",
    display: "flex",
    backgroundColor: "#F0F0F0",
  },
  accountName: {
    fontFamily: "'Space Grotesk'",
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: "14px",
    lineHeight: "22px",
    color: "#262626",
    textTransform: "uppercase",
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
  guildsTitle: {
    fontFamily: "'Space Grotesk'",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "16px",
    lineHeight: "24px",
    color: "#262626",
  },

  // guild item styles
  discordGuildImg: {
    width: 57,
    height: 57,
  },
  guildIconPlaceholder: {
    fontFamily: "'Space Grotesk'",
    fontWeight: 500,
    fontSize: 36,
    textAlign: "center",
    color: "white",
  },
  discordGuildName: {
    fontFamily: "Space Grotesk",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "16px",
    lineHeight: "160%",
    textAlign: "left",
    color: "#212121",
  },
  discordGuildMemberText: {
    fontFamily: "'Space Grotesk'",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "14px",
    lineHeight: "160%",
    color: "#9E9E9E",
  },
}));
