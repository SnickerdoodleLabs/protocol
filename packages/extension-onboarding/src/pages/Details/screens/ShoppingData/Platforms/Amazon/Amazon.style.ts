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
  SyncDataButton: {
    border: "1px solid #B9B6D3",
    width: "143px",
    height: "40px",
    textTransform: "none",
    fontFamily: "Roboto",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "15px",
    lineHeight: "26px",
    color: "#8079B4",
    marginRight: "24px",
  },
  syncDataIcon: {
    width: "24px",
    height: "24px",
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
    alignItems: "center",
  },
  connectionCheckIcon: {
    width: "17.07px",
    height: "13px",
  },
  connected: {
    fontWeight: 500,
    lineHeight: "13px",
    fontSize: "16px",
    color: "#54A858",
    fontFamily: "Roboto",
    fontStyle: "normal",
    marginLeft: "5px",
  },
  lastUpdated: {
    fontWeight: 400,
    fontSize: "12px",
    lineHeight: "20px",
    color: "#424242",
    fontFamily: "Public Sans",
    fontStyle: "normal",
  },
  containers: {
    marginTop: "24px",
  },
  csvButton: {
    border: "1px solid #B9B6D3",
    width: "191px",
    height: "40px",
    textTransform: "none",
    fontFamily: "Roboto",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "15px",
    lineHeight: "26px",
    color: "#8079B4",
  },
  csvContainer: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  productDataContainer: {
    border: "1px solid #FFFFFF",
    borderRadius: "8px",
    backgroundColor: "#F1EFF6",
    height: "143.5px",
    marginTop: "24px",
  },
  categoryCircleContainer: {
    border: "1px solid #EAECF0",
    borderRadius: "8px",
    backgroundColor: "#FFFFFF",
    height: "311px",
    marginTop: "24px",
    marginLeft: "3.5px",
  },
  dataTitle: {
    fontWeight: 500,
    fontSize: "16px",
    lineHeight: "20px",
    fontFamily: "Roboto",
    fontStyle: "normal",
    color: "#101828",
  },
  dataSubTitle: {
    fontWeight: 700,
    fontSize: "24px",
    lineHeight: "32px",
    fontFamily: "Roboto",
    fontStyle: "normal",
    color: "#101828",
  },
  dataContainer: {
    padding: "24px",
  },
  dataTitleSubTitleBox: {
    marginTop: "12px",
  },
  profitContainer: {
    display: "flex",
    marginTop: "16px",
  },
  profit: {
    fontWeight: 400,
    fontSize: "14px",
    lineHeight: "22px",
    fontFamily: "Roboto",
    color: "#54A858",
  },
  vsLastMonth: {
    fontWeight: 400,
    fontSize: "14px",
    lineHeight: "22px",
    fontFamily: "Roboto",
    color: "#667085",
    marginLeft: "8px",
  },
  pieChartContainer: {
    height: "190px",
    width: "190px",
    padding: "18.5px 0px",
  },
  categoryPieChartDataContainer: {
    display: "flex",
    justifyContent: "space-between",
    padding: "0px 42px",
    marginTop: "10.5px",
  },
  categoryDataContainer: {
    display: "flex",
    alignItems: "center",
    marginTop: "12px",
  },
  categoryData: {
    display: "table-column-group",
  },
  dot: {
    width: "8px",
    height: "8px",
    borderRadius: "100%",
    display: "flex",
    marginRight: "16px",
  },
  dataTypeLabel: {
    fontWeight: 500,
    fontSize: "16px",
    lineHeight: "24px",
    fontFamily: "Roboto",
    fontStyle: "normal",
    color: "#424242",
  },
  dataTypeValue: {
    fontWeight: 500,
    fontSize: "16px",
    lineHeight: "24px",
    fontFamily: "Roboto",
    fontStyle: "normal",
    color: "#000000",
  },
}));
