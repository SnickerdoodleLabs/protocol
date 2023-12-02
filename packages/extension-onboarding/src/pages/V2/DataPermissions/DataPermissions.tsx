import emptyAudience from "@extension-onboarding/assets/images/empty-audience.svg";
import { EAlertSeverity } from "@extension-onboarding/components/CustomizedAlert";
import Container from "@extension-onboarding/components/v2/Container";
import PageTitle from "@extension-onboarding/components/v2/PageTitle";
import { EPathsV2 } from "@extension-onboarding/containers/Router/Router.pathsV2";
import { generateRouteUrl } from "@extension-onboarding/containers/Router/utils";
import { useAppContext } from "@extension-onboarding/context/App";
import { useDataWalletContext } from "@extension-onboarding/context/DataWalletContext";
import { useLayoutContext } from "@extension-onboarding/context/LayoutContext";
import { useNotificationContext } from "@extension-onboarding/context/NotificationContext";
import { Box } from "@material-ui/core";
import {
  EVMContractAddress,
  EWalletDataType,
  IOldUserAgreement,
  IUserAgreement,
  IpfsCID,
  URLString,
} from "@snickerdoodlelabs/objects";
import { colors, AudienceList } from "@snickerdoodlelabs/shared-components";
import { ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import React from "react";
import { useNavigate } from "react-router-dom";

const DataPermissions = () => {
  const { optedInContracts } = useAppContext();
  const { sdlDataWallet } = useDataWalletContext();
  const { setAlert } = useNotificationContext();
  const { setLoadingStatus } = useLayoutContext();
  const navigate = useNavigate();

  return (
    <Container>
      <PageTitle title="Data Permissions" />
      <AudienceList
        itemSwitchColor={colors.MAINPURPLE900}
        optedInContracts={optedInContracts}
        getDetails={function (
          contractAddress: EVMContractAddress,
          ipfsCID: IpfsCID,
        ): ResultAsync<
          [IOldUserAgreement | IUserAgreement, URLString[]],
          unknown
        > {
          return ResultUtils.combine([
            sdlDataWallet.getInvitationMetadataByCID(ipfsCID),
            sdlDataWallet.getConsentContractURLs(contractAddress),
          ]);
        }}
        getPermissions={function (
          contractAddress: EVMContractAddress,
        ): ResultAsync<EWalletDataType[], unknown> {
          return sdlDataWallet.getAgreementPermissions(contractAddress);
        }}
        onManageClick={function (
          contractAddress: EVMContractAddress,
          ipfsCID: IpfsCID,
          metadata: IOldUserAgreement | IUserAgreement,
          urls: URLString[],
        ): void {
          navigate(
            generateRouteUrl(EPathsV2.DATA_PERMISSIONS_AUDIENCE, {
              consentAddress: contractAddress,
            }),
            {
              state: {
                _contractInfo: { metadata, urls },
                _ipfsCID: ipfsCID,
              },
            },
          );
        }}
        onUpdateClick={function (
          contractAddress: EVMContractAddress,
          permissionDiff: EWalletDataType[],
        ): ResultAsync<void, unknown> {
          setLoadingStatus(true);
          return sdlDataWallet
            .updateAgreementPermissions(contractAddress, permissionDiff)
            .map(() => {
              setLoadingStatus(false);
              setAlert({
                severity: EAlertSeverity.SUCCESS,
                message: "Data Permissions updated successfully.",
              });
            })
            .mapErr((err) => {
              setLoadingStatus(false);
              setAlert({
                severity: EAlertSeverity.ERROR,
                message: "Error updating Data Permissions.",
              });
            });
        }}
      />
    </Container>
  );
};

export default DataPermissions;
