import { makeStyles } from "@material-ui/core/styles";

export const useRewardItemsStyles = makeStyles((theme) => ({
  badge: {
    objectFit: "cover",
    width: "100%",
    aspectRatio: 1,
    height: "auto",
    position: "absolute",
    top: 0,
    right: 0,
  },
  img: {
    objectFit: "cover",
    width: "100%",
    aspectRatio: 10 / 9,
    height: "auto",
    borderRadius: 4,
  },
  imgCircle: {
    objectFit: "cover",
    width: "100%",
    aspectRatio: 1,
    borderRadius: "50%",
  },
  imgCompactItem: {
    objectFit: "cover",
    width: "100%",
    aspectRatio: 10 / 9,
    borderRadius: 8,
  },
  title: {
    fontFamily: "'Roboto'",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "13px",
    lineHeight: "20px",
    display: "flex",
    alignItems: "center",
    color: "rgba(22, 22, 26, 0.6)",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  listTitle: {
    fontFamily: "'Roboto'",
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: "14px",
    lineHeight: "22px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  compactTitle: {
    fontFamily: "'Roboto'",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "12px",
    lineHeight: "20px",
    textAlign: "center",
    color: "rgba(22, 22, 26, 0.6)",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  priceTitle: {
    fontFamily: "'Roboto'",
    fontStyle: "normal",
    fontWeight: 700,
    fontSize: "12px",
    lineHeight: "12px",
    textAlign: "justify",
    color: "#2D2944",
  },
  compactItemPrice: {
    fontFamily: "'Roboto'",
    fontStyle: "normal",
    fontWeight: 700,
    fontSize: "8px",
    lineHeight: "10px",
    textAlign: "center",
    color: "#FFFFFF",
  },
  listAvailable: {
    fontFamily: "'Public Sans'",
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: "12px",
    color: "#2E7D32",
  },
  listPermissionRequired: {
    fontFamily: "'Public Sans'",
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: "12px",
    color: "#D15151",
  },
  description: {
    fontFamily: "'Roboto'",
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: "12.0627px",
    lineHeight: "133.4%",
    color: "rgba(35, 32, 57, 0.87)",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  expandedLockText: {
    fontFamily: "'Roboto'",
    marginLeft: "55px",
    marginRight: "10px",
    marginTop: "10px",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "9.5px",
    display: "flex",
    alignItems: "center",
    color: "white",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "normal",
  },
}));
