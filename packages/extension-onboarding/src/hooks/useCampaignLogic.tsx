import {
  EarnedReward,
  EVMContractAddress,
  EWalletDataType,
  IConsentCapacity,
  IOpenSeaMetadata,
  PossibleReward,
  QueryTypePermissionMap,
} from "@snickerdoodlelabs/objects";
import { useEffect, useMemo, useRef, useState } from "react";

import { EAlertSeverity } from "@extension-onboarding/components/CustomizedAlert";
import { EModalSelectors } from "@extension-onboarding/components/Modals";
import { useAppContext } from "@extension-onboarding/context/App";
import { useLayoutContext } from "@extension-onboarding/context/LayoutContext";
import { useNotificationContext } from "@extension-onboarding/context/NotificationContext";
import { useDataWalletContext } from "@extension-onboarding/context/DataWalletContext";

interface IUseCampaignItemLogicProps {
  consentContractAddress: EVMContractAddress;
}

const useCampaignItemLogic = ({
  consentContractAddress,
}: IUseCampaignItemLogicProps): {
  campaignInfo: IOpenSeaMetadata | undefined;
  subscriberCount: number;
  isLoading: boolean;
  isSubscribed: boolean;
  possibleRewards: PossibleReward[] | undefined;
  collectedRewards: EarnedReward[];
  handleSubscribeButton: () => void;
} => {
  const [campaignInfo, setCampaignInfo] = useState<IOpenSeaMetadata>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [possibleRewards, setPossibleRewards] = useState<PossibleReward[]>();
  const { optedInContracts, earnedRewards, updateOptedInContracts } =
    useAppContext();
  const [consentCapacity, setConsentCapacity] = useState<IConsentCapacity>();
  const { sdlDataWallet } = useDataWalletContext();
  const { setModal, setLoadingStatus } = useLayoutContext();
  const { setAlert } = useNotificationContext();
  const rewardsRef = useRef<PossibleReward[]>([]);

  useEffect(() => {
    getRewardItem();
    getPossibleRewards();
  }, []);

  useEffect(() => {
    if (campaignInfo) {
      setIsLoading(false);
    }
  }, [JSON.stringify(campaignInfo)]);

  const getRewardItem = () => {
    sdlDataWallet
      .getConsentContractCID(consentContractAddress)
      .map((campaignCID) =>
        sdlDataWallet
          .getInvitationMetadataByCID(campaignCID)
          .map((metadata) => {
            setCampaignInfo(metadata);
          })
          .mapErr((e) => {
            setIsLoading(false);
          }),
      );
  };

  const getConsentCapacity = () => {
    sdlDataWallet
      ?.getConsentCapacity(consentContractAddress)
      .map((capacityInfo) => {
        setConsentCapacity(capacityInfo);
      });
  };

  const getPossibleRewards = () => {
    sdlDataWallet
      ?.getPossibleRewards?.([consentContractAddress])
      .map((possibleRewards) =>
        setPossibleRewards(possibleRewards.get(consentContractAddress) ?? []),
      );
  };

  const isSubscribed = useMemo(() => {
    return false
  }, [optedInContracts]);

  const subscriberCount = useMemo(() => {
    if (!consentCapacity) {
      return 0;
    }
    return consentCapacity.maxCapacity - consentCapacity.availableOptInCount;
  }, [consentCapacity]);

  const collectedRewards: EarnedReward[] = useMemo(() => {
    if (possibleRewards) {
      return earnedRewards.filter((reward) =>
        possibleRewards.find(
          (possibleReward) => possibleReward.queryCID === reward.queryCID,
        ),
      );
    }
    return [];
  }, [
    JSON.stringify(possibleRewards),
    isSubscribed,
    JSON.stringify(earnedRewards),
  ]);

  useEffect(() => {
    getConsentCapacity();
  }, [isSubscribed]);

  const handleSubscribeButton = () => {
    sdlDataWallet.getApplyDefaultPermissionsOption().map((option) => {
      if (option) {
        sdlDataWallet
          .getDefaultPermissions()
          .map((permissions) => acceptInvitation(permissions));
      } else {
        setModal({
          modalSelector: EModalSelectors.PERMISSION_SELECTION,
          onPrimaryButtonClick: () => {
            acceptInvitation(null);
          },
          customProps: {
            onCloseClicked: () => {},
            onManageClicked: () => {
              setModal({
                modalSelector: EModalSelectors.MANAGE_PERMISSIONS,
                onPrimaryButtonClick: (dataTypes: EWalletDataType[]) => {
                  acceptInvitation(dataTypes);
                },
                customProps: {
                  onCloseClicked: () => {},
                  primaryButtonText: "Save",
                },
              });
            },
          },
        });
      }
    });
  };

  const acceptInvitation = (dataTypes: EWalletDataType[] | null) => {
    setLoadingStatus(true);
    rewardsRef.current =
      possibleRewards ??
      ([] as PossibleReward[])
        ?.filter(
          (reward) =>
            !collectedRewards.find(
              (earned) => earned.queryCID === reward.queryCID,
            ),
        )
        .reduce((acc, item) => {
          const requiredDataTypes = item.estimatedQueryDependencies.map(
            (queryType) => QueryTypePermissionMap.get(queryType)!,
          );
          const permissionsMatched = dataTypes
            ? requiredDataTypes.every((item) => dataTypes.includes(item))
            : true;
          if (permissionsMatched) {
            acc = [...acc, item];
          }
          return acc;
        }, [] as PossibleReward[]);
    sdlDataWallet
      .acceptInvitation(dataTypes, consentContractAddress)
      .map(() => {
        updateOptedInContracts();
        setLoadingStatus(false);
        setModal({
          modalSelector: EModalSelectors.SUBSCRIPTION_SUCCESS_MODAL,
          onPrimaryButtonClick: () => {},
          customProps: {
            campaignImage: campaignInfo?.image,
            eligibleRewards: rewardsRef.current,
            dataTypes,
            campaignName: campaignInfo?.rewardName,
          },
        });
      })
      .mapErr(() => {
        setLoadingStatus(false);
        setAlert({
          severity: EAlertSeverity.ERROR,
          message: `${campaignInfo?.rewardName} Rewards Program Subscription Failed!`,
        });
      });
  };

  return {
    campaignInfo,
    subscriberCount,
    isLoading,
    isSubscribed,
    possibleRewards,
    collectedRewards,
    handleSubscribeButton,
  };
};

export default useCampaignItemLogic;
