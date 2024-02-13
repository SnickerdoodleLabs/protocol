import LinkedAccountItem from "@extension-onboarding/components/v2/LinkedAccountItem";
import { useAccountLinkingContext } from "@extension-onboarding/context/AccountLinkingContext";
import { useAppContext } from "@extension-onboarding/context/App";
import { Box, IconButton, Menu, MenuItem, makeStyles } from "@material-ui/core";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import {
  SDButton,
  SDTypography,
  getChainImageSrc,
} from "@snickerdoodlelabs/shared-components";
import React, { FC, useEffect, useState, useRef, Fragment } from "react";

interface IAccountLinkingProps {
  onComplete: () => void;
}

const AccountLinking: FC<IAccountLinkingProps> = ({ onComplete }) => {
  const { linkedAccounts } = useAppContext();
  const {
    detectedProviders,
    unDetectedProviders,
    walletKits,
    onProviderConnectClick,
    onWalletKitConnectClick,
  } = useAccountLinkingContext();

  const lastWidth = useRef<number>();

  const [anchorEl, setAnchorEl] = useState<(EventTarget & HTMLElement) | null>(
    null,
  );

  const handleClick = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (anchorEl) {
      const width = anchorEl.offsetWidth;
      if (lastWidth.current !== width) {
        lastWidth.current = width;
      }
    }
  }, [anchorEl]);

  const classes = useStyles();
  return (
    <>
      <Box
        className={classes.wrapper}
        id="account-linking"
        onClick={(e) => handleClick(e)}
        borderRadius={12}
        p={3}
        borderColor="borderColor"
        border="1px solid"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <SDTypography variant="bodyLg" fontWeight="bold">
          Connect Wallet
        </SDTypography>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          gridGap={10}
        >
          {[detectedProviders, unDetectedProviders, walletKits]
            .flat()
            .map((item) => (
              <img key={item.key} width={40} height={40} src={item.icon} />
            ))}
        </Box>
      </Box>
      <Menu
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        anchorEl={anchorEl}
        open={anchorEl?.id === "account-linking"}
        onClose={handleClose}
        MenuListProps={{
          style: { width: anchorEl?.offsetWidth ?? lastWidth.current },
        }}
        style={{ marginTop: 16 }}
      >
        {detectedProviders.map((provider) => (
          <MenuItem
            key={provider.name}
            onClick={() => {
              onProviderConnectClick(provider);
              handleClose();
            }}
          >
            <Box display="flex" gridGap={16} alignItems="center">
              <img src={provider.icon} width={24} height={24} />
              <SDTypography variant="bodyLg" fontWeight="bold">
                Connect {provider.name}
              </SDTypography>
            </Box>
          </MenuItem>
        ))}
        {unDetectedProviders.map((provider) => (
          <MenuItem
            key={provider.name}
            onClick={() => {
              window.open(provider.installationUrl, "_blank");
              handleClose();
            }}
          >
            <Box display="flex" gridGap={16} alignItems="center">
              <img src={provider.icon} width={24} height={24} />
              <SDTypography variant="bodyLg" fontWeight="bold">
                Install {provider.name}
              </SDTypography>
            </Box>
          </MenuItem>
        ))}
        {walletKits.map((wallet) => (
          <MenuItem
            key={wallet.key}
            onClick={() => {
              onWalletKitConnectClick(wallet.key);
              handleClose();
            }}
          >
            <Box display="flex" gridGap={16} alignItems="center">
              <img src={wallet.icon} width={24} height={24} />
              <SDTypography variant="bodyLg" fontWeight="bold">
                Connect {wallet.label}
              </SDTypography>
            </Box>
          </MenuItem>
        ))}
      </Menu>
      {linkedAccounts.length > 0 && (
        <>
          <Box mt={3} />
          {linkedAccounts.map((account, index) => (
            <Fragment key={index}>
              <LinkedAccountItem account={account} key={index} />
              {index !== linkedAccounts.length - 1 && <Box mt={3} />}
            </Fragment>
          ))}
        </>
      )}

      <Box mt={6}>
        <SDButton
          variant={linkedAccounts.length > 0 ? "contained" : "outlined"}
          color="primary"
          onClick={() => {
            onComplete();
          }}
        >
          {linkedAccounts.length > 0 ? "Next" : "Skip"}
        </SDButton>
      </Box>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  wrapper: {
    cursor: "pointer",
  },
  accountItemAction: {
    width: "100%",
    height: "100%",
    position: "absolute",
    alignItems: "center",
    left: 0,
    right: 0,
    display: "flex",
    justifyContent: "flex-end",
    opacity: 0,
    transition: "opacity 0.5s",
    "&:hover": {
      opacity: 1,
    },
  },
}));

export default AccountLinking;
