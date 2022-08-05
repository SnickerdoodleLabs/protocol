import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
    yourLinkedAccountText: {
        fontFamily: "'Space Grotesk', sans-serif",
        fontWeight: 700,
        fontSize: "20px",
        paddingTop: "35px",
      },
      yourLinkedAccountContainer: {
        marginTop: "170px",
        marginLeft: "20px",
      },
      connectText: {
        fontFamily: "'Space Grotesk', sans-serif",
        fontWeight: 700,
        fontSize: "20px",
        marginBottom: "0px",
      },
      manageText: {
        fontFamily: "'Space Grotesk', sans-serif",
        fontWeight: 400,
        fontSize: "18px",
        color: "#232039",
      },
      linkCryptoText: {
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
      }
}));
