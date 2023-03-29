import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  accountBoxContainer: {
    border: "1px solid #ECECEC",
    borderRadius: "12px",
    padding : "24px",
    position: "relative",
  },
  providerContainer: { // parent
    display: "flex",
    alignItems: "center",
    border: "1px solid #ECECEC",
    borderRadius: "12px",
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
    marginLeft : "auto",
    right: "20px",
    paddingTop: "10px",
    marginRight : "20px",
  },
  linkAccountButton: {
    border: "1px solid red",
    width: "142px",
    height: "42px",
    fontFamily: "'Inter'",
    fontWeight: 500,
    fontSize: "15px",
    textTransform : "none",
    color  :"red",
  },
  mainProvider : {
    border : "none",
    marginBottom : "16px"
  },
 
  greenTick: { marginLeft: "-15px" },
}));

