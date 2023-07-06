import { useStyles } from "@extension-onboarding/components/Modals/LinkAccountModal/LinkAccountModal.style";
import { useAccountLinkingContext } from "@extension-onboarding/context/AccountLinkingContext";
import { Box, Dialog, IconButton, Typography } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { Button } from "@snickerdoodlelabs/shared-components";
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
      maxWidth="sm"
      className={classes.container}
    >
      <Box p={3}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography className={classes.title}>
            Link Your Crypto Accounts
          </Typography>
          <CloseIcon onClick={closeModal} style={{ cursor: "pointer" }} />
        </Box>
        {detectedProviders?.map((provider) => (
          <Box
            mt={4}
            display="flex"
            alignItems="center"
            border="1px solid #D9D9D9"
            p={3}
            borderRadius={12}
            key={provider.key}
          >
            <img src={provider.icon} />
            <Box ml={3}>
              <Typography className={classes.label}>{provider.name}</Typography>
            </Box>
            <Box display="flex" marginLeft="auto">
              <Button
                buttonType="secondary"
                onClick={() => {
                  onProviderConnectClick(provider);
                  closeModal();
                }}
              >
                Link Account
              </Button>
            </Box>
          </Box>
        ))}
        <Box mt={4}>
          <Typography className={classes.description}>
            By linking crypto account you are giving permission for the use of
            your Web3 activity to generate market trends. All information is
            anonymous and no insights are linked back to you.
          </Typography>
        </Box>
      </Box>
    </Dialog>
  );
};

export default LinkAccountModal;
