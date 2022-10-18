import {
  Backdrop,
  Box,
  Button,
  Dialog,
  DialogTitle,
  Fade,
  IconButton,
  Modal,
  Typography,
} from "@material-ui/core";
import React, { useContext, useEffect, useMemo, useState, FC } from "react";
import PolygonCircle from "@extension-onboarding/assets/images/polygon-circle.png";
import RewardBG from "@extension-onboarding/assets/images/rewardBg.svg";
import SDLogo from "@extension-onboarding/assets/icons/snickerdoodleLogo.svg";
import { useStyles } from "@extension-onboarding/components/Modals/RewardCard/RewardCard.style";
import { IWindowWithSdlDataWallet } from "@extension-onboarding/services/interfaces/sdlDataWallet/IWindowWithSdlDataWallet";
import CloseIcon from "@material-ui/icons/Close";

declare const window: IWindowWithSdlDataWallet;
const RewardCard: FC = () => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <Dialog onClose={handleClose} open={open}>
        <Box width={548} height={477}>
          <Box height={240} style={{ backgroundImage: `url(${RewardBG})` }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="baseline"
            >
              <Box pt={3} pl={4}>
                <img width={122} height={18} src={SDLogo} />
              </Box>
              <Box>
                <IconButton
                  disableFocusRipple
                  disableRipple
                  disableTouchRipple
                  aria-label="close"
                  //   className={modalClasses.closeButton}
                  onClick={handleClose}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            </Box>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              mt={2}
            >
              <Box>
                <img width={244} height={145} src={PolygonCircle} />
              </Box>
            </Box>
          </Box>
          <Box mx={11} textAlign="center">
            <Box mt={3} mb={2}>
              <Typography
                style={{
                  fontFamily: "Shrikhand",
                  fontWeight: 400,
                  fontSize: 20,
                  fontStyle: "italic",
                  color: "#222137",
                }}
              >
                Claim Your NFT!
              </Typography>
            </Box>
            <Box mb={2}>
              <Typography className={classes.subtitle}>
                Connect your wallet with the Snickerdoodle Data Wallet to claim
                NFTs and other rewards!
              </Typography>
            </Box>
            <Box
              display="flex"
              justifyContent="space-evenly"
              alignItems="center"
            >
              <Box>
                <Button className={classes.buttonText}>Not Interested</Button>
              </Box>
              <Box>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => {}}
                  className={classes.primaryButton}
                >
                  Claim Reward
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 17 16"
                    fill="none"
                    fillRule="evenodd"
                    strokeLinecap="square"
                    strokeWidth={2}
                    stroke="currentColor"
                    aria-hidden="true"
                    className={classes.primaryButtonIcon}
                  >
                    <path
                      d="M1.808 14.535 14.535 1.806"
                      className="arrow-body"
                    />
                    <path
                      d="M3.379 1.1h11M15.241 12.963v-11"
                      className="arrow-head"
                    />
                  </svg>
                </Button>
              </Box>
            </Box>
          </Box>
          <Box px={7} my={3} textAlign="center">
            <Typography className={classes.footerText}>
              By accepting this Reward you are giving permission for the use of
              your profile and wallet activity to generate market trends. All
              information is anonymous and no insights are linked back to you.
            </Typography>
          </Box>
        </Box>
      </Dialog>
    </>
  );
};
export default RewardCard;
