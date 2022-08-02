import React from "react";
import { Box, Typography } from "@material-ui/core";

import Modal, { useGenericModalStyles } from "../../Modals/Modal";

import { EAPP_STATE, IRewardItem } from "../../../constants";
import { Invitation, UUID } from "@snickerdoodlelabs/objects";
import { IInvitationDomainWithUUID } from "../../App/App";
import { ExternalCoreGateway } from "@app/coreGateways";

interface IRewardCardProps {
  changeAppState: (state: EAPP_STATE) => void;
  rewardItem: IRewardItem;
  invitationDomain: IInvitationDomainWithUUID | undefined;
  coreGateway:ExternalCoreGateway
}

const RewardCard: React.FC<IRewardCardProps> = ({
  changeAppState,
  rewardItem,
  invitationDomain,
  coreGateway
}: IRewardCardProps) => {
  
  const acceptInvitation = () =>{
    coreGateway.acceptInvitation(null,invitationDomain?.UUID as UUID)
  }
  const rejectInvitation = () =>{
    coreGateway.rejectInvitation(invitationDomain?.UUID as UUID)
  }



  const modalClasses = useGenericModalStyles();

  const onPrimaryButtonClick = () => {
    changeAppState(EAPP_STATE.CONNECT_WALLET);
    acceptInvitation();
  };

  const onSecondaryButtonClick = () => {
    changeAppState(EAPP_STATE.DISMISSED);
    rejectInvitation();
  };

  return (
    <Modal
      secondaryButtonText={rewardItem.secondaryButtonText}
      primaryButtonText={rewardItem.primaryButtonText}
      onPrimaryButtonClick={onPrimaryButtonClick}
      onSecondaryButtonClick={onSecondaryButtonClick}
      onCloseButtonClick={onSecondaryButtonClick}
      topContent={
        <>
          <img
            className={modalClasses.image}
            src={rewardItem.image}
            alt="logo"
          />

          <Box
            padding="3px 12px"
            bgcolor="rgba(255, 255, 255, 0.5)"
            borderRadius={4}
            mt={0.75}
          >
            <Typography variant="body1" align="center">
              {rewardItem.rewardName}
            </Typography>
          </Box>
        </>
      }
      bottomContent={
        <>
          <Typography
            className={modalClasses.title}
            variant="h4"
            align="center"
          >
            {rewardItem.title}
          </Typography>
          <Typography
            className={modalClasses.description}
            variant="body1"
            align="center"
          >
            {rewardItem.description}
          </Typography>
        </>
      }
    />
  );
};

export default RewardCard;
