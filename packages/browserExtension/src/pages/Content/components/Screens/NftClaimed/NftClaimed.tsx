import React from "react";
import { Typography } from "@material-ui/core";

import SuccessModal, { useGenericModalStyles } from "../../Modals/SuccessModal";

import { EAPP_STATE, IRewardItem } from "../../../constants";

interface INftClaimedProps {
  changeAppState: (state: EAPP_STATE) => void;
  rewardItem: IRewardItem;
}

const NftClaimed: React.FC<INftClaimedProps> = ({
  changeAppState,
  rewardItem,
}: INftClaimedProps) => {
  const modalClasses = useGenericModalStyles();
  const onPrimaryButtonClick = () => {};

  const onSecondaryButtonClick = () => {
    changeAppState(EAPP_STATE.DISMISSED);
  };

  return (
    <SuccessModal
      onCloseButtonClick={onSecondaryButtonClick}
      onSecondaryButtonClick={onSecondaryButtonClick}
      onPrimaryButtonClick={onPrimaryButtonClick}
      primaryButtonText="More Offers"
      secondaryButtonText="Go to Game"
      topContent={
        <>
          <img
            className={modalClasses.successLogoBig}
            src={chrome.runtime.getURL("assets/img/success.png")}
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
        </>
      }
    />
  );
};

export default NftClaimed;
