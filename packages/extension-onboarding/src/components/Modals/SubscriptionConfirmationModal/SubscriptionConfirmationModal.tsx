import { Dialog } from "@material-ui/core";
import { SubscriptionConfirmation } from "@snickerdoodlelabs/shared-components";
import React, { FC } from "react";

import { useStyles } from "@extension-onboarding/components/Modals/SubscriptionConfirmationModal/SubscriptionConfirmationModal.style";
import { useAppContext } from "@extension-onboarding/context/App";
import { useLayoutContext } from "@extension-onboarding/context/LayoutContext";
import { useDataWalletContext } from "@extension-onboarding/context/DataWalletContext";
import { EVMContractAddress } from "@snickerdoodlelabs/objects";

const SubscriptionConfirmationModal: FC = () => {
  const { sdlDataWallet } = useDataWalletContext();
  const { apiGateway, linkedAccounts } = useAppContext();
  const { modalState, closeModal } = useLayoutContext();

  const {
    onPrimaryButtonClick,
    customProps: {
      campaignImage,
      rewardsThatCanBeAcquired,
      rewardsThatRequireMorePermission = [],
      dataTypes,
      campaignName,
      consentAddress,
    } = {},
  } = modalState;

  const classes = useStyles();

  return (
    <Dialog
      PaperProps={{
        square: true,
      }}
      open={true}
      disablePortal
      maxWidth="sm"
      fullWidth
      className={classes.container}
    >
      <SubscriptionConfirmation
        campaignImage={campaignImage}
        rewardsThatCanBeAcquired={rewardsThatCanBeAcquired}
        dataTypes={dataTypes}
        campaignName={campaignName}
        consentAddress={consentAddress}
        rewardsThatRequireMorePermission={rewardsThatRequireMorePermission}
        accounts={linkedAccounts.map((account) => account.sourceAccountAddress)}
        onCloseClick={closeModal}
        onConfirmClick={(receivingAccount) => {
          onPrimaryButtonClick(receivingAccount);
          closeModal();
        }}
        ipfsBaseUrl={apiGateway.config.ipfsFetchBaseUrl}
        getReceivingAddress={(consentAddress: EVMContractAddress) => {
          return sdlDataWallet.getReceivingAddress(consentAddress);
        }}
      />
    </Dialog>
  );
};

export default SubscriptionConfirmationModal;
