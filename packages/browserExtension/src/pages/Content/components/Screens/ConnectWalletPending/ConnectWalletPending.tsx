import { Box, CircularProgress, Typography } from "@material-ui/core";
import React from "react";
import Modal, { useGenericModalStyles } from "../../Modals/Modal";
import { EAPP_STATE } from "../../../constants";
interface IConnectWalletPendingProps {
  changeAppState: (state: EAPP_STATE) => void;
}

const ConnectWalletPending: React.FC<IConnectWalletPendingProps> = ({
  changeAppState,
}: IConnectWalletPendingProps) => {
  const modalClasses = useGenericModalStyles();
  const onCloseButtonClick = () => {
    changeAppState(EAPP_STATE.DISMISSED);
  };
  return (
    <Modal
      onCloseButtonClick={onCloseButtonClick}
      topContent={
        <>
          <img
            className={modalClasses.image}
            src={chrome.runtime.getURL("assets/img/metamask.png")}
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
            {`Connect MetaMask`}
          </Typography>
          <Typography
            className={modalClasses.description}
            variant="body1"
            align="center"
          >
            {`Waiting for confirmation from MetaMask`}
          </Typography>
          <Box
            width="100%"
            display="flex"
            justifyContent="center"
            color="black"
          >
            <CircularProgress color="inherit" />
          </Box>
        </>
      }
    />
  );
};

export default ConnectWalletPending;
