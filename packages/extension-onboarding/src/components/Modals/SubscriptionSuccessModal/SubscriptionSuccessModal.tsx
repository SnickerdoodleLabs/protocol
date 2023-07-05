import { useStyles } from "@extension-onboarding/components/Modals/SubscriptionSuccessModal/SubscriptionSuccessModal.style";
import { useLayoutContext } from "@extension-onboarding/context/LayoutContext";
import { Dialog } from "@material-ui/core";
import { SubscriptionSuccess } from "@snickerdoodlelabs/shared-components";
import React, { FC } from "react";

const SubscriptionSuccessModal: FC = () => {
  const { modalState, closeModal } = useLayoutContext();
  const {
    onPrimaryButtonClick,
    customProps: { campaignImage, campaignName } = {},
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
      <SubscriptionSuccess
        campaignImage={campaignImage}
        campaignName={campaignName}
        onCloseClick={closeModal}
      />
    </Dialog>
  );
};

export default SubscriptionSuccessModal;
