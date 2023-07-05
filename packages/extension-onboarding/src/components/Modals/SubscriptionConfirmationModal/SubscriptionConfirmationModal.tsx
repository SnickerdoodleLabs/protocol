import { useStyles } from "@extension-onboarding/components/Modals/SubscriptionConfirmationModal/SubscriptionConfirmationModal.style";
import { useAppContext } from "@extension-onboarding/context/App";
import { useLayoutContext } from "@extension-onboarding/context/LayoutContext";
import { IWindowWithSdlDataWallet } from "@extension-onboarding/services/interfaces/sdlDataWallet/IWindowWithSdlDataWallet";
import { Dialog } from "@material-ui/core";
import { SubscriptionConfirmation } from "@snickerdoodlelabs/shared-components";
import React, { FC } from "react";

declare const window: IWindowWithSdlDataWallet;

const SubscriptionConfirmationModal: FC = () => {
  const { apiGateway, linkedAccounts } = useAppContext();
  const { modalState, closeModal } = useLayoutContext();

  const {
    onPrimaryButtonClick,
    customProps: {
      campaignImage,
      eligibleRewards,
      missingRewards = [],
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
        eligibleRewards={eligibleRewards}
        dataTypes={dataTypes}
        campaignName={campaignName}
        consentAddress={consentAddress}
        missingRewards={missingRewards}
        accounts={linkedAccounts.map((account) => account.accountAddress)}
        onCloseClick={closeModal}
        onConfirmClick={(receivingAccount) => {
          onPrimaryButtonClick(receivingAccount);
          closeModal();
        }}
        ipfsBaseUrl={apiGateway.config.ipfsFetchBaseUrl}
        getReceivingAddress={window.sdlDataWallet.getReceivingAddress}
      />
    </Dialog>
  );
};

export default SubscriptionConfirmationModal;
