import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  container: {
    padding: "24px",
    border: "1px solid #ECECEC",
    display: "flex",
    justifyContent: "space-between",
    borderRadius: "12px",
    alignItems: "center",
    marginTop: "24px",
  },
  LogoImage: {
    width: "47px",
    height: "41px",
  },
  Button: {
    border: "1px solid #B9B6D3",
    width: "101px",
    height: "40px",
    textTransform: "none",
    fontFamily: "Roboto",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "15px",
    lineHeight: "26px",
    color: "#8079B4",
  },
  providerNameBox: {
    height: "38px",
  },
  providerName: {
    fontStyle: "normal",
    fontWeight: 700,
    fontSize: "20px",
    lineHeight: "38px",
    textAlign: "center",
    color: "#101828",
    fontFamily: "'Roboto'",
    marginLeft: "16px",
  },
  logoProviderNameContainer: {
    display: "flex",
  },
}));
