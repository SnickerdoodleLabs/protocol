import { Box, Button, Dialog, IconButton, Typography } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import {
  BigNumberString,
  EInvitationStatus,
  EVMContractAddress,
  EWalletDataType,
  IOpenSeaMetadata,
  Signature,
  TokenId,
} from "@snickerdoodlelabs/objects";
import { okAsync } from "neverthrow";
import React, { useEffect, useState, FC, useCallback } from "react";

import SDLogo from "@extension-onboarding/assets/icons/snickerdoodleLogo.svg";
import RewardBG from "@extension-onboarding/assets/images/rewardBg.svg";
import { EModalSelectors } from "@extension-onboarding/components/Modals";
import { useStyles } from "@extension-onboarding/components/Modals/CampaignPopup/CampaignPopup.style";
import { LOCAL_STORAGE_SDL_INVITATION_KEY } from "@extension-onboarding/constants";
import { useAppContext } from "@extension-onboarding/context/App";
import { useLayoutContext } from "@extension-onboarding/context/LayoutContext";
import { IWindowWithSdlDataWallet } from "@extension-onboarding/services/interfaces/sdlDataWallet/IWindowWithSdlDataWallet";
import { useNotificationContext } from "@extension-onboarding/context/NotificationContext";

declare const window: IWindowWithSdlDataWallet;
const CampaignPopup: FC = () => {
  const [invitationMeta, setInvitationMeta] = useState<IOpenSeaMetadata>();
  const [loading, setLoading] = useState<boolean>(false);
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const { setModal, setLoadingStatus, closeModal } = useLayoutContext();
  const { invitationInfo, setInvitationInfo } = useAppContext();
  const { setVisualAlert } = useNotificationContext();

  useEffect(() => {
    if (invitationInfo.consentAddress) {
      getInvitationData();
    }
  }, [JSON.stringify(invitationInfo)]);

  useEffect(() => {
    if (invitationMeta) {
      setOpen(true);
    }
  }, [JSON.stringify(invitationMeta)]);

  const getInvitationData = () => {
    if (!invitationInfo.consentAddress) {
      return null;
    }
    try {
      if (localStorage.getItem(LOCAL_STORAGE_SDL_INVITATION_KEY)) {
        localStorage.removeItem(LOCAL_STORAGE_SDL_INVITATION_KEY);
      }
    } catch (e) {}
    return window.sdlDataWallet
      .checkInvitationStatus(
        invitationInfo.consentAddress,
        invitationInfo.signature,
        invitationInfo.tokenId,
      )
      .andThen((invitationStatus) => {
        if (invitationStatus === EInvitationStatus.New) {
          return window.sdlDataWallet
            .getConsentContractCID(invitationInfo.consentAddress!)
            .andThen((ipfsCID) => {
              return window.sdlDataWallet.getInvitationMetadataByCID(ipfsCID);
            })
            .map((invitationMetaData) => {
              setInvitationMeta(invitationMetaData);
            });
        }
        if (
          [
            EInvitationStatus.OutOfCapacity,
            EInvitationStatus.Accepted,
            EInvitationStatus.Occupied,
          ].includes(invitationStatus)
        ) {
          setInvitationInfo({
            consentAddress: undefined,
            tokenId: undefined,
            signature: undefined,
            rewardImage: undefined,
          });
          localStorage.removeItem(LOCAL_STORAGE_SDL_INVITATION_KEY);
          setModal({
            modalSelector: EModalSelectors.CUSTOMIZABLE_MODAL,
            onPrimaryButtonClick: () => {},
            customProps: {
              title: "Thank you for your interest!",
              message: (() => {
                switch (invitationStatus) {
                  case EInvitationStatus.Accepted:
                    return "Looks like you have claimed this reward already. You can see your reward in your portfolio.";
                  case EInvitationStatus.Occupied:
                    return "Looks like this reward link has been reserved for another data wallet user.";
                  case EInvitationStatus.OutOfCapacity:
                    return "Looks like this reward was sold out.";
                  default:
                    return "";
                }
              })(),
              primaryButtonText: "Got it",
              secondaryButtonText: "",
              primaryClicked: () => {},
              secondaryClicked: () => {},
            },
          });
        }
        return okAsync(undefined);
      })
      .orElse((e) => {
        setLoading(false);
        return okAsync(undefined);
      });
  };

  const acceptInvitation = (
    dataTypes: EWalletDataType[] | null,
    consentContractAddress: EVMContractAddress,
    tokenId?: BigNumberString,
    signature?: Signature,
  ) => {
    setLoadingStatus(true);
    return window.sdlDataWallet
      .acceptInvitation(dataTypes, consentContractAddress, tokenId, signature)
      .mapErr((e) => {
        handleClose();
        setModal({
          modalSelector: EModalSelectors.CUSTOMIZABLE_MODAL,
          onPrimaryButtonClick: () => {},
          customProps: {
            title: "Thank you for your interest!",
            message: `Looks like this reward link has been reserved for another data wallet user.`,
            primaryButtonText: "Got it",
            secondaryButtonText: "",
            primaryClicked: () => {},
            secondaryClicked: () => {},
          },
        });
        setLoadingStatus(false);
      })
      .map(() => {
        setLoadingStatus(false);
        setVisualAlert(true);
        handleClose();
        setModal({
          modalSelector: EModalSelectors.CUSTOMIZABLE_MODAL,
          onPrimaryButtonClick: () => {},
          customProps: {
            title: "Congratulations",
            message: `You have successfully claimed your reward.\n\nOnce it is ready, your reward will appear on your portfolio. This may take upto 24 hours. `,
            primaryButtonText: "Got it",
            secondaryButtonText: "",
            primaryClicked: () => {},
            secondaryClicked: () => {},
          },
        });
      });
  };

  const onClaimClick = () => {
    setOpen(false);
    return window.sdlDataWallet
      .getApplyDefaultPermissionsOption()
      .map((option) => {
        if (option) {
          acceptInvitation(
            null,
            invitationInfo.consentAddress!,
            invitationInfo.tokenId,
            invitationInfo.signature,
          );
          return;
        }
        setModal({
          modalSelector: EModalSelectors.PERMISSION_SELECTION,
          onPrimaryButtonClick: () => {
            acceptInvitation(
              null,
              invitationInfo.consentAddress!,
              invitationInfo.tokenId,
              invitationInfo.signature,
            );
            closeModal();
          },
          customProps: {
            onCloseClicked: () => {
              handleClose();
            },
            onManageClicked: () => {
              setModal({
                modalSelector: EModalSelectors.MANAGE_PERMISSIONS,
                onPrimaryButtonClick: (dataTypes: EWalletDataType[]) => {
                  acceptInvitation(
                    dataTypes,
                    invitationInfo.consentAddress!,
                    invitationInfo.tokenId,
                    invitationInfo.signature,
                  );
                },
                customProps: {
                  onCloseClicked: () => {
                    handleClose();
                  },
                },
              });
            },
          },
        });
      });
  };

  if (loading) {
  }
  if (!invitationMeta || !open) {
    return null;
  }

  const handleClose = () => {
    setInvitationInfo({
      consentAddress: undefined,
      tokenId: undefined,
      signature: undefined,
      rewardImage: undefined,
    });
    setInvitationMeta(undefined);
    setOpen(false);
  };

  return (
    <>
      <Dialog onClose={handleClose} open={true}>
        <Box width={548} height={497}>
          <Box height={270} style={{ backgroundImage: `url(${RewardBG})` }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="baseline"
            >
              <Box pt={3} pl={4}>
                <img width="auto" height={18} src={SDLogo} />
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
                <img width="auto" height={145} src={invitationMeta.image} />
              </Box>
            </Box>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              pt={1}
            >
              <Box
                style={{
                  background: "rgba(128, 121, 180, 0.5)",
                  borderRadius: "4px",
                  gap: "10px",
                }}
              >
                <Typography
                  style={{
                    fontFamily: "Space Grotestk",
                    fontWeight: 500,
                    fontSize: "10px",
                    textAlign: "center",
                    color: "#222137",
                    padding: "3px 12px",
                  }}
                >
                  {invitationMeta.rewardName}
                </Typography>
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
                Join to Cohort!
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
                <Button onClick={handleClose} className={classes.buttonText}>
                  Not Interested
                </Button>
              </Box>
              <Box>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={onClaimClick}
                  className={classes.primaryButton}
                >
                  Join
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
export default CampaignPopup;
