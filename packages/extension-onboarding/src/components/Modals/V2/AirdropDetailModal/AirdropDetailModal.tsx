import { useModalStyles } from "@extension-onboarding/components/Modals/Modal.style";
import { useAppContext } from "@extension-onboarding/context/App";
import { useLayoutContext } from "@extension-onboarding/context/LayoutContext";
import { Box, Dialog } from "@material-ui/core";
import {
  EarnedReward,
  DirectReward,
  LazyReward,
  Web2Reward,
  chainConfig,
} from "@snickerdoodlelabs/objects";
import {
  CloseButton,
  SDTypography,
  tokenInfoObj,
} from "@snickerdoodlelabs/shared-components";
import React, { FC } from "react";

export interface IAirdropDetailModal {
  item: DirectReward;
}

const ConfirmationModal: FC = () => {
  const { modalState, closeModal } = useLayoutContext();
  const { customProps } = modalState;
  const { apiGateway } = useAppContext();
  const { item } = customProps as IAirdropDetailModal;

  const image = (
    <img
      width="40%"
      style={{ borderRadius: 8 }}
      src={`${apiGateway.config.ipfsFetchBaseUrl}${item.image}`}
    />
  );

  const modalClasses = useModalStyles();
  return (
    <Dialog
      open={true}
      onClose={closeModal}
      fullWidth
      className={modalClasses.container}
    >
      <Box p={3}>
        <Box
          display="flex"
          alignItems="flex-start"
          justifyContent="space-between"
        >
          <SDTypography variant="titleLg" fontWeight="bold" color="textHeading">
            Airdrop Detail
          </SDTypography>
          <CloseButton onClick={closeModal} />
        </Box>
        <Box mt={4} />
        <Box
          width="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
          border="1px solid"
          borderRadius={8}
          py={4}
          borderColor="borderColor"
        >
          {image}
        </Box>
        <Box mt={4} />
        <Box
          p={3}
          display="flex"
          flexDirection="column"
          width="100%"
          border="1px solid"
          borderRadius="0px 0px 8px 8px"
          borderColor="borderColor"
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={2}
          >
            <SDTypography
              variant="headlineMd"
              color="textHeading"
              fontWeight="bold"
            >
              {item.name}
            </SDTypography>
            <img
              width={42}
              height={42}
              src={
                tokenInfoObj[
                  chainConfig.get(item.chainId)?.nativeCurrency?.symbol ?? ""
                ]?.iconSrc
              }
            />
          </Box>
          <SDTypography variant="titleLg" color="textHeading" fontWeight="bold">
            Description
          </SDTypography>
          <Box mt={1} />
          <SDTypography variant="titleSm">{item.description}</SDTypography>
        </Box>
      </Box>
    </Dialog>
  );
};

export default ConfirmationModal;
