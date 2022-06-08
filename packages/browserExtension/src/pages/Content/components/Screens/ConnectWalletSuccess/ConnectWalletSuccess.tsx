import React from "react";
import { Box, Typography } from "@material-ui/core";

import Modal, { useGenericModalStyles } from "../../Modals/Modal";
import { EAPP_STATE } from "../../../constants";

interface IConnectWalletSuccessProps {
  changeAppState: (state: EAPP_STATE) => void;
}

const ConnectWalletSuccess: React.FC<IConnectWalletSuccessProps> = ({
  changeAppState,
}: IConnectWalletSuccessProps) => {
  const modalClasses = useGenericModalStyles();
  const onCloseButtonClick = () => {
    changeAppState(EAPP_STATE.DISMISSED);
  };
  return (
    <Modal
      onCloseButtonClick={onCloseButtonClick}
      topContent={
        <img
          className={modalClasses.image}
          src={chrome.runtime.getURL("assets/img/metamask.png")}
          alt="logo"
        />
      }
      bottomContent={
        <>
          <Typography
            className={modalClasses.title}
            variant="h4"
            align="center"
          >
            {`Successfully Connected to MetaMask`}
          </Typography>
          <Box width="100%" display="flex" justifyContent="center">
            <img
              className={modalClasses.successLogo}
              src={chrome.runtime.getURL("assets/img/success.png")}
              alt="logo"
            />
          </Box>
        </>
      }
    />
  );
};

export default ConnectWalletSuccess;
