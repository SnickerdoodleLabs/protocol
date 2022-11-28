import { Box, IconButton, Modal } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import {
  EVMAccountAddress,
  TokenBalance,
  WalletNFT,
} from "@snickerdoodlelabs/objects";

import React, { FC } from "react";
import snickerDoodleLogo from "@extension-onboarding/assets/icons/snickerdoodleLogo.svg";
import { useStyles } from "@extension-onboarding/components/Modals/ViewDetailsModal/ViewDetailsModal.style";
import { useLayoutContext } from "@extension-onboarding/context/LayoutContext";
import { IWindowWithSdlDataWallet } from "@extension-onboarding/services/interfaces/sdlDataWallet/IWindowWithSdlDataWallet";
import Portfolio from "@extension-onboarding/components/Portfolio";

declare const window: IWindowWithSdlDataWallet;
export interface IAccountBalanceObject {
  [id: EVMAccountAddress]: TokenBalance[];
}
export interface IAccountNFTsObject {
  [id: EVMAccountAddress]: WalletNFT[];
}

const ViewDetailsModal: FC = () => {
  const { closeModal, modalState } = useLayoutContext();

  const { account } = modalState.customProps;
  const classes = useStyles();

  return (
    <>
      <Modal
        open
        onClose={closeModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          display="flex"
          flexDirection="column"
          mb={6}
          className={classes.wrapper}
        >
          <Box px={8} mb={9}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <img src={snickerDoodleLogo} />
              <IconButton onClick={closeModal}>
                <CloseIcon fontSize="large" />
              </IconButton>
            </Box>
            <Box>
              <Portfolio selectedAccount={account.accountAddress} />
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default ViewDetailsModal;
