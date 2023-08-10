import {
  Box,
  Typography,
  Button as MaterialButton,
  withStyles,
  Grid,
  Divider,
} from "@material-ui/core";
import {
  AccountAddress,
  EarnedReward,
  EInvitationStatus,
  EQueryProcessingStatus,
  ESocialType,
  ETag,
  EVMContractAddress,
  EWalletDataType,
  IConsentCapacity,
  IOpenSeaMetadata,
  IpfsCID,
  PossibleReward,
  QueryStatus,
  QueryTypePermissionMap,
} from "@snickerdoodlelabs/objects";
import {
  PermissionBar,
  Permissions,
  PERMISSIONS_WITH_ICONS,
  UI_SUPPORTED_PERMISSIONS,
} from "@snickerdoodlelabs/shared-components";
import { set } from "date-fns";
import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useLocation, useNavigate } from "react-router-dom";

import Breadcrumb from "@extension-onboarding/components/Breadcrumb";
import { EAlertSeverity } from "@extension-onboarding/components/CustomizedAlert";
import { EModalSelectors } from "@extension-onboarding/components/Modals";
import { useAccountLinkingContext } from "@extension-onboarding/context/AccountLinkingContext";
import { EAppModes, useAppContext } from "@extension-onboarding/context/App";
import { useLayoutContext } from "@extension-onboarding/context/LayoutContext";
import { useNotificationContext } from "@extension-onboarding/context/NotificationContext";
import {
  PermissionManagerContextProvider,
  usePermissionContext,
} from "@extension-onboarding/context/PermissionContext";
import {
  CollectedRewards,
  ProgramRewards,
} from "@extension-onboarding/pages/Details/screens/RewardProgramDetails/components/Sections";
import { useStyles } from "@extension-onboarding/pages/Details/screens/RewardProgramDetails/RewardProgramDetails.style";
import { useDataWalletContext } from "@extension-onboarding/context/DataWalletContext";
import {
  getRewardsAfterRewardsWereDeliveredFromIP,
  getRewardsBeforeRewardsWereDeliveredFromIP,
} from "@extension-onboarding/utils";

const ManageSettingsButton = withStyles({
  root: {
    paddingLeft: 16,
    paddingRight: 16,
    boxShadow: "0px 2px 0px rgba(0, 0, 0, 0.016)",
    color: "#454165",
    border: "1px solid",
    borderColor: "#B9B6D3",
    fontStyle: "normal",
    fontFamily: "Space Grotesk",
    fontWeight: 500,
    height: 43,
    fontSize: "14px",
    lineHeight: "26px",
    textTransform: "none",
    backgroundColor: "#fff",
    "&:hover": {
      backgroundColor: "#fff",
    },
  },
})(MaterialButton);

const SubscribeButton = withStyles({
  root: {
    paddingLeft: 16,
    paddingRight: 16,
    boxShadow: "0px 2px 0px rgba(0, 0, 0, 0.016)",
    color: "#F2F4F7",
    border: "1px solid",
    borderColor: "#B9B6D3",
    borderRadius: 8,
    fontStyle: "normal",
    fontFamily: "Roboto",
    fontWeight: 700,
    height: 48,
    fontSize: "14px",
    lineHeight: "26px",
    textTransform: "none",
    backgroundColor: "#8079B4",
    "&:hover": {
      backgroundColor: "#8079B4",
    },
  },
})(MaterialButton);

