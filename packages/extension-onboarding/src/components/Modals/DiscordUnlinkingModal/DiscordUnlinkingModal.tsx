import { useStyles } from "@extension-onboarding/components/Modals/DiscordUnlinkingModal/DiscordUnlinkingModal.style";
import ExclamationIcon from "@extension-onboarding/assets/icons/exclamationIcon.svg";
import {
  Box,
  Button,
  Dialog,
  IconButton,
  Input,
  TextField,
  Typography,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import React, { FC, useState } from "react";

interface IDiscordUnlinkingModal {
  profileName: string;
  closeModal: () => void;
  unlinkAccount: () => void;
}
const DiscordUnlinkingModal: FC<IDiscordUnlinkingModal> = ({
  closeModal,
  unlinkAccount,
  profileName,
}: IDiscordUnlinkingModal) => {
  const randomNumber = () => {
    return Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
  };

  const [code, setCode] = useState<number>(randomNumber());
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [codeMatchStatus, setCodeMatchStatus] = useState<boolean>(false);
  const [codeInputs, setCodeInputs] = useState<string[]>(["-1", "-1", "-1", "-1"]);

  const handleChange = (e) => {
    const id = Number(e.target.id);
    codeInputs[id] = e.target.value
    setCodeInputs(codeInputs);
    if(checkIfUserEnterAllInputs()){
      checkIfInputCorrect()
    }
  };

  const checkIfUserEnterAllInputs = () : boolean => {
    return codeInputs.every( input => Number(input) !== -1)
  }
  
  const checkIfInputCorrect = () : boolean => {
    const userInput = Number(codeInputs.join(""))
    if( userInput === code){
      setStatusMessage("Code is successfully matched");
      setCodeMatchStatus(true)
      return true;
    }else{
      setStatusMessage("This code does not match");
      setCodeMatchStatus(true)
      return false;
     
    }
   
  }

  const classes = useStyles();
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
      <Box p={5}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography className={classes.title}>Unlink Account</Typography>
          <IconButton
            disableFocusRipple
            disableRipple
            disableTouchRipple
            aria-label="close"
            onClick={closeModal}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Box mt={4} className={classes.bodyContainer} p={3}>
          <Box>
            <img className={classes.exclamationIcon} src={ExclamationIcon} />
          </Box>
          <Box mt={5}>
            <Typography className={classes.subTitle}>
              This will permanently unlink your account
            </Typography>
          </Box>
          <Box mt={4} mb={4}>
            <Typography className={classes.description}>
              Are you sure that you want to unlink your
              <Box component="span" className={classes.subTitle}>
                {` ${profileName} `}
              </Box>
              account? If you are sure, you can continue the process by typing
              the code below.
            </Typography>
          </Box>

          <Box className={classes.typeCodeContainer} mt={5}>
            <Box>
              <Typography className={classes.description}>Code</Typography>
              <Box className={classes.codeContainer}>{code}</Box>
            </Box>
            <Box>
              <Typography className={classes.description}>
                Please type the code
              </Typography>
              <Box className={classes.codeTextInputContainer}>
              {codeInputs.map((_data , index) => {
                return (
                  <TextField
                    onChange={(e) => {
                      handleChange(e);
                    }}
                    className={classes.codeInputFields}
                    id={String(index)}
                    type="tel"
                    variant="outlined"
                    key={index}
                    InputProps={{ className: classes.codeTextInput }}
                    inputProps={{
                      style: { textAlign: "center" },
                      min: 0,
                      maxLength: 1,
                      inputMode: "text",
                      pattern: "[0-9]",
                    }}
                  />
                );
              })}
              </Box>
              { codeMatchStatus && ( <Typography className={classes.description}>
                {statusMessage}
              </Typography>)}
            </Box>
          </Box>

          <Box display="flex" marginLeft="auto">
            <Button
              onClick={() => {
                closeModal();
              }}
              className={classes.button}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if(checkIfInputCorrect()){
                  unlinkAccount();
                }
              }}
              className={classes.unlinkAccountButton}
            >
              Unlink Account
            </Button>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
};

export default DiscordUnlinkingModal;
