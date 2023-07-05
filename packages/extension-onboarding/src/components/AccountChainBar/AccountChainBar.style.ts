import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  subTitle: {
    fontFamily: "Roboto",
    color: "#232039",
    fontSize: 16,
    fontWeight: 500,
  },
  selectAccount: {
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
  selectChain: {
    width: 240,
    height: 55,
    border: "1px solid #D9D9D9",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
    color: "#929292",
    background: "none",
  },
  accountAddressText: {
    paddingLeft: "4px",
    fontFamily: "'Roboto', sans-serif",
    fontWeight: 500,
    fontSize: "16px",
    color: "#5D5A74",
  },
  switchNetwork: {
    fontFamily: "Roboto",
    fontWeight: 500,
    fontSize: 12,
    color: "#232039",
    cursor: "pointer",
  },
  buttonText: {
    fontFamily: "Roboto",
    fontWeight: 500,
    fontSize: 16,
    color: "#232039",
  },
  unfocused: {
    opacity: 0.3,
  },
}));
