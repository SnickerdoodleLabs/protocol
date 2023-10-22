import ExclamationIcon from "@extension-onboarding/assets/icons/exclamationIcon.svg";
import { useLayoutContext } from "@extension-onboarding/context/LayoutContext";
import { Box, Dialog, makeStyles } from "@material-ui/core";
import {
  CloseButton,
  SDTypography,
  SDButton,
} from "@snickerdoodlelabs/shared-components";
import React, { FC, useMemo, useState } from "react";

const useStyles = makeStyles((theme) => ({
  container: {
    "& .MuiDialog-paper": {
      borderRadius: 12,
      maxWidth: 640,
    },
  },
  codeContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid #D9D9D9",
    borderRadius: "8px",
    fontWeight: 700,
    fontFamily: "Roboto",
    fontSize: "33px",
    lineHeight: "39px",
    width: "100px",
    height: "64px",
    gap: "4px",
    [theme.breakpoints.down("xs")]: {
      width: 80,
      height: 48,
      fontSize: 24,
    },
  },
  codeTextInputContainer: {
    display: "flex",
    alignItems: "center",
  },
  otpInput: {
    marginRight: 8,
    width: 64,
    height: 64,
    fontSize: 33,
    fontFamily: "Roboto",
    [theme.breakpoints.down("xs")]: {
      width: 48,
      height: 48,
      fontSize: 24,
    },
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
      [theme.breakpoints.down("xs")]: {
        fontSize: 24,
      },
    },
    "&::placeholder": {
      color: "#D0D5DD",
    },
  },
}));

export interface IOTPModal {
  title: string;
  subtitle: string;
  description: string | JSX.Element;
  actionText: string;
}

const OTP_DIGIT_COUNT = 4;

const OTPModal: FC = () => {
  const { modalState, closeModal } = useLayoutContext();
  const { onPrimaryButtonClick, customProps } = modalState;
  const { title, subtitle, description, actionText } = customProps as IOTPModal;
  const randomNumber = () => {
    return Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
  };

  const [code, setCode] = useState<number>(randomNumber());
  const [otp, setOtp] = useState<string[]>(new Array(OTP_DIGIT_COUNT).fill(""));

  const inputCountMatch = useMemo(
    () => otp.filter(Boolean).length === OTP_DIGIT_COUNT,
    [JSON.stringify(otp)],
  );

  const isError = useMemo(
    () =>
      otp.filter(Boolean).length === OTP_DIGIT_COUNT &&
      Number(otp.join("")) != code,
    [JSON.stringify(otp)],
  );

  const isSuccess = useMemo(
    () => inputCountMatch && !isError,
    [inputCountMatch, isError],
  );

  const handleChange = (target, index) => {
    if (!isNaN(target.value)) {
      setOtp([...otp.map((d, idx) => (idx === index ? target.value : d))]);
      //Focus next input
      if (target.nextElementSibling && target.value) {
        target.nextElementSibling.focus();
      }
    }
  };

  const handleKeyPress = (event) => {
    if (event.keyCode == 9) {
      event.preventDefault();
    }
    if (
      event.key == "Backspace" &&
      !event.target.value &&
      event.target.previousElementSibling
    ) {
      event.target.previousElementSibling.focus();
    }
  };

  const handlePaste = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const clipboardData = e.clipboardData;
    const pastedData = clipboardData.getData("Text");
    const otpString = pastedData.trim();
    const otpArr = otpString.split("");
    if (
      otpArr.length == OTP_DIGIT_COUNT &&
      !otpArr.filter((digit) => isNaN(digit)).length
    ) {
      setOtp(otpArr);
    } else {
    }
  };

  const classes = useStyles({ isSuccess, isError });
  return (
    <Dialog
      open={true}
      fullWidth
      PaperProps={{
        square: true,
      }}
      disablePortal
      maxWidth="xs"
      className={classes.container}
    >
      <Box p={3}>
        <Box
          display="flex"
          alignItems="flex-start"
          justifyContent="space-between"
        >
          <SDTypography variant="titleLg" fontWeight="bold" color="textHeading">
            {title}
          </SDTypography>

          <CloseButton onClick={closeModal} />
        </Box>

        <Box display="flex" justifyContent="center">
          <img width={42} height={42} src={ExclamationIcon} />
        </Box>
        <Box mt={3} display="flex" justifyContent="center">
          <SDTypography variant="titleMd" fontWeight="bold" color="textHeading">
            {subtitle}
          </SDTypography>
        </Box>
        <Box mt={2} mb={5} display="flex" justifyContent="flex-start">
          <SDTypography variant="bodyLg">{description}</SDTypography>
        </Box>
        <Box display="flex">
          <Box mr={3}>
            <SDTypography variant="labelLg" fontWeight="medium">
              Code
            </SDTypography>
            <Box mt={1} className={classes.codeContainer}>
              {code}
            </Box>
          </Box>
          <Box>
            <SDTypography variant="labelLg" fontWeight="medium">
              Please type the code here
            </SDTypography>
            <Box mt={1} className={classes.codeTextInputContainer}>
              {otp?.map((data, index) => (
                <input
                  key={index}
                  className={classes.otpInput}
                  type="text"
                  inputMode="numeric"
                  placeholder="0"
                  autoFocus={index === 0}
                  name="otp"
                  onPaste={(e) => handlePaste(e)}
                  maxLength={1}
                  value={data}
                  onKeyDown={(e) => handleKeyPress(e)}
                  onChange={(e) => handleChange(e.target, index)}
                />
              ))}
            </Box>
            {isError && (
              <Box mt={0.5}>
                <SDTypography variant="labelSm" color="textError">
                  This code does not match
                </SDTypography>
              </Box>
            )}
            {isSuccess && (
              <Box mt={0.5}>
                <SDTypography variant="labelSm" color="textSuccess">
                  Code is successfully matched
                </SDTypography>
              </Box>
            )}
          </Box>
        </Box>
        <Box display="flex" marginLeft="auto" mt={3} justifyContent="flex-end">
          <SDButton onClick={closeModal} variant="outlined" color="danger">
            Cancel
          </SDButton>
          <Box ml={2} />
          <SDButton
            variant="contained"
            color="danger"
            disabled={!isSuccess}
            onClick={() => {
              onPrimaryButtonClick();
              closeModal();
            }}
          >
            {actionText}
          </SDButton>
        </Box>
      </Box>
    </Dialog>
  );
};

export default OTPModal;
