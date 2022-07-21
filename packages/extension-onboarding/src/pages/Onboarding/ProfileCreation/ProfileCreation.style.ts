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
  inputContainer:{
    width:330,
    height:55,
    border:"1px solid #D9D9D9",
    borderRadius:8,
  },
  artboardImageContainer:{
    
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "flex-end",
    margin: 20,
  },
  socialLoginTitle:{
    fontFamily:"Space Grotesk",
    fontWeight:700,
    fontSize:20,
    color:"#232039"
  },
  googleButton: {
    width: "330px !important",
    height: "52px !important",
    border: "1px solid #D9D9D9 !important",
    borderRadius: "8px !important",
    fontFamily: "'Space Grotesk', sans-serif !important",
    fontSize: "14px !important",
    fontWeight: 500,
    color: "black !important",
    letterSpacing: "1px !important",
    justifyContent: "center",
  },
}));
