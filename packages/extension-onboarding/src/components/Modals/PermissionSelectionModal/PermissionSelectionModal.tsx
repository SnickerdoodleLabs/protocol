import { EAlertSeverity } from "@extension-onboarding/components/CustomizedAlert";
import { useStyles } from "@extension-onboarding/components/Modals/PermissionSelectionModal/PermissionSelectionModal.style";
import { PERMISSIONS_WITH_ICONS } from "@extension-onboarding/constants/permissions";
import { useAppContext } from "@extension-onboarding/context/App";
import { useLayoutContext } from "@extension-onboarding/context/LayoutContext";
import { useNotificationContext } from "@extension-onboarding/context/NotificationContext";
import {
  PermissionManagerContextProvider,
  usePermissionContext,
} from "@extension-onboarding/context/PermissionContext";
import { IWindowWithSdlDataWallet } from "@extension-onboarding/services/interfaces/sdlDataWallet/IWindowWithSdlDataWallet";
import { Dialog } from "@material-ui/core";
import {
  EVMContractAddress,
  EWalletDataType,
  IOpenSeaMetadata,
  PossibleReward,
} from "@snickerdoodlelabs/objects";
import { PermissionSelection } from "@snickerdoodlelabs/shared-components";
import React, { FC, useEffect, useMemo, useState } from "react";

declare const window: IWindowWithSdlDataWallet;

const PermissionSelectionModalV2: FC = () => {
  const { modalState, closeModal, setModal, setLoadingStatus } =
    useLayoutContext();

  const { onPrimaryButtonClick, customProps } = modalState;
  const { setAlert } = useNotificationContext();
  const { consentContractAddress, campaignInfo } = customProps as {
    consentContractAddress: EVMContractAddress;
    campaignInfo: IOpenSeaMetadata;
  };

  const { earnedRewards, apiGateway } = useAppContext();
  const { isSafe, generateAllPermissions, updateProfileValues } =
    usePermissionContext();

  const generateSuccessMessage = (dataType: EWalletDataType) => {
    return `Your "${
      PERMISSIONS_WITH_ICONS[dataType]!.name
    }" data has successfully saved`;
  };

  const [possibleRewards, setPossibleRewards] = useState<PossibleReward[]>([]);

  useEffect(() => {
    window.sdlDataWallet
      .getPossibleRewards([consentContractAddress])
      .map((res) => {
        setPossibleRewards(res[consentContractAddress] ?? []);
      });
  }, []);

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
        generateAllPermissions={generateAllPermissions}
        updateProfileValues={updateProfileValues}
        campaignInfo={campaignInfo}
        possibleRewards={possibleRewards}
        earnedRewards={earnedRewards}
        consentContractAddress={consentContractAddress}
        onCancelClick={closeModal}
        onAcceptClick={function (
          eligibleRewards: PossibleReward[],
          missingRewards: PossibleReward[],
          dataTypes: EWalletDataType[],
        ): void {
          onPrimaryButtonClick({ eligibleRewards, missingRewards, dataTypes });
        }}
      />
    </Dialog>
  );
};

export default () => (
  <PermissionManagerContextProvider>
    <PermissionSelectionModalV2 />
  </PermissionManagerContextProvider>
);
