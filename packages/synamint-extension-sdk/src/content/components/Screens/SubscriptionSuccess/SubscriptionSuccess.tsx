import { Dialog } from "@material-ui/core";
import { SubscriptionSuccess } from "@snickerdoodlelabs/shared-components";
import { useStyles } from "@synamint-extension-sdk/content/components/Screens/SubscriptionSuccess/SubscriptionSuccess.style";
import { IInvitationDomainWithUUID } from "@synamint-extension-sdk/shared/interfaces/IInvitationDomainWithUUID";
import React, { FC } from "react";

interface ISubscriptionSuccessProps {
  domainDetails: IInvitationDomainWithUUID;

  onCancelClick: () => void;
}

const SubscriptionSuccessModal: FC<ISubscriptionSuccessProps> = ({
  domainDetails,

  onCancelClick,
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
      <SubscriptionSuccess
        campaignImage={domainDetails.image}
        campaignName={domainDetails.title}
        onCloseClick={onCancelClick}
      />
    </Dialog>
  );
};

export default SubscriptionSuccessModal;
