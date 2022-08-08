import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({

  buildYourProfileText: {
    fontSize: "36px",
    fontWeight: 400,
    fontStyle: "italic",
    fontFamily: " 'Shrikhand', cursive ",
    marginTop: "100px",
  },
  buttonContainer:{
    display: "flex",
    justifyContent:"flex-end",
    margin:20
  },
  selectAccount: {
    width: 260,
    height: 55,
    border: "1px solid #D9D9D9",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
    color: "#929292",
    background:"none"
  },
  selectChain: {
    width: 220,
    height: 55,
    border: "1px solid #D9D9D9",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
    color: "#929292",
    background:"none"
  },

  accountAddressText: {
    paddingLeft: "4px",
    paddingTop: "10px",
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 500,
    fontSize: "16px",
    color: "#5D5A74",
  },
}));
