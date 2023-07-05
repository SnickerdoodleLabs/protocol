import Breadcrumb from "@extension-onboarding/components/Breadcrumb";
import { EAlertSeverity } from "@extension-onboarding/components/CustomizedAlert";
import { EModalSelectors } from "@extension-onboarding/components/Modals";
import { useAppContext } from "@extension-onboarding/context/App";
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
import { IWindowWithSdlDataWallet } from "@extension-onboarding/services/interfaces/sdlDataWallet/IWindowWithSdlDataWallet";
import { isSameReward } from "@extension-onboarding/utils";
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
  ETag,
  EVMContractAddress,
  EWalletDataType,
  IConsentCapacity,
  IOpenSeaMetadata,
  PossibleReward,
  QueryTypePermissionMap,
} from "@snickerdoodlelabs/objects";
import {
  PermissionBar,
  Permissions,
  PERMISSIONS_WITH_ICONS,
  UI_SUPPORTED_PERMISSIONS,
} from "@snickerdoodlelabs/shared-components";
import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useLocation, useNavigate } from "react-router-dom";

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

declare const window: IWindowWithSdlDataWallet;

const RewardProgramDetails: FC = () => {
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

  const { generateAllPermissions, isSafe, updateProfileValues } =
    usePermissionContext();
  const generateSuccessMessage = (dataType: EWalletDataType) => {
    return `Your "${
      PERMISSIONS_WITH_ICONS[dataType]!.name
    }" data has successfully saved`;
  };
  const [capacityInfo, setCapacityInfo] = useState<IConsentCapacity>();
  const [consentPermissions, setConsentPermissions] = useState<
    EWalletDataType[]
  >([]);
  const { optedInContracts, earnedRewards, updateOptedInContracts } =
    useAppContext();
  const { setAlert } = useNotificationContext();
  const { setModal, setLoadingStatus, closeModal } = useLayoutContext();
  const [permissionsState, setPermissionsState] = useState<EWalletDataType[]>(
    [],
  );

  useEffect(() => {
    if (consentPermissions.length > 0) {
      setPermissionsState(consentPermissions);
    }
  }, [JSON.stringify(consentPermissions)]);

  const handleSubscribeButton = () => {
    const { eligibleRewards, unEligibleRewards } = programRewards.reduce(
      (acc, item) => {
        const requiredDataTypes = item.queryDependencies.map(
          (queryType) => QueryTypePermissionMap.get(queryType)!,
        );
        const permissionsMatched = requiredDataTypes.every((item) =>
          permissionsState.includes(item),
        );
        if (permissionsMatched) {
          acc.eligibleRewards = [...acc.eligibleRewards, item];
        } else {
          acc.unEligibleRewards = [...acc.unEligibleRewards, item];
        }
        return acc;
      },
      { eligibleRewards: [], unEligibleRewards: [] } as {
        eligibleRewards: PossibleReward[];
        unEligibleRewards: PossibleReward[];
      },
    );

    const uniqueCIDsofEligibleRewards = Array.from(
      new Set(eligibleRewards.map((rewardItem) => rewardItem.queryCID)),
    );

    const missingRewards = unEligibleRewards.filter((item) =>
      uniqueCIDsofEligibleRewards.includes(item.queryCID),
    );
    setModal({
      modalSelector: EModalSelectors.SUBSCRIPTION_CONFIRMATION_MODAL,
      onPrimaryButtonClick: (receivingAccount: AccountAddress) => {
        setLoadingStatus(true);
        window.sdlDataWallet
          .setReceivingAddress(consentContractAddress, receivingAccount)
          .map(() => {
            window.sdlDataWallet
              .acceptInvitation(permissionsState, consentContractAddress)
              .map(() => {
                updateOptedInContracts();
                setLoadingStatus(false);
                setModal({
                  modalSelector: EModalSelectors.SUBSCRIPTION_SUCCESS_MODAL,
                  onPrimaryButtonClick: () => {},
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
        onCloseClicked: () => {},
        campaignImage: info?.image,
        eligibleRewards,
        missingRewards,
        dataTypes: permissionsState,
        consentContractAddress,
        campaignName: info?.rewardName,
      },
    });
  };

  const getCapacityInfo = () => {
    window.sdlDataWallet
      ?.getConsentCapacity(consentContractAddress)
      .map((capacity) => {
        setCapacityInfo(capacity);
      });
  };

  const isSubscribed = useMemo(() => {
    return optedInContracts.includes(consentContractAddress);
  }, [JSON.stringify(optedInContracts), consentContractAddress]);


  useEffect(() => {
    if(!isSubscribed){
    window.sdlDataWallet
      .checkInvitationStatus(consentContractAddress)
      .map((invitationStatus) => {
        if (invitationStatus === EInvitationStatus.Accepted)
          updateOptedInContracts();
      });
    }
  }, [consentContractAddress, isSubscribed]);

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
    window.sdlDataWallet
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

  const { collectedRewards, programRewards, waitingRewards } = useMemo(() => {
    // earned rewards
    const collectedRewards = possibleRewards.reduce((acc, item) => {
      const matchedReward = earnedRewards.find((reward) =>
        isSameReward(reward, item),
      );
      if (matchedReward) {
        acc = [...acc, matchedReward];
      }
      return acc;
    }, [] as EarnedReward[]);

    const uniqueCIDsofEarnedRewards = Array.from(
      new Set(collectedRewards.map((reward) => reward.queryCID)),
    );

    if (!isSubscribed) {
      return {
        programRewards: possibleRewards
          .filter(
            (possibleReward) =>
              !collectedRewards.find((item) =>
                isSameReward(possibleReward, item),
              ),
          )
          .filter(
            (possibleReward) =>
              !uniqueCIDsofEarnedRewards.includes(possibleReward.queryCID),
          ),
        waitingRewards: [] as PossibleReward[],
        collectedRewards,
      };
    }

    // get eligibleRewards
    const eligibleRewards = possibleRewards.reduce((acc, item) => {
      const requiredDataTypes = item.queryDependencies.map(
        (queryType) => QueryTypePermissionMap.get(queryType)!,
      );
      const permissionsMatched = requiredDataTypes.every((item) =>
        consentPermissions.includes(item),
      );
      if (permissionsMatched) {
        acc = [...acc, item];
      }
      return acc;
    }, [] as PossibleReward[]);

    // get eligible but not delivered rewards
    const waitingRewards = eligibleRewards.filter(
      (item) =>
        !collectedRewards.find((earnedReward) =>
          isSameReward(earnedReward, item),
        ),
    );
    const uniqueCIDsofWaitingRewards = Array.from(
      new Set(waitingRewards.map((reward) => reward.queryCID)),
    );
    const programRewards = possibleRewards
      .filter(
        (item) =>
          !collectedRewards.find((reward) => isSameReward(reward, item)) &&
          !waitingRewards.find((reward) => isSameReward(reward, item)),
      )
      .filter(
        (possibleReward) =>
          !uniqueCIDsofEarnedRewards.includes(possibleReward.queryCID) &&
          !uniqueCIDsofWaitingRewards.includes(possibleReward.queryCID),
      );

    return {
      collectedRewards,
      waitingRewards,
      programRewards,
    };
  }, [
    possibleRewards,
    isSubscribed,
    earnedRewards,
    consentPermissions,
    consentContractAddress,
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
                  window.sdlDataWallet.setBirthday(birthday).map(() => {
                    setAlert({
                      message: generateSuccessMessage(EWalletDataType.Age),
                      severity: EAlertSeverity.SUCCESS,
                    });
                  })
                }
                setLocation={(location) =>
                  window.sdlDataWallet.setLocation(location).map(() => {
                    setAlert({
                      message: generateSuccessMessage(EWalletDataType.Location),
                      severity: EAlertSeverity.SUCCESS,
                    });
                  })
                }
                setGender={(gender) =>
                  window.sdlDataWallet.setGender(gender).map(() => {
                    setAlert({
                      message: generateSuccessMessage(EWalletDataType.Gender),
                      severity: EAlertSeverity.SUCCESS,
                    });
                  })
                }
                isSafe={isSafe}
                updateProfileValues={updateProfileValues}
                onClick={handlePermissionSelect}
                permissions={permissionsState}
                handleSelectAllClick={() => {
                  setPermissionsState(UI_SUPPORTED_PERMISSIONS);
                }}
              />
            </Box>
          </Grid>
          <Grid item xs={10}>
            <Box mt={2.5}>
              <ProgramRewards
                consentContractAddress={consentContractAddress}
                currentPermissions={permissionsState}
                rewards={programRewards}
                isSubscribed={isSubscribed}
              />
            </Box>
            {(collectedRewards?.length > 0 || waitingRewards.length > 0) && (
              <Box mt={2.5}>
                <CollectedRewards
                  consentContractAddress={consentContractAddress}
                  rewards={collectedRewards}
                  possibleRewards={possibleRewards}
                  waitingRewards={waitingRewards}
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
