import React, { useEffect, useMemo, useState } from "react";
import { Box, Typography, FormControlLabel } from "@material-ui/core";

import Modal, {
  useGenericModalStyles,
} from "@app/Content/components/Modals/Modal";

import { EAPP_STATE, IRewardItem } from "@app/Content/constants";
import { EWalletDataType, UUID } from "@snickerdoodlelabs/objects";

import { ExternalCoreGateway } from "@app/coreGateways";
import { IInvitationDomainWithUUID } from "@shared/interfaces/actions";
import { okAsync } from "neverthrow";
import BasicModal from "@app/Content/components/Modals/BasicModal";
import Switch from "@app/Content/components/Switch";
import Button from "@app/Content/components/Button";

interface IRewardCardProps {
  emptyReward: () => void;
  acceptInvitation: () => void;
  rejectInvitation: () => void;
  changeAppState: (state: EAPP_STATE) => void;
  rewardItem: IRewardItem;
  invitationDomain: IInvitationDomainWithUUID | undefined;
  coreGateway: ExternalCoreGateway;
}

const RewardCard: React.FC<IRewardCardProps> = ({
  emptyReward,
  changeAppState,
  acceptInvitation,
  rejectInvitation,
  rewardItem,
  invitationDomain,
  coreGateway,
}: IRewardCardProps) => {
  const modalClasses = useGenericModalStyles();

  const onPrimaryButtonClick = () => {
    coreGateway.getApplyDefaultPermissionsOption().map((option) => {
      if (option) {
        acceptInvitation();
        return;
      }
      changeAppState(EAPP_STATE.PERMISSION_SELECTION);
    });
  };

  const onSecondaryButtonClick = () => {
    coreGateway.rejectInvitation(invitationDomain?.id as UUID).map(() => {
      emptyReward();
    });
  };

  return (
    <Modal
      secondaryButtonText={rewardItem.secondaryButtonText}
      primaryButtonText={rewardItem.primaryButtonText}
      onPrimaryButtonClick={onPrimaryButtonClick}
      onSecondaryButtonClick={onSecondaryButtonClick}
      onCloseButtonClick={emptyReward}
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
