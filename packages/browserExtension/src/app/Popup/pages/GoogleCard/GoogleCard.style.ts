import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  googleCardContainer: {
    background: "#FDF3E1",
    width: "100%",
    height: "100vh",
  },
  cardTop: {
    background: "#F8D798",
    width: "100%",
    height: "116px",
  },
  cardTopLogo: {
    textAlign: "center",
    paddingTop: "25px",
  },
  cardTopText: {
    fontSize: "13px",
    fontStyle: "italic",
    paddingTop: "10px",
    textAlign: "center",
    fontWeight: 400,
    color: "#000000",
  },
  cardPersonalContainer: {
    background: "white",
    width: "390px",
    margin: 15,
    height: "280px",
    borderRadius: "8px",
  },
  cardPersonalText: {
    color: "#000",
    padding: 15,
    fontSize: "18px",
    fontWeight: 600,
    fontFamily: "'Inter',sans-serif",
  },
  cardDataContainer: {
    display: "flex",
    alignItems: "center",
  },
  cardDataText: {
    color: "#8F8F8F",
    padding: 15,
    fontSize: "13px",
    fontWeight: 600,
    fontFamily: "'Inter',sans-serif",
  },
  cardDataPhoto: {
    marginLeft: "125px",
    width: "55",
    height: "55px",
    borderRadius: "50px",
  },
  cardOnchainContainer: {
    background: "white",
    width: "390px",
    margin: 15,
    height: "160px",
    borderRadius: "8px",
  },
  cardOnchainText: {
    color: "#000",
    padding: 15,
    fontSize: "18px",
    fontWeight: 600,
    fontFamily: "'Inter',sans-serif",
  },
  cardDataTitle: {
    color: "#8F8F8F",
    paddingTop: "12px",
    paddingLeft: "15px",
    fontSize: "12px",
    fontWeight: 500,
    fontFamily: "'Inter',sans-serif",
  },
  cardDataInformation: {
    position: "absolute",
    textAlign: "right",
    color: "#242238",
    left: "220px",
    paddingTop: "12px",
    fontSize: "11px",
    fontWeight: 500,
    fontFamily: "'Inter',sans-serif",
  },
}));
