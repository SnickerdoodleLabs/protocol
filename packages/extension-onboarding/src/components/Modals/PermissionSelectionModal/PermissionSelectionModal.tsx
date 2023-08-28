import { Dialog } from "@material-ui/core";
import {
  ESocialType,
  EVMContractAddress,
  EWalletDataType,
  IOpenSeaMetadata,
  PossibleReward,
  QueryStatus,
} from "@snickerdoodlelabs/objects";
import { PermissionSelection } from "@snickerdoodlelabs/shared-components";
import React, { FC, useEffect, useState } from "react";

import { EAlertSeverity } from "@extension-onboarding/components/CustomizedAlert";
import { useStyles } from "@extension-onboarding/components/Modals/PermissionSelectionModal/PermissionSelectionModal.style";
import { PERMISSIONS_WITH_ICONS } from "@extension-onboarding/constants/permissions";
import { useAppContext, EAppModes } from "@extension-onboarding/context/App";
import { useLayoutContext } from "@extension-onboarding/context/LayoutContext";
import { useNotificationContext } from "@extension-onboarding/context/NotificationContext";
import {
  PermissionManagerContextProvider,
  usePermissionContext,
} from "@extension-onboarding/context/PermissionContext";
import {
  DiscordProvider,
  TwitterProvider,
} from "@extension-onboarding/services/socialMediaProviders/implementations";
import { useDataWalletContext } from "@extension-onboarding/context/DataWalletContext";
import { addQueryStatusToPossibleReward, PossibleRewardWithQueryStatus } from "@snickerdoodlelabs/shared-components";
import { ResultUtils } from "neverthrow-result-utils";
import { ObjectUtils } from "@snickerdoodlelabs/common-utils";

const PermissionSelectionModalV2: FC = () => {
  const { modalState, closeModal, setModal, setLoadingStatus } =
    useLayoutContext();
  const { onPrimaryButtonClick, customProps } = modalState;
  const { setAlert } = useNotificationContext();
  const { consentContractAddress, campaignInfo } = customProps as {
    consentContractAddress: EVMContractAddress;
    campaignInfo: IOpenSeaMetadata;
  };
  const { sdlDataWallet } = useDataWalletContext();
  const {
    earnedRewards,
    apiGateway,
    appMode,
    setLinkerModalOpen,
    socialMediaProviderList,
  } = useAppContext();
  const { isSafe, generateAllPermissions } = usePermissionContext();

  const generateSuccessMessage = (dataType: EWalletDataType) => {
    return `Your "${
      PERMISSIONS_WITH_ICONS[dataType]!.name
    }" data has successfully saved`;
  };

  const [possibleRewardWithQueryStatus, setPossibleRewardWithQueryStatus] = useState<PossibleRewardWithQueryStatus[]>([]);


  const handleSocialLink = async (socialType: ESocialType) => {
    const twitterProvider = socialMediaProviderList.find(
      (item) => item.key === ESocialType.TWITTER,
    )?.provider as TwitterProvider;

    const discordProvider = socialMediaProviderList.find(
      (item) => item.key === ESocialType.DISCORD,
    )?.provider as DiscordProvider;
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

  useEffect(() => {
    ResultUtils.combine([getPossibleRewards(), getQueryStatuses()]).map(
      ([possibleRewards, queryStatuses]) => {
        const currentPossibleRewards =
          possibleRewards.get(consentContractAddress) ?? [];
        const possibleRewardWithStatus = addQueryStatusToPossibleReward(
          currentPossibleRewards,
          queryStatuses,
        );
        if (
          ObjectUtils.serialize(possibleRewardWithStatus).valueOf() !==
          ObjectUtils.serialize(possibleRewardWithQueryStatus).valueOf()
        ) {
          setPossibleRewardWithQueryStatus(possibleRewardWithStatus);
        }
      },
    );
  }, [earnedRewards]);

  const getPossibleRewards = () => {
    return sdlDataWallet?.getPossibleRewards?.([consentContractAddress]);
  };

  const getQueryStatuses = () => {
    return sdlDataWallet?.getQueryStatuses?.(consentContractAddress);
  };




  const classes = useStyles();
  return (
    <Dialog
      PaperProps={{
        square: true,
      }}
      open={true}
      disablePortal
      maxWidth="lg"
      fullWidth
      className={classes.container}
    >
      <PermissionSelection
        ipfsBaseUrl={apiGateway.config.ipfsFetchBaseUrl}
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
        generateAllPermissions={generateAllPermissions}
        campaignInfo={campaignInfo}
        possibleRewardWithQueryStatus={possibleRewardWithQueryStatus}
        earnedRewards={earnedRewards}
        consentContractAddress={consentContractAddress}
        onCancelClick={closeModal}
        onAcceptClick={(
          rewardsThatCanBeAcquired: PossibleReward[],
          rewardsThatRequireMorePermission: PossibleReward[],
          dataTypes: EWalletDataType[],
        ) => {
          onPrimaryButtonClick({
            rewardsThatCanBeAcquired,
            rewardsThatRequireMorePermission,
            dataTypes,
          });
        }}
        isUnlocked={appMode === EAppModes.AUTH_USER}
        onPermissionClickWhenLocked={function (): void {
          setLinkerModalOpen();
        }}
        onSocialConnect={handleSocialLink}
      />
    </Dialog>
  );
};

export default () => (
  <PermissionManagerContextProvider>
    <PermissionSelectionModalV2 />
  </PermissionManagerContextProvider>
);
