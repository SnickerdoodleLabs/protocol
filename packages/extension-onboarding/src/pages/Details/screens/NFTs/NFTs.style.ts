import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  title: {
    fontFamily: "'Space Grotesk'",
    fontStyle: "normal",
    fontWeight: 700,
    fontSize: "20px",
    lineHeight: "26px",
    color: "#232039",
  },
  description: {
    fontFamily: "'Space Grotesk'",
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: "14px",
    lineHeight: "20px",
    letterSpacing: "0.25px",
    color: "#616161",
  },
  subTitle: {
    fontFamily: "Space Grotesk",
    color: "#232039",
    fontSize: 16,
    fontWeight: 500,
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
