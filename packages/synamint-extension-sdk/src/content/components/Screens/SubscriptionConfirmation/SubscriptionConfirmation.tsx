import { Box, CircularProgress, Dialog } from "@material-ui/core";
import {
  AccountAddress,
  EVMContractAddress,
  EWalletDataType,
  LinkedAccount,
  PossibleReward,
} from "@snickerdoodlelabs/objects";
import { SubscriptionConfirmation } from "@snickerdoodlelabs/shared-components";
import { ResultAsync } from "neverthrow";
import React, { FC, useEffect, useState } from "react";

import { useStyles } from "@synamint-extension-sdk/content/components/Screens/SubscriptionConfirmation/SubscriptionConfirmation.style";
import { ExternalCoreGateway } from "@synamint-extension-sdk/gateways";
import {
  IInvitationDomainWithUUID,
  GetReceivingAddressParams,
  IExtensionConfig,
} from "@synamint-extension-sdk/shared";

interface ISubscriptionConfirmationProps {
  coreGateway: ExternalCoreGateway;
  domainDetails: IInvitationDomainWithUUID;
  rewardsThatCanBeAcquired: PossibleReward[];
  rewardsThatRequireMorePermission: PossibleReward[];
  dataTypes: EWalletDataType[];
  onConfirmClick: (receivingAccount: AccountAddress | undefined) => void;
  onCancelClick: () => void;
  config: IExtensionConfig;
  accounts: LinkedAccount[];
}

const SubscriptionConfirmationModal: FC<ISubscriptionConfirmationProps> = ({
  coreGateway,
  domainDetails,
  rewardsThatCanBeAcquired,
  rewardsThatRequireMorePermission,
  dataTypes,
  onCancelClick,
  onConfirmClick,
  config,
  accounts,
}) => {
  const classes = useStyles();

  return (
    <Dialog
      className={classes.container}
      open={true}
      disablePortal
      maxWidth="md"
      fullWidth
    >
      {accounts ? (
        <SubscriptionConfirmation
          campaignImage={domainDetails.image}
          rewardsThatCanBeAcquired={rewardsThatCanBeAcquired}
          rewardsThatRequireMorePermission={rewardsThatRequireMorePermission}
          dataTypes={dataTypes}
          campaignName={domainDetails.title}
          consentAddress={domainDetails.consentAddress}
          onCloseClick={onCancelClick}
          onConfirmClick={onConfirmClick}
          ipfsBaseUrl={config.ipfsFetchBaseUrl}
          getReceivingAddress={function (
            consentAddress: EVMContractAddress,
          ): ResultAsync<AccountAddress, unknown> {
            return coreGateway.getReceivingAddress(
              new GetReceivingAddressParams(consentAddress),
            );
          }}
          accounts={accounts.map(
            (linkedAccount) => linkedAccount.sourceAccountAddress,
          )}
        />
      ) : (
        <Box display="flex" py={12} alignItems="center" justifyContent="center">
          <CircularProgress size={48} />
        </Box>
      )}
    </Dialog>
  );
};

export default SubscriptionConfirmationModal;
