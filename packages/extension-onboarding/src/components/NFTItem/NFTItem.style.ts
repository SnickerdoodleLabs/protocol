import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
 icon: {
    with: 64,
    height:64,
 },
  name: {
    fontFamily: "Space Grotesk",
    color: "#5D5A74",
    fontSize: 18,
    fontWeight: 500,
  },
  balance: {
    fontFamily: "Space Grotesk",
    color: "#5D5A74",
    fontSize: 18,
    fontWeight: 500,
    opacity: 0.6,
  },
  usdBalanceWrapper: {
    position: "absolute",
    right: 0,
    top: 15,
    background: "#F1F0F6",
    minWidth: "70px",
    borderRadius: 18,
  },
  usdBalance: {
    fontFamily: "Space Grotesk",
    color: "#5D5A74",
    fontSize: 16,
    fontWeight: 500,
    padding: "5px 20px 5px 20px",
    textAlign: "center",
  }
 
}));
