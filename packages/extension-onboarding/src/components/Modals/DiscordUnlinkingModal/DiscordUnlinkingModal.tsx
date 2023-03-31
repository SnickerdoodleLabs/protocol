import { useStyles } from "@extension-onboarding/components/Modals/LinkAccountModal/LinkAccountModal.style";
import { useAccountLinkingContext } from "@extension-onboarding/context/AccountLinkingContext";
import { useLayoutContext } from "@extension-onboarding/context/LayoutContext";
import { Box, Button, Dialog, IconButton, Typography } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import React, { FC } from "react";

interface IDiscordUnlinkingModal {
  closeModal: () => void;
}
const DiscordUnlinkingModal: FC<IDiscordUnlinkingModal> = ({
  closeModal,
}: IDiscordUnlinkingModal) => {
  const { detectedProviders, unDetectedProviders, onProviderConnectClick } =
    useAccountLinkingContext();

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

        <Box
          mt={4}
          display="flex"
          alignItems="center"
          border="1px solid #D9D9D9"
          p={3}
          borderRadius={8}
        >
          <Box display="flex" marginLeft="auto">
            <Button
              onClick={() => {
                closeModal();
              }}
              className={classes.button}
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
