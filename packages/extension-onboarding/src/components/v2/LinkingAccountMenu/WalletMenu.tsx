import LinkingAccountMenu from "@extension-onboarding/components/v2/LinkingAccountMenu/LinkingAccountMenu";
import { useAccountLinkingContext } from "@extension-onboarding/context/AccountLinkingContext";
import Box from "@material-ui/core/Box";
import Dialog from "@material-ui/core/Dialog";
import { makeStyles } from "@material-ui/core/styles";
import {
  SDButton,
  SDTypography,
  colors,
  useResponsiveValue,
} from "@snickerdoodlelabs/shared-components";
import React, { Dispatch, SetStateAction } from "react";

export const useWalletProvider = (): {
  images: string[];
  listItems: {
    name: string;
    icon: string;
    actionName: string;
    onClick: () => void;
  }[];
} => {
  const {
    detectedProviders,
    unDetectedProviders,
    walletKits,
    onProviderConnectClick,
    onWalletKitConnectClick,
  } = useAccountLinkingContext();

  return {
    images: [detectedProviders, unDetectedProviders, walletKits]
      .flat()
      .map((item) => item.icon),
    listItems: [
      ...detectedProviders.map((provider) => ({
        name: provider.name,
        icon: provider.icon,
        actionName: "Connect",
        onClick: () => {
          onProviderConnectClick(provider);
        },
      })),
      ...unDetectedProviders.map((provider) => ({
        name: provider.name,
        icon: provider.icon,
        actionName: "Install",
        onClick: () => {
          window.open(provider.installationUrl, "_blank");
        },
      })),
      ...walletKits.map((wallet) => ({
        name: wallet.label,
        icon: wallet.icon,
        actionName: "Connect",
        onClick: () => {
          onWalletKitConnectClick(wallet.key);
        },
      })),
    ],
  };
};

export const WalletMenu = () => {
  const getResponsiveValue = useResponsiveValue();
  const { images, listItems } = useWalletProvider();

  const getItem = (icon, name, action: string) => (
    <Box display="flex" py={{ xs: 0, sm: 1 }} gridGap={12} alignItems="center">
      <img src={icon} width={24} height={24} />
      <SDTypography
        variant="bodyLg"
        fontWeight={getResponsiveValue({ xs: "regular", sm: "bold" })}
      >
        {`${action} ${name}`}
      </SDTypography>
    </Box>
  );

  return (
    <LinkingAccountMenu
      title="Connect Wallet"
      leftRender={
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          gridGap={10}
        >
          {images.map((item, index) => (
            <img
              key={`img-${index}`}
              width={getResponsiveValue({ xs: 22, sm: 40 })}
              height={getResponsiveValue({ xs: 22, sm: 40 })}
              src={item}
            />
          ))}
        </Box>
      }
      menuItems={listItems.map((item) => ({
        render: getItem(item.icon, item.name, item.actionName),
        onClick: item.onClick,
      }))}
    />
  );
};

const useStyles = makeStyles((theme) => ({
  wrapper: {
    "&:hover": {
      backgroundColor: colors.MAINPURPLE100,
    },
  },
}));

export const WalletMenuPopup = () => {
  const { listItems } = useWalletProvider();
  const [isOpen, setIsOpen] = React.useState(false);
  const getResponsiveValue = useResponsiveValue();
  const classes = useStyles();
  return (
    <>
      <SDButton
        variant="outlined"
        onClick={() => {
          setIsOpen(true);
        }}
      >
        Connect Wallet
      </SDButton>
      <Dialog
        open={isOpen}
        maxWidth="xs"
        onClose={() => {
          setIsOpen(false);
        }}
      >
        <Box p={3}>
          {listItems.map((item, index) => (
            <Box
              px={2}
              className={classes.wrapper}
              style={{
                cursor: "pointer",
              }}
              display="flex"
              py={1}
              gridGap={12}
              alignItems="center"
            >
              <img src={item.icon} width={24} height={24} />
              <SDTypography variant="bodyLg" fontWeight="bold">
                {`${item.actionName} ${item.name}`}
              </SDTypography>
            </Box>
          ))}
        </Box>
      </Dialog>
    </>
  );
};