const RewardProgramDetails: FC = () => {
  const [queryStatus, setQueryStatus] = useState<QueryStatus | null>();

  const classes = useStyles();
  const {
    tag = "",
    possibleRewards = [],
    info,
    consentContractAddress,
  } = (useLocation().state || {}) as {
    tag: ETag;
    possibleRewards: PossibleReward[];
    info?: IOpenSeaMetadata;
    consentContractAddress: EVMContractAddress;
  };
  const rewardsRef = useRef<PossibleReward[]>([]);
  const { ref: saveButtonRef, inView: isSaveButtonInView } = useInView({
    threshold: 0.5,
  });
  const { sdlDataWallet } = useDataWalletContext();
  const { generateAllPermissions, isSafe, updateProfileValues } =
    usePermissionContext();
  const generateSuccessMessage = (dataType: EWalletDataType) => {
    return `Your "${PERMISSIONS_WITH_ICONS[dataType]!.name
      }" data has successfully saved`;
  };
  const [capacityInfo, setCapacityInfo] = useState<IConsentCapacity>();
  const [consentPermissions, setConsentPermissions] = useState<
    EWalletDataType[]
  >([]);
  const {
    optedInContracts,
    earnedRewards,
    updateOptedInContracts,
    appMode,
    setLinkerModalOpen,
  } = useAppContext();
  const { setAlert } = useNotificationContext();
  const { setModal, setLoadingStatus, closeModal } = useLayoutContext();
  const { twitterProvider, discordProvider } = useAccountLinkingContext();
  const [permissionsState, setPermissionsState] = useState<EWalletDataType[]>(
    [],
  );

  useEffect(() => {
    if (consentPermissions.length > 0) {
      setPermissionsState(consentPermissions);
    }
  }, [JSON.stringify(consentPermissions)]);

  const handleSocialLink = async (socialType: ESocialType) => {
    switch (socialType) {
      case ESocialType.TWITTER: {
        return twitterProvider
          .getOAuth1aRequestToken()
          .map((tokenAndSecret) => {
            window.open(
              twitterProvider.getTwitterApiAuthUrl(tokenAndSecret),
              `_blank`,
            );
          });
      }
      case ESocialType.DISCORD: {
        return discordProvider.installationUrl(true).map((url) => {
          window.open(url, `_blank`);
        });
      }
      default: {
        return;
      }
    }
  };

  const handleSubscribeButton = () => {
    if (appMode != EAppModes.AUTH_USER) {
      return setLinkerModalOpen();
    }

    setModal({
      modalSelector: EModalSelectors.SUBSCRIPTION_CONFIRMATION_MODAL,
      onPrimaryButtonClick: (receivingAccount: AccountAddress) => {
        setLoadingStatus(true);
        sdlDataWallet
          .setReceivingAddress(consentContractAddress, receivingAccount)
          .map(() => {
            sdlDataWallet
              .acceptInvitation(permissionsState, consentContractAddress)
              .map(() => {
                updateOptedInContracts();
                setLoadingStatus(false);
                setModal({
                  modalSelector: EModalSelectors.SUBSCRIPTION_SUCCESS_MODAL,
                  onPrimaryButtonClick: () => { },
                  customProps: {
                    campaignImage: info?.image,
                    campaignName: info?.rewardName,
                  },
                });
              })
              .mapErr(() => {
                setLoadingStatus(false);
                setAlert({
                  severity: EAlertSeverity.ERROR,
                  message: `${info?.rewardName} Rewards Program Subscription Failed!`,
                });
              });
          });
      },
      customProps: {
        onCloseClicked: () => { },
        campaignImage: info?.image,
        rewardsThatCanBeAcquired,
        rewardsThatRequireMorePermission,
        dataTypes: permissionsState,
        consentContractAddress,
        campaignName: info?.rewardName,
      },
    });
  };

  const getCapacityInfo = () => {
    sdlDataWallet
      ?.getConsentCapacity(consentContractAddress)
      .map((capacity) => {
        setCapacityInfo(capacity);
      });
  };

  const isSubscribed = useMemo(() => {
    return optedInContracts.includes(consentContractAddress);
  }, [JSON.stringify(optedInContracts), consentContractAddress]);

  useEffect(() => {
    if (possibleRewards.length > 0) {
      sdlDataWallet
        .getQueryStatusByQueryCID(possibleRewards[0].queryCID)
        .map((queryStatus) => {
          setQueryStatus(queryStatus);
        });
    }
  }, [possibleRewards, earnedRewards]);

  useEffect(() => {
    if (!isSubscribed && appMode === EAppModes.AUTH_USER) {
      sdlDataWallet
        .checkInvitationStatus(consentContractAddress)
        .map((invitationStatus) => {
          if (invitationStatus === EInvitationStatus.Accepted)
            updateOptedInContracts();
        });
    }
  }, [consentContractAddress, isSubscribed, appMode]);

  useEffect(() => {
    getCapacityInfo();
  }, [consentContractAddress, isSubscribed]);

  useEffect(() => {
    if (isSubscribed) {
      getConsentPermissions();
    } else {
      setDefaultPermissions();
    }
  }, [isSubscribed]);

  const getConsentPermissions = () => {
    sdlDataWallet
      .getAgreementPermissions(consentContractAddress)
      .map((dataTypes) => {
        setConsentPermissions(dataTypes);
      });
  };

  const setDefaultPermissions = () => {
    generateAllPermissions().map((dataTypes) => {
      setPermissionsState(dataTypes);
    });
  };

  const {
    collectedRewards,
    rewardsThatRequireMorePermission,
    rewardsThatCanBeAcquired,
    rewardsThatTheUserWasIneligible,
    rewardsThatAreBeingProcessed,
  } = useMemo(() => {
    //earned rewards
    let collectedRewards: EarnedReward[] = [];
    let rewardsThatTheUserWasIneligible: PossibleReward[] = [];
    let rewardsThatAreBeingProcessed: PossibleReward[] = [];
    let rewardsThatCanBeAcquired: PossibleReward[] = [];
    let rewardsThatRequireMorePermission: PossibleReward[] = [];

    if (!isSubscribed) {
      const { rewardsThatCanBeEarned, rewardsThatCannotBeEarned } =
        getRewardsBeforeRewardsWereDeliveredFromIP(
          possibleRewards,
          permissionsState,
        );
      rewardsThatCanBeAcquired = rewardsThatCanBeEarned;
      rewardsThatRequireMorePermission = rewardsThatCannotBeEarned;
    } else if (queryStatus || isSubscribed) {
      if (
        queryStatus &&
        queryStatus.status === EQueryProcessingStatus.RewardsReceived
      ) {
        const {
          rewardsThatWereEarned,
          rewardsThatWereNotEarned,
          rewardsThatTheUserWereUnableToGet,
        } = getRewardsAfterRewardsWereDeliveredFromIP(
          possibleRewards,
          earnedRewards,
          consentPermissions,
        );

        collectedRewards = rewardsThatWereEarned;
        rewardsThatRequireMorePermission = rewardsThatWereNotEarned;
        rewardsThatTheUserWasIneligible = rewardsThatTheUserWereUnableToGet;
      } else {
        const { rewardsThatCanBeEarned, rewardsThatCannotBeEarned } =
          getRewardsBeforeRewardsWereDeliveredFromIP(
            possibleRewards,
            consentPermissions,
          );
        rewardsThatAreBeingProcessed = rewardsThatCanBeEarned;
        rewardsThatRequireMorePermission = rewardsThatCannotBeEarned;
      }
    } else {
      const { rewardsThatCanBeEarned, rewardsThatCannotBeEarned } =
        getRewardsBeforeRewardsWereDeliveredFromIP(
          possibleRewards,
          consentPermissions,
        );
      rewardsThatCanBeAcquired = rewardsThatCanBeEarned;
      rewardsThatRequireMorePermission = rewardsThatCannotBeEarned;
    }

    return {
      collectedRewards,
      rewardsThatCanBeAcquired,
      rewardsThatRequireMorePermission,
      rewardsThatTheUserWasIneligible,
      rewardsThatAreBeingProcessed,
    };
  }, [
    possibleRewards,
    isSubscribed,
    earnedRewards,
    consentPermissions,
    permissionsState,
    consentContractAddress,
    queryStatus,
  ]);

  const handlePermissionSelect = (permission: EWalletDataType) => {
    permissionsState.includes(permission)
      ? setPermissionsState((permissions) =>
        permissions.filter((_permission) => _permission != permission),
      )
      : setPermissionsState((permissions) => [...permissions, permission]);
  };

  return (
    <>
      <Box
        pt={8}
        pb={4}
        px={3}
        bgcolor="white"
        boxShadow="0px 2px 0px rgba(0, 0, 0, 0.016)"
      >
        <Breadcrumb currentPathName={info?.rewardName} />
        <Box display="flex">
          <Box mr={3}>
            <img src={info?.image} width={160} className={classes.image} />
          </Box>
          <Box display="flex" flex={1} flexDirection="column">
            <Typography className={classes.title}>
              {info?.rewardName}
            </Typography>
            <Box mt={1.5} mb={4}>
              <Typography className={classes.description}>
                {info?.description}
              </Typography>
            </Box>
            <Box display="flex">
              <Box
                px={1.5}
                py={0.75}
                mr={1.5}
                borderRadius={8}
                bgcolor="#F6F6F6"
              >
                <Typography className={classes.infoTitle}>
                  Subscribers
                </Typography>
                {capacityInfo && (
                  <Typography className={classes.infoText}>
                    {capacityInfo.maxCapacity -
                      capacityInfo.availableOptInCount}
                  </Typography>
                )}
              </Box>
              <Box
                px={1.5}
                py={0.75}
                mr={1.5}
                borderRadius={8}
                bgcolor="#F6F6F6"
              >
                <Typography className={classes.infoTitle}>
                  Total Rewards
                </Typography>
                <Typography className={classes.infoText}>
                  {possibleRewards.length}
                </Typography>
              </Box>
              <Box px={1.5} py={0.75} borderRadius={8} bgcolor="#F6F6F6">
                <Typography
                  className={classes.infoTitle}
                  style={{ color: "#D32F2F" }}
                >
                  Remaining Subscriptions
                </Typography>
                {capacityInfo && (
                  <Typography
                    className={classes.infoText}
                    style={{ color: "#D32F2F" }}
                  >
                    {capacityInfo.availableOptInCount}
                  </Typography>
                )}
              </Box>
              {isSubscribed && consentPermissions && (
                <Box
                  px={1.5}
                  ml={1.5}
                  pt={0.75}
                  py={0.25}
                  borderRadius={8}
                  bgcolor="#F6F6F6"
                >
                  <Typography className={classes.infoTitle}>
                    Renting Your
                  </Typography>
                  <Permissions permissions={consentPermissions} />
                </Box>
              )}
              <Box display="flex" alignItems="center" marginLeft="auto">
                {isSubscribed ? (
                  <>
                    {/* <ManageSettingsButton variant="contained">
                      Manage Data Permissions
                    </ManageSettingsButton> */}
                    <Box ml={2} mr={0.5}>
                      <img
                        width={17}
                        height={13}
                        src="https://storage.googleapis.com/dw-assets/spa/icons/check-mark.png"
                      />
                    </Box>
                    <Typography className={classes.subscribedText}>
                      Subscribed
                    </Typography>
                  </>
                ) : (
                  <SubscribeButton
                    ref={saveButtonRef}
                    onClick={handleSubscribeButton}
                    variant="contained"
                  >
                    Subscribe and get your rewards
                  </SubscribeButton>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box px={2.5}>
        <Grid spacing={2} container>
          <Grid item xs={2}>
            <Box mt={2.5}>
              <PermissionBar
                setBirthday={(birthday) =>
                  sdlDataWallet.setBirthday(birthday).map(() => {
                    setAlert({
                      message: generateSuccessMessage(EWalletDataType.Age),
                      severity: EAlertSeverity.SUCCESS,
                    });
                  })
                }
                setLocation={(location) =>
                  sdlDataWallet.setLocation(location).map(() => {
                    setAlert({
                      message: generateSuccessMessage(EWalletDataType.Location),
                      severity: EAlertSeverity.SUCCESS,
                    });
                  })
                }
                setGender={(gender) =>
                  sdlDataWallet.setGender(gender).map(() => {
                    setAlert({
                      message: generateSuccessMessage(EWalletDataType.Gender),
                      severity: EAlertSeverity.SUCCESS,
                    });
                  })
                }
                isSafe={isSafe}
                onClick={handlePermissionSelect}
                permissions={permissionsState}
                handleSelectAllClick={() => {
                  setPermissionsState(UI_SUPPORTED_PERMISSIONS);
                }}
                isUnlocked={appMode === EAppModes.AUTH_USER}
                onClickWhenLocked={setLinkerModalOpen}
                onSocialClick={handleSocialLink}
              />
            </Box>
          </Grid>
          <Grid item xs={10}>
            <Box mt={2.5}>
              <ProgramRewards
                consentContractAddress={consentContractAddress}
                currentPermissions={permissionsState}
                rewardsThatCanBeAcquired={rewardsThatCanBeAcquired}
                rewardsThatRequireMorePermission={
                  rewardsThatRequireMorePermission
                }
                rewardsThatTheUserWasIneligible={
                  rewardsThatTheUserWasIneligible
                }
                isSubscribed={isSubscribed}
              />
            </Box>
            {(collectedRewards?.length > 0 ||
              rewardsThatAreBeingProcessed.length > 0) && (
              <Box mt={2.5}>
                <CollectedRewards
                  consentContractAddress={consentContractAddress}
                  rewards={collectedRewards}
                  possibleRewards={possibleRewards}
                  rewardsThatAreBeingProcessed={rewardsThatAreBeingProcessed}
                />
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default () => (
  <PermissionManagerContextProvider>
    <RewardProgramDetails />
  </PermissionManagerContextProvider>
);
