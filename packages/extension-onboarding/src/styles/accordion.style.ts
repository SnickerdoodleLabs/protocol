import { makeStyles } from "@material-ui/core";
import { colors } from "@snickerdoodlelabs/shared-components";
export const useAccordionStyles = makeStyles((theme) => ({
  accordionRoot: {
    border: `1px solid ${theme.palette.borderColor}`,
    transition: "border 0.2s ease-in-out",
    borderRadius: "8px !important",
    "&:before": {
      display: "none",
    },
    "& .Mui-expanded": {
      marginTop: 8,
    },
  },
  accordion: {
    "& .MuiPaper-rounded": {},
    "& .MuiAccordionDetails-root": {
      padding: 0,
      paddingLeft: 32,
      paddingRight: 32,
    },
    "& .MuiAccordionSummary-root": {
      flexDirection: "row-reverse",
      padding: 0,
      paddingLeft: 32,
      paddingRight: 32,
      [theme.breakpoints.down("xs")]: {
        flexDirection: "row",
        alignItems: "flex-start",
        paddingLeft: 24,
        paddingRight: 24,
      },
    },
    "& .MuiIconButton-edgeEnd": {
      margin: 0,
      padding: 0,
      marginRight: 24,
      [theme.breakpoints.down("xs")]: {
        position: "absolute",
        right: 24,
        top: 12,
        marginRight: 0,
        marginLeft: 0,
      },
      "& .Mui-expanded": {
        marginRight: 24,
        margin: 0,
        padding: 0,
      },
    },
    "& .MuiAccordionSummary-content": {
      alignItems: "center",
      marginRight: 0,
      "& .Mui-expanded": {
        margin: 0,
        marginRight: 0,
      },
    },
  },
}));
