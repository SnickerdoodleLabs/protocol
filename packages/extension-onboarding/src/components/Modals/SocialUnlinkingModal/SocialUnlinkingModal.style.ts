import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  container: {
    "& .MuiDialog-paper": {
      borderRadius: 12,
      maxWidth: 640,
    },
  },
  exclamationIcon: {
    width: 35,
    height: 35,
  },
  uppercase: {
    textTransform: "uppercase",
  },
  pointer: {
    cursor: "pointer",
  },
  title: {
    color: "#212121",
    fontSize: 22.78,
    fontWeight: 700,
    fontFamily: "Space Grotesk",
  },
  subTitle: {
    color: "#212121",
    fontSize: "18px",
    fontWeight: 700,
    fontFamily: "Space Grotesk",
    lineHeight: "150%",
  },
  codeContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid #D9D9D9",
    borderRadius: "8px",
    fontWeight: 700,
    fontFamily: "Space Grotesk",
    fontSize: "33px",
    lineHeight: "39px",
    width: "100px",
    height: "64px",
    gap: "4px",
  },
  otpInput: {
    marginRight: 8,
    width: 64,
    height: 64,
    fontSize: 33,
    textAlign: "center",
    border: "1px solid",
    borderColor: (props: any) => {
      if (props.isSuccess) {
        return "#54A858";
      }
      if (props.isError) {
        return "#D32F2F";
      }
      return "#D0D5DD";
    },
    color: (props: any) => {
      if (props.isSuccess) {
        return "#54A858";
      }
      if (props.isError) {
        return "#D32F2F";
      }
      return "#000";
    },
    borderRadius: 8,
    "&:focus": {
      outline: "none",
      fontSize: 33,
    },
    "&::placeholder": {
      color: "#D0D5DD",
    },
  },
  codeInputFields: {
    "& input[type=number]": {
      "-moz-appearance": "textfield",
    },
    "& input[type=number]::-webkit-outer-spin-button": {
      "-webkit-appearance": "none",
      margin: 0,
    },
    "& input[type=number]::-webkit-inner-spin-button": {
      "-webkit-appearance": "none",
      margin: 0,
    },
    width: "64px",
    height: "64px",

    display: "flex",
    alignItems: "center",
    padding: "8px",
    gap: "8px",
  },

  codeTextInput: {
    fontFamily: "Space Grotesk",
    fontStyle: "normal",
    fontWeight: 500,
    fontsize: "33px",
    lineHeight: "60px",
  },

  codeTextInputContainer: {
    display: "flex",
    alignItems: "center",
  },

  description: {
    color: "##5D5A74",
    fontSize: 16,
    fontWeight: 400,
    fontFamily: "Space Grotesk",
    fontStyle: "normal",
    textAlign: "left",
    lineHeight: "19px",
    marginRight: "50px",
  },
  primaryButton: {
    background: "#D32F2F !important",
  },
  secondaryButton: {
    background: "#fff !important",
    color: "#000 !important",
  },
  label: {
    fontFamily: "'Space Grotesk'",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "14px",
    lineHeight: "20px",
    color: "#616161",
  },
  button: {
    border: "1px solid red",
    width: "142px",
    height: "42px",
    fontFamily: "'Inter'",
    fontWeight: 500,
    fontSize: "15px",
    textTransform: "none",
    color: "red",
    margin: "5px",
  },
  unlinkAccountButton: {
    margin: "5px 0px 5px 0px",
    border: "1px solid red",
    width: "142px",
    height: "42px",
    fontFamily: "'Inter'",
    fontWeight: 500,
    fontSize: "15px",
    textTransform: "none",
    color: "white",
    backgroundColor: "red",
  },
  bodyContainer: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
  },
  typeCodeContainer: {
    display: "flex",
    justifyContent: "flex-start",
    width: "100%",
  },
  successText: {
    color: "#54A858",
    fontSize: 14,
    lineHeight: "20px",
    marginTop: "6px",
  },
  errorText: {
    color: "#D32F2F",
    fontSize: 14,
    lineHeight: "20px",
    marginTop: "6px",
  },
}));
