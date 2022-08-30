import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  container: {
    "& .MuiTabs-root": {
      minHeight: "unset",
    },
    "& .MuiTabs-flexContainer": {
      justifyContent: "center",
    },
    "& .MuiTabs-indicator": {
      backgroundColor: "#232039",
    },
    "& .MuiTab-wrapper": {
      textTransform: "none",
      fontFamily: "Space Grotesk",
      fontStyle: "normal",
      fontWeight: 500,
      fontSize: "16px",
      lineHeight: "20px",
    },
    "& .MuiTab-textColorInherit": {
      opacity: "0.4 !important",
      minHeight: "unset",
      marginLeft: 20,
    },
    "& .Mui-selected": {
      opacity: "1 !important",
    },
  },
}));
