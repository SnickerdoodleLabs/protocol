import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({

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
  },
  cardTitle:{
    paddingLeft: "24px",
    paddingTop: "10px",
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 500,
    fontSize: "20px",
    paddingBottom: "12px",
  },
  divider:{
    border: "1px solid #ECECEC",
    width:"calc(100%-48px)",
    marginLeft:"24px",
    marginRight:"24px"
  },
  dividerChainData:{
    border: "1px solid #ECECEC",
    width:"calc(100%-48px)",
    marginLeft:"24px",
    marginRight:"24px",
    marginTop:"16px",
    marginBottom:"16px"
  }
}));
