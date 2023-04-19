import { makeStyles } from "@material-ui/core/styles";
export const useStyles = makeStyles((theme) => ({
  button: {
    position: "absolute",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 32,
    height: 32,
    borderRadius: 16,
    background: "#FFFFFF",
    top: "calc(50% - 16px)",
    boxShadow:
      "0px 30.1471px 24.1177px rgba(0, 0, 0, 0.0456112), 0px 12.5216px 10.0172px rgba(0, 0, 0, 0.035), 0px 4.5288px 3.62304px rgba(0, 0, 0, 0.0243888)",
  },
  buttonLeft: {
    left: -16,
  },
  buttonRight: {
    right: -16,
  },
  icon: {
    color: "#757575",
  },
}));
