import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  title: {
    fontSize: "36px",
    fontWeight: 400,
    fontStyle: "italic",
    fontFamily: " 'Shrikhand', cursive ",
    marginTop: "100px",
  },
  subTitle: {
    fontFamily: "Space Grotesk",
    color: "#232039",
    fontSize: 16,
    fontWeight: 500,
  },
  cardTitle: {
    fontFamily: "Space Grotesk",
    color: "#5D5A74",
    fontSize: 16,
    fontWeight: 700,
    lineHeight: "20px",
    letterSpacing: "0.25px",
  },
  cardDescription: {
    fontFamily: "Space Grotesk",
    color: "#5D5A74",
    fontSize: 34,
    fontWeight: 400,
    lineHeight: "36px",
    letterSpacing: "0.25px",
    paddingTop: 8,
  },
  cardBackground: {
    background: "rgba(253, 243, 225, 0.5)",
    border: "1px solid  #ECECEC",
  },
  cardBackground2: {
    background: "rgba(185, 182, 211, 0.2)",
    border: "1px solid  #ECECEC",
  },
  cardTokenText: {
    fontFamily: "Space Grotesk",
    color: "#5D5A74",
    fontSize: 16,
    fontWeight: 700,
    lineHeight: "20px",
    letterSpacing: "0.25px",
  },
  selectAccount: {
    width: 260,
    height: 55,
    border: "1px solid #D9D9D9",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
    color: "#929292",
    background: "none",
  },
  selectChain: {
    width: 240,
    height: 55,
    border: "1px solid #D9D9D9",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
    color: "#929292",
    background: "none",
  },

  accountAddressText: {
    paddingLeft: "4px",
    paddingTop: "7px",
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 500,
    fontSize: "16px",
    color: "#5D5A74",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "flex-end",
    margin: 20,
  },
  tokenText: {
    fontFamily: "Space Grotesk",
    color: "#232039",
    fontSize: 22,
    fontWeight: 700,
  },
  
}));
