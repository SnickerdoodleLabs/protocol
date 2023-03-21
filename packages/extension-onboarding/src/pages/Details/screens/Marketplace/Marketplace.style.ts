import { makeStyles } from "@material-ui/core/styles";

export const useMarketplaceStyles = makeStyles((theme) => ({
  title: {
    fontFamily: "'Roboto'",
    fontStyle: "normal",
    fontWeight: 700,
    fontSize: "36px",
    lineHeight: "42px",
    color: "#232039",
  },
  categoryTitle: {
    fontFamily: "'Space Grotesk'",
    fontStyle: "normal",
    fontWeight: 700,
    fontSize: "24px",
    lineHeight: "31px",
    color: "#232039",
  },
  categoryLabel: {
    fontFamily: "'Roboto'",
    fontStyle: "normal",
    fontWeight: 600,
    fontSize: "16px",
    lineHeight: "19px",
    color: "#616161",
  },
  category: {
    cursor: "pointer",
  },
  image: {
    boxShadow: "0px 3.6px 7.2px rgba(10, 22, 70, 0.15)",
  },
  select: {
    width: 260,
    height: 55,
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
    color: "#929292",
    "& .MuiSelect-select:focus": {
      background: "none",
    },
  },
}));
