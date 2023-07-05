import { useStyles } from "@extension-onboarding/components/Modals/LinkAccountModal/LinkAccountModal.style";
import { useAccountLinkingContext } from "@extension-onboarding/context/AccountLinkingContext";
import { Box, Button, Dialog, IconButton, Typography } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import React, { FC } from "react";

interface ILinkAccountModalProps {
  closeModal: () => void;
}
const LinkAccountModal: FC<ILinkAccountModalProps> = ({
  closeModal,
}: ILinkAccountModalProps) => {
  const { detectedProviders, unDetectedProviders, onProviderConnectClick } =
    useAccountLinkingContext();

  const classes = useStyles();
  return (
    <Dialog
      open={true}
      fullWidth
      PaperProps={{
        style: { zIndex: 9999999999 },
        square: true,
      }}
      disablePortal
      maxWidth="xs"
      className={classes.container}
    >
      <Box p={5}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography className={classes.title}>
            Link Your Crypto Accounts
          </Typography>
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
        {detectedProviders?.map((provider) => (
          <Box
            mt={4}
            display="flex"
            alignItems="center"
            border="1px solid #D9D9D9"
            p={3}
            borderRadius={8}
            key={provider.key}
          >
            <img src={provider.icon} />
            <Box ml={3}>
              <Typography className={classes.label}>{provider.name}</Typography>
            </Box>
            <Box display="flex" marginLeft="auto">
              <Button
                onClick={() => {
                  onProviderConnectClick(provider);
                  closeModal();
                }}
                className={classes.button}
              >
                Link Account
              </Button>
            </Box>
          </Box>
        ))}
      </Box>
    </Dialog>
  );
};

export default LinkAccountModal;
