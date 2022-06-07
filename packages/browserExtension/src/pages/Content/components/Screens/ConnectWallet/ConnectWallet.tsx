import React from "react";
import { Typography } from "@material-ui/core";

import Modal, { useGenericModalStyles } from "../../Modals/Modal";
import { EAPP_STATE, signatureMessage } from "../../../constants";

interface IConnectWalletProps {
  changeAppState: (state: EAPP_STATE) => void;
}

const ConnectWallet: React.FC<IConnectWalletProps> = ({
  changeAppState,
}: IConnectWalletProps) => {
  const modalClasses = useGenericModalStyles();

  const onPrimaryButtonClick = () => {
    document.dispatchEvent(
      new CustomEvent("SD_CONNECT_TO_WALLET_REQUEST", {
        detail: { signatureMessage },
      }),
    );
  };
  const onSecondaryButtonClick = () => {
    changeAppState(EAPP_STATE.DISMISSED);
  };
  return (
    <Modal
      secondaryButtonText="Back to Game"
      primaryButtonText="Connect"
      onPrimaryButtonClick={onPrimaryButtonClick}
      onSecondaryButtonClick={onSecondaryButtonClick}
      onCloseButtonClick={onSecondaryButtonClick}
      topContent={
        <>
          <img
            className={modalClasses.image}
            src={chrome.runtime.getURL("assets/img/wallet.png")}
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
            Connect Your Wallet
          </Typography>
          <Typography
            className={modalClasses.description}
            variant="body1"
            align="center"
          >
            Choose and connect your wallet with Snickerdoodle Data Wallet to
            gain NFTs or other rewards!
          </Typography>
        </>
      }
    />
  );
};

export default ConnectWallet;
