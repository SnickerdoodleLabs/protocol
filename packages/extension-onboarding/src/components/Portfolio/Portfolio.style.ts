import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  title: {
    fontFamily: "Shrikhand",
    fontSize: 36,
    fontWeight: 400,
    color: "#232039",
  },
  description: {
    fontFamily: "Space Grotesk",
    fontWeight: 400,
    fontSize: 18,
    lineHeight: "23px",
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
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
    color: "#929292",
    "& .MuiSelect-select:focus": {
      background: "none",
    },
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
    paddingBottom: 80,
  },
  tokenText: {
    fontFamily: "Space Grotesk",
    color: "#232039",
    fontSize: 22,
    fontWeight: 700,
  },
  nftContainer: {
    display: "flex",
    marginTop: "16px",
    gap: 10,
  },
  gridTitle: {
    fontFamily: "Space Grotesk",
    fontWeight: 500,
    fontSize: 16,
    color: "#5D5A74",
  },
  switchNetwork: {
    fontFamily: "Space Grotesk",
    fontWeight: 500,
    fontSize: 12,
    color: "#232039",
    cursor: "pointer",
  },
  paginationText: {
    fontFamily: "Roboto",
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: 12,
  },
  buttonText: {
    paddingLeft: "8px",
    textTransform: "none",
    fontFamily: "Space Grotesk",
    fontWeight: 500,
    fontSize: 16,
    color: "#232039",
  },
  unfocused: {
    opacity: 0.3,
  },
}));
