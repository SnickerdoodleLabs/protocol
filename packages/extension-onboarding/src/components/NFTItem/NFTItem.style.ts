import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  card: {
    borderRadius: 8,
    border: "1px solid #ECECEC",
    padding: 0,
    width: "150px",
  },
  nftName: {
    width: 115,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    fontFamily: "Space Grotesk",
    fontWeight: 600,
    fontSize: 12,
    color: "rgba(35, 32, 57, 0.87)",
  },
  nftTokenId: {
    fontFamily: "Space Grotesk",
    fontWeight: 600,
    fontSize: 14,
    color: "rgba(93, 90, 116, 0.8)",
  },
  review: {
    fontFamily: "'Inter'",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "14.05px",
    lineHeight: "17px",
    textDecorationLine: "underline",
    color: "#8079B4",
    cursor: "pointer",
  },
}));
