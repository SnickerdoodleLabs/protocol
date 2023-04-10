import ExclamationIcon from "@extension-onboarding/assets/icons/exclamationIcon.svg";
import { useStyles } from "@extension-onboarding/components/Modals/DiscordUnlinkingModal/DiscordUnlinkingModal.style";
import {
  Box,
  Button,
  Dialog,
  Grid,
  IconButton,
  Input,
  TextField,
  Typography,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import clsx from "clsx";
import React, { FC, useMemo, useState } from "react";

interface IDiscordUnlinkingModal {
  profileName: string;
  closeModal: () => void;
  unlinkAccount: () => void;
}

const OTP_DIGIT_COUNT = 4;

const DiscordUnlinkingModal: FC<IDiscordUnlinkingModal> = ({
  closeModal,
  unlinkAccount,
  profileName,
}: IDiscordUnlinkingModal) => {
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
          <Typography className={classes.title}>Unlink Account</Typography>

          <CloseIcon className={classes.pointer} onClick={closeModal} />
        </Box>

        <Box display="flex" justifyContent="center">
          <img className={classes.exclamationIcon} src={ExclamationIcon} />
        </Box>
        <Box mt={3} display="flex" justifyContent="center">
          <Typography className={classes.subTitle}>
            This will permanently unlink your account
          </Typography>
        </Box>
        <Box mt={2} mb={5} display="flex" justifyContent="flex-start">
          <Typography className={classes.description}>
            Are you sure that you want to unlink your
            <span className={clsx(classes.subTitle, classes.uppercase)}>
              {` ${profileName} `}
            </span>
            account? If you are sure, you can continue the process by typing the
            code below.
          </Typography>
        </Box>
        <Box display="flex">
          <Box mr={3}>
            <Typography className={classes.label}>Code</Typography>
            <Box mt={1} className={classes.codeContainer}>
              {code}
            </Box>
          </Box>
          <Box>
            <Typography className={classes.label}>
              Please type the code here
            </Typography>
            <Box mt={1} className={classes.codeTextInputContainer}>
              {otp?.map((data, index) => (
                <input
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
              <Typography className={classes.errorText}>
                This code does not match
              </Typography>
            )}
            {isSuccess && (
              <Typography className={classes.successText}>
                Code is successfully matched
              </Typography>
            )}
          </Box>
        </Box>
        <Box display="flex" marginLeft="auto" mt={3} justifyContent="flex-end">
          <Button onClick={closeModal} className={classes.button}>
            Cancel
          </Button>
          <Button
            disabled={!isSuccess}
            onClick={unlinkAccount}
            className={classes.unlinkAccountButton}
          >
            Unlink Account
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default DiscordUnlinkingModal;
