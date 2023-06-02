import SDLogo from "@extension-onboarding/assets/icons/snickerdoodleLogo.svg";
import RewardBG from "@extension-onboarding/assets/images/rewardBg.svg";
import { EModalSelectors } from "@extension-onboarding/components/Modals";
import { useStyles } from "@extension-onboarding/components/Modals/CampaignPopup/CampaignPopup.style";
import { LOCAL_STORAGE_SDL_INVITATION_KEY } from "@extension-onboarding/constants";
import { useAppContext } from "@extension-onboarding/context/App";
import { useLayoutContext } from "@extension-onboarding/context/LayoutContext";
import { useNotificationContext } from "@extension-onboarding/context/NotificationContext";
import { IWindowWithSdlDataWallet } from "@extension-onboarding/services/interfaces/sdlDataWallet/IWindowWithSdlDataWallet";
import { Box, Dialog, IconButton, Typography } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

import {
  AccountAddress,
  BigNumberString,
  EInvitationStatus,
  EVMContractAddress,
  EWalletDataType,
  IOpenSeaMetadata,
  Signature,
} from "@snickerdoodlelabs/objects";
import { Button } from "@snickerdoodlelabs/shared-components";
import { okAsync } from "neverthrow";
import React, { useEffect, useState, FC, useCallback } from "react";

declare const window: IWindowWithSdlDataWallet;
const CampaignPopup: FC = () => {
  const [invitationMeta, setInvitationMeta] = useState<IOpenSeaMetadata>();
  const [loading, setLoading] = useState<boolean>(false);
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const { setModal, setLoadingStatus, closeModal } = useLayoutContext();
  const {
    invitationInfo,
    updateOptedInContracts,
    setInvitationInfo,
    isProductTourCompleted,
  } = useAppContext();
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
          try {
            if (localStorage.getItem(LOCAL_STORAGE_SDL_INVITATION_KEY)) {
              localStorage.removeItem(LOCAL_STORAGE_SDL_INVITATION_KEY);
            }
          } catch (e) {}
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
        updateOptedInContracts();
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
    return setModal({
      modalSelector: EModalSelectors.PERMISSION_SELECTION,
      onPrimaryButtonClick: ({
        eligibleRewards,
        missingRewards,
        dataTypes,
      }) => {
        setModal({
          modalSelector: EModalSelectors.SUBSCRIPTION_CONFIRMATION_MODAL,
          onPrimaryButtonClick: (receivingAccount: AccountAddress) => {
            setLoadingStatus(true);
            window.sdlDataWallet
              .setReceivingAddress(
                invitationInfo.consentAddress!,
                receivingAccount,
              )
              .map(() => {
                acceptInvitation(
                  dataTypes,
                  invitationInfo.consentAddress!,
                  invitationInfo.tokenId,
                  invitationInfo.signature,
                );
              });
          },
          customProps: {
            eligibleRewards,
            missingRewards,
            dataTypes,
            campaignName: invitationMeta?.rewardName,
            campaignImage: invitationMeta?.image,
            consentAddress: invitationInfo.consentAddress!,
          },
        });
      },
      customProps: {
        consentContractAddress: invitationInfo.consentAddress!,
        campaignInfo: invitationMeta,
        onCloseClicked: () => {
          handleClose();
        },
      },
    });
  };

  if (loading) {
  }
  if (!invitationMeta || !open || !isProductTourCompleted) {
    return null;
  }

  const handleClose = () => {
    setInvitationInfo({
      consentAddress: undefined,
      tokenId: undefined,
      signature: undefined,
      rewardImage: undefined,
    });
    try {
      if (localStorage.getItem(LOCAL_STORAGE_SDL_INVITATION_KEY)) {
        localStorage.removeItem(LOCAL_STORAGE_SDL_INVITATION_KEY);
      }
    } catch (e) {}
    setInvitationMeta(undefined);
    setOpen(false);
  };

  return (
    <>
      <Dialog onClose={handleClose} open={true}>
        <Box width={548} minHeight={497}>
          <Box height={240} style={{ backgroundImage: `url(${RewardBG})` }}>
            <Box display="flex" justifyContent="space-between">
              <Box ml="auto">
                <IconButton
                  disableFocusRipple
                  disableRipple
                  disableTouchRipple
                  aria-label="close"
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
              mt={0.25}
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
              pb={2}
            >
              <Box
                bgcolor="rgba(128, 121, 180, 0.5)"
                borderRadius={4}
                px={1.5}
                py={0.3}
              >
                <Typography className={classes.rewardName}>
                  {invitationMeta.rewardName}
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box mx={11} textAlign="center">
            <Box mt={3} mb={2}>
              <Typography className={classes.rewardTitle}>
                {invitationMeta.title || "Join the Cohort!"}
              </Typography>
            </Box>
            <Box mb={2}>
              <Typography className={classes.subtitle}>
                {invitationMeta.description}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" justifyContent="center">
              <Box mr={2}>
                <Button onClick={handleClose} buttonType="secondary">
                  Cancel
                </Button>
              </Box>
              <Box>
                <Button buttonType="primary" onClick={onClaimClick}>
                  Join
                </Button>
              </Box>
            </Box>
          </Box>
          <Box px={3} mb={1} mt={3}>
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
