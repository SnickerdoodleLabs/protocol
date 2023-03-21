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
    aspectRatio: 1,
    height: "auto",
  },
  title: {
    fontFamily: "'Public Sans'",
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: "16px",
    lineHeight: "24px",
    color: "#262626",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
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
}));
