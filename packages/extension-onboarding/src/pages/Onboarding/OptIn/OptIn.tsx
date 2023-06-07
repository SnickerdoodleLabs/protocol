import optInBg from "@extension-onboarding/assets/images/opt-in-bg.svg";
import { Button } from "@snickerdoodlelabs/shared-components";
import { EAlertSeverity } from "@extension-onboarding/components/CustomizedAlert";
import { LOCAL_STORAGE_SDL_INVITATION_KEY } from "@extension-onboarding/constants";
import { EPaths } from "@extension-onboarding/containers/Router/Router.paths";
import { useAppContext } from "@extension-onboarding/context/App";
import { useLayoutContext } from "@extension-onboarding/context/LayoutContext";
import { useNotificationContext } from "@extension-onboarding/context/NotificationContext";
import { useStyles } from "@extension-onboarding/pages/Onboarding/OptIn/OptIn.style";
import { IWindowWithSdlDataWallet } from "@extension-onboarding/services/interfaces/sdlDataWallet/IWindowWithSdlDataWallet";
import { Box, CircularProgress, Typography } from "@material-ui/core";
import {
  BigNumberString,
  EInvitationStatus,
  EVMContractAddress,
  IOpenSeaMetadata,
  Signature,
} from "@snickerdoodlelabs/objects";
import React, { useEffect, useState, FC, useCallback } from "react";
import { useNavigate } from "react-router-dom";

declare const window: IWindowWithSdlDataWallet;
const OptIn: FC = () => {
  const [invitationMeta, setInvitationMeta] = useState<IOpenSeaMetadata>();
  const [acceptLoading, setAcceptLoading] = useState<boolean>(false);
  const classes = useStyles();
  const { invitationInfo } = useAppContext();
  const { setLoadingStatus } = useLayoutContext();
  const { setAlert } = useNotificationContext();
  const navigate = useNavigate();
  useEffect(() => {
    getInvitationData();
  }, [JSON.stringify(invitationInfo)]);

  useEffect(() => {
    setLoadingStatus(true);
  }, []);

  useEffect(() => {
    if (invitationMeta) {
      setLoadingStatus(false);
      acceptInvitation(
        invitationInfo.consentAddress!,
        invitationInfo.tokenId,
        invitationInfo.signature,
      );
    }
  }, [JSON.stringify(invitationMeta)]);

  const navigateToNext = useCallback(() => {
    setLoadingStatus(false);
    navigate(EPaths.ONBOARDING_TAG_SELECTION);
  }, []);

  const getInvitationData = useCallback(() => {
    if (!invitationInfo.consentAddress) {
      return navigateToNext();
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
      .map((invitationStatus) => {
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
        return navigateToNext();
      })
      .mapErr((e) => {
        return navigateToNext();
      });
  }, [invitationInfo]);

  const acceptInvitation = (
    consentContractAddress: EVMContractAddress,
    tokenId?: BigNumberString,
    signature?: Signature,
  ) => {
    setAcceptLoading(true);
    return window.sdlDataWallet
      .getDefaultPermissions()
      .andThen((permissions) =>
        window.sdlDataWallet.acceptInvitation(
          permissions,
          consentContractAddress,
          tokenId,
          signature,
        ),
      )
      .mapErr((e) => {
        setAlert({
          severity: EAlertSeverity.ERROR,
          message: "Error Optin Failed!",
        });
        navigateToNext();
      })
      .map(() => {
        setAcceptLoading(false);
      });
  };

  if (!invitationMeta) {
    return null;
  }

  return (
    <Box width={460} display="flex" flexDirection="column" marginX="auto">
      <Box
        style={{ backgroundImage: `url(${optInBg})` }}
        display="flex"
        width="100%"
        height={300}
        pt={15}
        justifyContent="center"
      ></Box>
      <Box display="flex" alignItems="center" flexDirection="column">
        <img
          style={{ marginTop: -200 }}
          width={320}
          height="auto"
          src={invitationMeta.image}
        />
        {acceptLoading ? (
          <CircularProgress />
        ) : (
          <Box display="flex" flexDirection="column" alignItems="center" px={5}>
            <Typography className={classes.title}>CONGRATS</Typography>
            <Typography className={classes.subtitle}>
              YOUR NFT HAS BEEN REWARDED
            </Typography>
            <Box
              mt={8}
              display="flex"
              flexDirection="column"
              alignItems="center"
              px={5}
            >
              <Button
                onClick={() => {
                  navigateToNext();
                }}
                fullWidth
              >
                Next
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};
export default OptIn;
