import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  card: {
    borderRadius: 8,
    border: "1px solid #ECECEC",
    padding: 0,
    width:"150px"
  },
  nftName: {
    fontFamily: "Space Grotesk",
    fontWeight: 600,
    fontSize: 14,
    color: "rgba(35, 32, 57, 0.87)",
  },
  nftTokenId: {
    fontFamily: "Space Grotesk",
    fontWeight: 600,
    fontSize: 14,
    color: "rgba(93, 90, 116, 0.8)",
  },
}));
