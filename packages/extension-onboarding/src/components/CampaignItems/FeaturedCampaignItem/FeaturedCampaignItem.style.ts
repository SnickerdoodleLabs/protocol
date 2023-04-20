import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  name: {
    color: "#434343",
    fontFamily: "'Roboto'",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "18px",
    lineHeight: "21px",
    whiteSpace: "initial",
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: 1,
    WebkitBoxOrient: "vertical",
  },
  image: {
    width: 188,
    height: 188,
    aspectRatio: "1",
    objectFit: "cover",
    borderRadius: "50%",
  },
  description: {
    fontFamily: "'Roboto'",
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: "16px",
    lineHeight: "20px",
    color: "#757575",
    whiteSpace: "initial",
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
  },
  earnedText: {
    fontFamily: "'Roboto'",
    fontStyle: "normal",
    fontWeight: 700,
    fontSize: "12px",
    lineHeight: "161%",
    color: "#616161",
  },
  leftText: {
    fontFamily: "'Roboto'",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "12px",
    lineHeight: "161%",
    color: "#D32F2F",
  },
  subscriberCount: {
    fontFamily: "'Roboto'",
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: "12px",
    lineHeight: "12px",
    color: "#FFFFFF",
  },
  imageLoader: {
    width: "100%",
    aspectRatio: "4/3",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  brokenImageIcon: {
    fontSize: 60,
    color: "#D9D9D9",
  },
  leaveButton: {
    fontFamily: "'Roboto'",
    fontStyle: "normal",
    textAlign: "center",
    fontWeight: 500,
    fontSize: "14.05px",
    lineHeight: "16px",
    textDecorationLine: "underline",
    color: "#D32F2F",
    cursor: "pointer",
  },
  rewardText: {
    fontFamily: "'Roboto'",
    fontStyle: "normal",
    fontWeight: 700,
    fontSize: "12px",
    lineHeight: "14px",
    color: "#616161",
  },
  subscribedText: {
    fontFamily: "'Roboto'",
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: "12px",
    lineHeight: "13px",
    color: "#54A858",
  },
}));
