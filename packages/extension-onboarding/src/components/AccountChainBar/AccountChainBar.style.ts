import { makeStyles } from "@material-ui/core/styles";
import { colors } from "@snickerdoodlelabs/shared-components";
colors;
export const useStyles = makeStyles((theme) => ({
  select: {
    width: "100%",
    height: 56,
    fontSize: 14,
    fontWeight: 500,
    background: "white",
    color: colors.GREY500,
    "& .MuiSelect-select:focus": {
      background: "none",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: colors.GREY400,
      borderRadius: 8,
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: colors.GREY400,
      borderWidth: "thin",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: colors.GREY400,
      borderWidth: "thin",
    },
  },
  selectIcon: {
    fill: colors.GREY400,
  },
  menuSelected: {},
  menuItem: {
    "&.MuiListItem-root.Mui-selected": {
      backgroundColor: colors.MAINPURPLE100,
    },
    "&:hover": {
      backgroundColor: colors.MAINPURPLE50,
    },
  },
  switchNetwork: {
    cursor: "pointer",
  },
  unfocused: {
    opacity: 0.3,
  },
}));
