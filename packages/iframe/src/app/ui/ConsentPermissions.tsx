import {
  LoadingIndicator,
  ModalContentWrapper,
} from "@core-iframe/app/ui/components";
import { IFrameConfig, IFrameEvents } from "@core-iframe/interfaces/objects";
import { Box } from "@material-ui/core";
import {
  DataPermissions,
  DirectReward,
  ERewardType,
  EVMContractAddress,
  EWalletDataType,
  EarnedReward,
  IOldUserAgreement,
  ISnickerdoodleCore,
  IUserAgreement,
  IpfsCID,
  URLString,
} from "@snickerdoodlelabs/objects";
import {
  AudienceDetailsAirdropsSection,
  AudienceDetailsHeaderSection,
  AudienceList,
  ModalContainer,
} from "@snickerdoodlelabs/shared-components";
import { ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import React, {
  useMemo,
  useState,
  useEffect,
  FC,
  useRef,
  useCallback,
} from "react";
import { Subscription } from "rxjs";

interface IConsentPermissionsProps {
  core: ISnickerdoodleCore;
  coreConfig: IFrameConfig;
  hide: () => void;
  show: () => void;
  events: IFrameEvents;
  awaitRender: boolean;
}

enum EAPP_STATE {
  IDLE,
  CONSENT_LIST,
  CONSENT_DETAIL,
}

interface ISelectedDetailItem {
  contractAddress: EVMContractAddress;
  ipfsCID: IpfsCID;
  metadata: IOldUserAgreement | IUserAgreement;
  urls: URLString[];
}

export const ConsentPermissions: FC<IConsentPermissionsProps> = ({
  core,
  coreConfig,
  events,
  awaitRender,
  show,
  hide,
}) => {
  const [appState, setAppState] = useState<EAPP_STATE>(EAPP_STATE.IDLE);
  const [displayRequested, setDisplayRequested] = useState<boolean>(false);
  const [optedInContracts, setOptedInContracts] =
    useState<Map<EVMContractAddress, IpfsCID>>();
  const consentPermissionDisplayRequestRef = useRef<Subscription | null>(null);
  const [updateInProgress, setUpdateInProgress] = useState<boolean>(false);
  const [selectedDetailItem, setSelectedDetailItem] =
    useState<ISelectedDetailItem>();
  const [selectedDetailItemRewards, setSelectedDetailItemRewards] =
    useState<EarnedReward[]>();

  useEffect(() => {
    consentPermissionDisplayRequestRef.current =
      events.onDisplayConsentPermissionsRequested.subscribe(() => {
        setDisplayRequested(true);
      });

    return () => {
      consentPermissionDisplayRequestRef.current?.unsubscribe();
    };
  }, [events]);

  useEffect(() => {
    if (displayRequested && !awaitRender) {
      show();
      setAppState(EAPP_STATE.CONSENT_LIST);
    }
  }, [displayRequested, awaitRender]);

  useEffect(() => {
    if (appState === EAPP_STATE.CONSENT_LIST) {
      getOptedInContracts();
    }
  }, [appState]);

  const getOptedInContracts = useCallback(() => {
    core.invitation.getAcceptedInvitationsCID().map((contracts) => {
      setOptedInContracts(contracts);
    });
  }, []);

  const onManageClick = useCallback((item: ISelectedDetailItem) => {
    setSelectedDetailItem(item);
    setAppState(EAPP_STATE.CONSENT_DETAIL);
  }, []);

  const close = useCallback(() => {
    hide();
    setDisplayRequested(false);
    setAppState(EAPP_STATE.IDLE);
    setOptedInContracts(undefined);
  }, []);

  useEffect(() => {
    if (!selectedDetailItem) {
      setSelectedDetailItemRewards(undefined);
    } else {
      getEarnedRewards(selectedDetailItem.contractAddress);
    }
  }, [JSON.stringify(selectedDetailItem)]);

  const getEarnedRewards = useCallback(
    (contractAddress: EVMContractAddress) => {
      core.marketplace
        .getEarnedRewardsByContractAddress([contractAddress])
        .map((rewards) => {
          const consentRewards = rewards.get(contractAddress);
          if (!consentRewards) {
            return;
          }
          setSelectedDetailItemRewards(
            Array.from(consentRewards.values()).flat(),
          );
        })
        .mapErr((err) => {
          console.log("unable to get rewards");
        });
    },
    [],
  );

  const onOptOutClick = useCallback(() => {
    if (!selectedDetailItem) {
      return;
    }
    setUpdateInProgress(true);
    return core.invitation
      .leaveCohort(selectedDetailItem.contractAddress)
      .map(() => {
        setUpdateInProgress(false);
        handleDetailClose();
      })
      .mapErr(() => {
        setUpdateInProgress(false);
        console.log("unable to opt out");
      });
  }, [JSON.stringify(selectedDetailItem)]);

  const handleDetailClose = useCallback(() => {
    setSelectedDetailItem(undefined);
    setAppState(EAPP_STATE.CONSENT_LIST);
  }, []);

  const userOptedIn = useMemo(() => {
    if (!optedInContracts) {
      return false;
    }
    if (!selectedDetailItem) {
      return false;
    }
    return optedInContracts.has(selectedDetailItem.contractAddress);
  }, [JSON.stringify(selectedDetailItem), optedInContracts]);

  const component = useMemo(() => {
    switch (appState) {
      case EAPP_STATE.CONSENT_LIST:
        return optedInContracts ? (
          <ModalContentWrapper title="Data Permissions" onCloseClick={close}>
            {updateInProgress && <LoadingIndicator />}
            <AudienceList
              optedInContracts={optedInContracts}
              getDetails={function (
                contractAddress: EVMContractAddress,
                ipfsCID: IpfsCID,
              ): ResultAsync<
                [IOldUserAgreement | IUserAgreement, URLString[]],
                unknown
              > {
                return ResultUtils.combine([
                  core.invitation.getInvitationMetadataByCID(ipfsCID),
                  core.getConsentContractURLs(contractAddress),
                ]);
              }}
              getPermissions={function (
                contractAddress: EVMContractAddress,
              ): ResultAsync<EWalletDataType[], unknown> {
                return core.invitation
                  .getAgreementFlags(contractAddress)
                  .map((flags) => {
                    return DataPermissions.getDataTypesFromFlags(flags);
                  });
              }}
              onManageClick={function (
                contractAddress: EVMContractAddress,
                ipfsCID: IpfsCID,
                metadata: IOldUserAgreement | IUserAgreement,
                urls: URLString[],
              ): void {
                onManageClick({ contractAddress, ipfsCID, metadata, urls });
              }}
              onUpdateClick={function (
                contractAddress: EVMContractAddress,
                permissionDiff: EWalletDataType[],
              ): ResultAsync<void, unknown> {
                setUpdateInProgress(true);
                return core.invitation
                  .updateDataPermissions(
                    contractAddress,
                    DataPermissions.createWithPermissions(permissionDiff),
                  )
                  .map(() => {
                    setUpdateInProgress(false);
                  })
                  .mapErr((err) => {
                    setUpdateInProgress(false);
                  });
              }}
            />
          </ModalContentWrapper>
        ) : null;
      case EAPP_STATE.CONSENT_DETAIL:
        return selectedDetailItem ? (
          <ModalContentWrapper onCloseClick={handleDetailClose}>
            {updateInProgress && <LoadingIndicator />}
            <AudienceDetailsHeaderSection
              metadata={selectedDetailItem.metadata}
              urls={selectedDetailItem.urls}
              ipfsFetchBaseUrl={coreConfig.ipfsFetchBaseUrl}
              userOptedIn={userOptedIn}
              onOptOutClick={function (): void {
                onOptOutClick();
              }}
            />
            {selectedDetailItemRewards && (
              <>
                <Box mt={3} />
                <AudienceDetailsAirdropsSection
                  rewardItems={
                    selectedDetailItemRewards.filter((reward) => {
                      return reward.type === ERewardType.Direct;
                    }) as DirectReward[]
                  }
                  ipfsFetchBaseUrl={coreConfig.ipfsFetchBaseUrl}
                  onItemClick={function (item: DirectReward): void {}}
                />
              </>
            )}
          </ModalContentWrapper>
        ) : null;
      default:
        return null;
    }
  }, [
    appState,
    optedInContracts,
    updateInProgress,
    selectedDetailItem,
    selectedDetailItemRewards,
    userOptedIn,
  ]);

  return (
    <>
      {component && (
        <ModalContainer onClose={close}>{component}</ModalContainer>
      )}{" "}
    </>
  );
};
