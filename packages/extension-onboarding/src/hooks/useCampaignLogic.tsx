import { EAlertSeverity } from "@extension-onboarding/components/CustomizedAlert";
import { EModalSelectors } from "@extension-onboarding/components/Modals";
import { useAppContext } from "@extension-onboarding/context/App";
import { useLayoutContext } from "@extension-onboarding/context/LayoutContext";
import { useNotificationContext } from "@extension-onboarding/context/NotificationContext";
import { IWindowWithSdlDataWallet } from "@extension-onboarding/services/interfaces/sdlDataWallet/IWindowWithSdlDataWallet";
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

interface IUseCampaignItemLogicProps {
  consentContractAddress: EVMContractAddress;
}
declare const window: IWindowWithSdlDataWallet;

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
    window.sdlDataWallet
      .getConsentContractCID(consentContractAddress)
      .map((campaignCID) =>
        window.sdlDataWallet
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
    window.sdlDataWallet
      ?.getConsentCapacity(consentContractAddress)
      .map((capacityInfo) => {
        setConsentCapacity(capacityInfo);
      });
  };

  const getPossibleRewards = () => {
    window.sdlDataWallet
      ?.getPossibleRewards?.([consentContractAddress])
      .map((possibleRewards) =>
        setPossibleRewards(possibleRewards[consentContractAddress] ?? []),
      );
  };

  const isSubscribed = useMemo(() => {
    return optedInContracts.includes(consentContractAddress);
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
    window.sdlDataWallet.getApplyDefaultPermissionsOption().map((option) => {
      if (option) {
        window.sdlDataWallet
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
          const requiredDataTypes = item.queryDependencies.map(
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
    window.sdlDataWallet
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
