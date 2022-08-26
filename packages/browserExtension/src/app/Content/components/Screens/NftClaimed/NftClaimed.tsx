import SuccessModal, {
  useGenericModalStyles,
} from "@app/Content/components/Modals/SuccessModal";
import {
  EAPP_STATE,
  IRewardItem,
  rewardItemQMarkImg,
  rewardItemToClaim01Img,
  rewardItemToClaim02Img,
  rewardItemToClaim03Img,
} from "@app/Content/constants";
import { ExternalCoreGateway } from "@app/coreGateways";
import { Box, Typography } from "@material-ui/core";
import { IInvitationDomainWithUUID } from "@shared/interfaces/actions";
import React from "react";
import Browser from "webextension-polyfill";

interface INftClaimedProps {
  changeAppState: (state: EAPP_STATE) => void;
  rewardItem: IRewardItem;
  invitationDomain: IInvitationDomainWithUUID | undefined;
  coreGateway: ExternalCoreGateway;
}

const NftClaimed: React.FC<INftClaimedProps> = ({
  changeAppState,
  rewardItem,
  invitationDomain,
}: INftClaimedProps) => {
  const modalClasses = useGenericModalStyles();
  const imgArr = [
    rewardItemQMarkImg,
    rewardItemToClaim01Img,
    rewardItem.nftClaimedImage,
    rewardItemToClaim02Img,
    rewardItemToClaim03Img,
  ];
  const onPrimaryButtonClick = () => {
    changeAppState(EAPP_STATE.DISMISSED);
  };

  const onSecondaryButtonClick = () => {
    changeAppState(EAPP_STATE.DISMISSED);
  };

  return (
    <SuccessModal
      onCloseButtonClick={onSecondaryButtonClick}
      onSecondaryButtonClick={onSecondaryButtonClick}
      onPrimaryButtonClick={onPrimaryButtonClick}
      primaryButtonText="Done!"
      secondaryButtonText="Back to Game"
      topContent={
        <>
          <img
            className={modalClasses.successLogoBig}
            src={Browser.runtime.getURL("assets/img/success.png")}
            alt="logo"
          />
        </>
      }
      bottomContent={
        <>
          <Typography
            className={modalClasses.title}
            variant="h4"
            align="center"
          >
            Congratulations!
          </Typography>
          <Typography
            className={modalClasses.description}
            variant="body1"
            align="center"
          >
            You've claimed your NFT reward
          </Typography>
          <Typography
            className={modalClasses.description}
            variant="body1"
            align="center"
          >
            {rewardItem.rewardName}
          </Typography>
          <Box display="flex" justifyContent="space-evenly" alignItems="center">
            {imgArr.map((i) => (
              <img width={65} src={i} />
            ))}
          </Box>
        </>
      }
    />
  );
};

export default NftClaimed;
