import { useModalStyles } from "@extension-onboarding/components/Modals/Modal.style";
import ProviderItem from "@extension-onboarding/components/v2/WalletProviderListItem";
import { useAccountLinkingContext } from "@extension-onboarding/context/AccountLinkingContext";
import { Box, Dialog } from "@material-ui/core";
import {
  CloseButton,
  SDTypography,
} from "@snickerdoodlelabs/shared-components";
import React, { FC } from "react";
interface ILinkAccountModalProps {
  closeModal: () => void;
}
const LinkAccountModal: FC<ILinkAccountModalProps> = ({
  closeModal,
}: ILinkAccountModalProps) => {
  const {
    detectedProviders,
    unDetectedProviders,
    walletKits,
    onProviderConnectClick,
    onWalletKitConnectClick,
  } = useAccountLinkingContext();
  const modalClasses = useModalStyles();
  return (
    <Dialog
      open={true}
      fullWidth
      PaperProps={{
        style: { zIndex: 9999999999 },
        square: true,
      }}
      disablePortal
      maxWidth="sm"
      className={modalClasses.container}
    >
      <Box p={3}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <SDTypography variant="titleMd" color="textHeading" fontWeight="bold">
            Link Your Crypto Accounts
          </SDTypography>
          <CloseButton onClick={closeModal} />
        </Box>
        {detectedProviders?.map((provider, index) => (
          <ProviderItem
            key={`d.${index}`}
            label={provider.name}
            icon={provider.icon}
            onClick={() => {
              onProviderConnectClick(provider);
              closeModal();
            }}
          />
        ))}
        {walletKits.map((walletKit, index) => (
          <ProviderItem
            key={`wk.${index}`}
            label={walletKit.label}
            icon={walletKit.icon}
            onClick={() => {
              onWalletKitConnectClick(walletKit.key);
              closeModal();
            }}
          />
        ))}
        {unDetectedProviders?.map((provider, index) => (
          <ProviderItem
            key={`ud.${index}`}
            label={provider.name}
            icon={provider.icon}
            onClick={() => {
              window.open(provider.installationUrl, "_blank");
              closeModal();
            }}
            buttonText="Install"
          />
        ))}
        <Box mt={4}>
          <SDTypography align="center" variant="bodySm" color="textLight">
            By linking a crypto account you are giving permission for the use of
            your Web3 activity to generate market trends. All information is
            anonymous and no insights are linked back to you.
          </SDTypography>
        </Box>
      </Box>
    </Dialog>
  );
};

export default LinkAccountModal;
