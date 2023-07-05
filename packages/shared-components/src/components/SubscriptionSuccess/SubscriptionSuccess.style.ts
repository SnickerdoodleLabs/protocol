import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
    title: {
        fontFamily: "'Roboto'",
        fontStyle: "normal",
        fontWeight: 700,
        fontSize: "22px",
        lineHeight: "24px",
        color: "#101828",
      },
      subtitle: {
        fontFamily: "'Roboto'",
        fontStyle: "normal",
        fontWeight: 700,
        fontSize: "16px",
        lineHeight: "24px",
        color: "#424242",
      },
      content: {
        fontFamily: "'Roboto'",
        fontStyle: "normal",
        fontWeight: 400,
        fontSize: "16px",
        lineHeight: "24px",
        color: "#424242",
      },
}));
