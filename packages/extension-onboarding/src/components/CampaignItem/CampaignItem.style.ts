import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  name: {
    fontFamily: "'Roboto'",
    fontStyle: "normal",
    fontWeight: 700,
    fontSize: "16px",
    lineHeight: "19px",
    textAlign: "center",
    color: "rgba(35, 32, 57, 0.87)",
    whiteSpace: "initial",
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: 1,
    WebkitBoxOrient: "vertical",
  },
  image: {
    width: "100%",
    aspectRatio: "1",
    objectFit: "cover",
    borderRadius: "50%",
    border: " 1px solid #868589",
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
}));
