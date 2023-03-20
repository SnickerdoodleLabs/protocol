import Breadcrumb from "@extension-onboarding/components/Breadcrumb";
import { EModalSelectors } from "@extension-onboarding/components/Modals";
import { useAppContext } from "@extension-onboarding/context/App";
import { useLayoutContext } from "@extension-onboarding/context/LayoutContext";
import { EPossibleRewardDisplayType } from "@extension-onboarding/objects/enums/EPossibleRewardDisplayType";
import {
  CollectedRewards,
  ConsentOwnersOtherPrograms,
  PossibleRewards,
  ProgramHistory,
  OtherProgramsForSameTag,
} from "@extension-onboarding/pages/Details/screens/RewardProgramDetails/components/Sections";
import { useStyles } from "@extension-onboarding/pages/Details/screens/RewardProgramDetails/RewardProgramDetails.style";
import { IWindowWithSdlDataWallet } from "@extension-onboarding/services/interfaces/sdlDataWallet/IWindowWithSdlDataWallet";
import {
  Box,
  Typography,
  Button as MaterialButton,
  withStyles,
} from "@material-ui/core";
import {
  EarnedReward,
  ETag,
  EVMContractAddress,
  EWalletDataType,
  IConsentCapacity,
  IOpenSeaMetadata,
  PossibleReward,
  QueryTypePermissionMap,
} from "@snickerdoodlelabs/objects";
import React, { FC, useEffect, useMemo, useRef, useState } from "react";
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

  const [capacityInfo, setCapacityInfo] = useState<IConsentCapacity>();
  const [consentPermissions, setConsentPermissions] = useState<
    EWalletDataType[]
  >([]);
  const { optedInContracts, earnedRewards, updateOptedInContracts } =
    useAppContext();
  const { setModal, setLoadingStatus, closeModal } = useLayoutContext();

  const handleSubscribeButton = () => {
    setModal({
      modalSelector: EModalSelectors.MANAGE_PERMISSIONS,
      onPrimaryButtonClick: (dataTypes: EWalletDataType[]) => {
        setLoadingStatus(true);
        rewardsRef.current = programRewards.reduce((acc, item) => {
          const requiredDataTypes = item.queryDependencies.map(
            (queryType) => QueryTypePermissionMap.get(queryType)!,
          );
          const permissionsMatched = requiredDataTypes.every((item) =>
            dataTypes.includes(item),
          );
          if (permissionsMatched) {
            acc = [...acc, item];
          }
          return acc;
        }, [] as PossibleReward[]);
        window.sdlDataWallet
          .acceptInvitation(dataTypes, consentContractAddress)
          .map(() => {
            updateOptedInContracts();
            setLoadingStatus(false);
            setModal({
              modalSelector: EModalSelectors.SUBSCRIPTION_SUCCESS_MODAL,
              onPrimaryButtonClick: () => {},
              customProps: {
                campaignImage: info?.image,
                eligibleRewards: rewardsRef.current,
                dataTypes,
                campaignName: info?.rewardName,
              },
            });
          });
      },
      customProps: {
        onCloseClicked: () => {},
        primaryButtonText: "Save",
      },
    });
  };

  const getCapacityInfo = () => {
    window.sdlDataWallet
      .getConsentCapacity(consentContractAddress)
      .map((capacity) => {
        setCapacityInfo(capacity);
      });
  };

  const isSubscribed = useMemo(() => {
    return optedInContracts.includes(consentContractAddress);
  }, [optedInContracts, consentContractAddress]);

  useEffect(() => {
    getCapacityInfo();
  }, [consentContractAddress, isSubscribed]);

  useEffect(() => {
    if (isSubscribed) {
      getConsentPermissions();
    }
  }, [isSubscribed]);

  const getConsentPermissions = () => {
    window.sdlDataWallet
      .getAgreementPermissions(consentContractAddress)
      .map((dataTypes) => {
        setConsentPermissions(dataTypes);
      });
  };

  const {
    collectedRewards,
    programRewards,
    permissionRequiredRewards,
    waitingRewards,
  } = useMemo(() => {
    // earned rewards
    const collectedRewards = possibleRewards.reduce((acc, item) => {
      const matchedReward = earnedRewards.find(
        (reward) => reward.queryCID === item.queryCID,
      );
      if (matchedReward) {
        acc = [...acc, matchedReward];
      }
      return acc;
    }, [] as EarnedReward[]);

    if (!isSubscribed) {
      return {
        programRewards: possibleRewards.filter(
          (possibleReward) =>
            !collectedRewards.find(
              (item) => item.queryCID === possibleReward.queryCID,
            ),
        ),
        waitingRewards: [] as PossibleReward[],
        collectedRewards,
        permissionRequiredRewards: [] as PossibleReward[],
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
        !collectedRewards.find(
          (earnedReward) => earnedReward.queryCID === item.queryCID,
        ),
    );

    // get permission requiered rewards
    const permissionRequiredRewards = possibleRewards.filter(
      (item) =>
        !collectedRewards.find((reward) => reward.queryCID === item.queryCID) &&
        !waitingRewards.find((reward) => reward.queryCID === item.queryCID),
    );

    return {
      collectedRewards,
      waitingRewards,
      permissionRequiredRewards,
      programRewards: [] as PossibleReward[],
    };
  }, [
    possibleRewards,
    isSubscribed,
    earnedRewards,
    consentPermissions,
    consentContractAddress,
  ]);

  return (
    <>
      <Box
        mb={6.75}
        pt={8}
        pb={4}
        px={15}
        position="sticky"
        top="0px"
        bgcolor="white"
        zIndex={1001}
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
              <Box display="flex" alignItems="center" marginLeft="auto">
                {isSubscribed ? (
                  <>
                    <ManageSettingsButton variant="contained">
                      Manage Data Permissions
                    </ManageSettingsButton>
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

      {permissionRequiredRewards?.length > 0 && (
        <Box mt={3}>
          <PossibleRewards
            type={EPossibleRewardDisplayType.MorePermissionRequiered}
            rewards={permissionRequiredRewards}
          />
        </Box>
      )}
      {collectedRewards?.length > 0 && (
        <Box mt={3}>
          <CollectedRewards
            rewards={collectedRewards}
            possibleRewards={possibleRewards}
          />
        </Box>
      )}
      {waitingRewards?.length > 0 && (
        <Box mt={3}>
          <PossibleRewards
            type={EPossibleRewardDisplayType.Waiting}
            rewards={waitingRewards}
          />
        </Box>
      )}
      {programRewards?.length > 0 && (
        <Box mt={3}>
          <PossibleRewards
            type={EPossibleRewardDisplayType.ProgramRewards}
            rewards={programRewards}
          />
        </Box>
      )}
      <Box mt={3}>
        <ConsentOwnersOtherPrograms consentContract={consentContractAddress} />
      </Box>
      {tag && (
        <Box mt={3}>
          <OtherProgramsForSameTag tag={tag} />
        </Box>
      )}
      {collectedRewards?.length > 0 && (
        <Box mt={3}>
          <ProgramHistory rewards={collectedRewards} />
        </Box>
      )}
    </>
  );
};

export default RewardProgramDetails;
