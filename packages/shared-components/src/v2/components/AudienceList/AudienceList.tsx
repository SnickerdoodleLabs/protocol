import { Box } from "@material-ui/core";
import { SDTypography } from "@shared-components/v2/components/Typograpy";
import { AudienceItem } from "@shared-components/v2/components/AudienceItem";
import {
  EVMContractAddress,
  IpfsCID,
  IOldUserAgreement,
  IUserAgreement,
  URLString,
  ProxyError,
  EWalletDataType,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";
import React, { FC } from "react";

interface AudienceListProps {
  optedInContracts?: Map<EVMContractAddress, IpfsCID>;
  itemSwitchColor?: string;
  getDetails: (
    contractAddress: EVMContractAddress,
    ipfsCID: IpfsCID,
  ) => ResultAsync<
    [IOldUserAgreement | IUserAgreement, URLString[]],
    ProxyError | unknown
  >;
  getPermissions: (
    contractAddress: EVMContractAddress,
  ) => ResultAsync<EWalletDataType[], ProxyError | unknown>;
  onManageClick: (
    contractAddress: EVMContractAddress,
    ipfsCID: IpfsCID,
    metadata: IOldUserAgreement | IUserAgreement,
    urls: URLString[],
  ) => void;
  onUpdateClick: (
    contractAddress: EVMContractAddress,
    permissionDiff: EWalletDataType[],
  ) => ResultAsync<void, ProxyError | unknown>;
}

export const AudienceList: FC<AudienceListProps> = ({
  optedInContracts,
  itemSwitchColor,
  getDetails,
  getPermissions,
  onUpdateClick,
  onManageClick,
}) => {
  if (!optedInContracts) {
    return null;
  }

  if (optedInContracts.size > 0) {
    return (
      <>
        {Array.from(optedInContracts.entries()).map(
          ([contractAddress, ipfsCID]) => (
            <Box key={contractAddress} mb={3}>
              <AudienceItem
                switchColor={itemSwitchColor}
                key={contractAddress}
                contractAddress={contractAddress}
                ipfsCID={ipfsCID}
                getDetails={() => {
                  return getDetails(contractAddress, ipfsCID);
                }}
                getPermissions={() => {
                  return getPermissions(contractAddress);
                }}
                onUpdateClick={(diff: EWalletDataType[]) => {
                  return onUpdateClick(contractAddress, diff);
                }}
                onManageClick={(
                  metadata: IOldUserAgreement | IUserAgreement,
                  urls: URLString[],
                ) => {
                  return onManageClick(
                    contractAddress,
                    ipfsCID,
                    metadata,
                    urls,
                  );
                }}
              />
            </Box>
          ),
        )}
      </>
    );
  } else {
    return (
      <Box display="flex">
        <Box
          width={{ xs: "60%", sm: "50%", md: "35%", lg: "30%" }}
          ml="auto"
          mr="auto"
          mt={6}
        >
          <img
            width="100%"
            src={
              "https://storage.googleapis.com/dw-assets/shared/images/empty-audience.svg"
            }
          />
          <Box mt={1} />
          <SDTypography variant="bodyLg" align="center">
            You are not subscribed to any
            <br />
            campaign right now.
          </SDTypography>
        </Box>
      </Box>
    );
  }
};
