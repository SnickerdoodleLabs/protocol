import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
    artboard: {
        marginTop: "100px",
        marginLeft: "20px",
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
      authorizeText: {
        marginTop: "40px",
        color: "#232039",
        fontFamily: "'Space Grotesk'",
        fontSize: "18px",
      },
      selectInput: {
        width: "330px",
        height: "55px",
        border: "1px solid #D9D9D9",
        borderRadius: "8px",
        paddingLeft: "25px",
        color: "#929292",
      },
      textInput: {
        border: "1px solid #D9D9D9",
        width: "330px",
        height: "55px",
        borderRadius: "8px",
        paddingLeft: "25px",
        color: "#929292",
      },
      buildYourProfileText: {
        fontSize: "36px",
        fontWeight: 400,
        fontStyle: "italic",
        fontFamily: " 'Shrikhand', cursive ",
        marginTop: "100px",
      },
      infoText: {
        fontFamily: "'Space Grotesk', sans-serif",
        fontWeight: 400,
        fontSize: "18px",
      },
      buttonContainer:{
        display: "flex",
        justifyContent:"flex-end",
        margin:20
      }
}));
