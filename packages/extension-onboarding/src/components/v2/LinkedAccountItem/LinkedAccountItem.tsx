import { useDataWalletContext } from "@extension-onboarding/context/DataWalletContext";
import {
  Box,
  Fade,
  IconButton,
  Menu,
  MenuItem,
  Theme,
  makeStyles,
} from "@material-ui/core";
import { AssignmentTurnedInOutlined } from "@material-ui/icons";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { LinkedAccount } from "@snickerdoodlelabs/objects/src/businessObjects";
import {
  useMedia,
  AccountIdentIcon,
  SDTypography,
  abbreviateString,
  getChainImageSrc,
} from "@snickerdoodlelabs/shared-components";
import React, { FC, useEffect, useState } from "react";

interface ILinkedAccountItemProps {
  account: LinkedAccount;
  abbreviationSize?: number;
}

const useStyles = makeStyles((theme: Theme) => ({
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

const LinkedAccountItem: FC<ILinkedAccountItemProps> = ({
  account,
  abbreviationSize = 6,
}) => {
  const currentBreakPoint = useMedia();
  const [isCopied, setIsCopied] = React.useState(false);
  const { sdlDataWallet } = useDataWalletContext();
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<(EventTarget & HTMLElement) | null>(
    null,
  );
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDisconnect = () => {
    sdlDataWallet.account.unlinkAccount(
      account.sourceAccountAddress,
      account.sourceChain,
    );
  };

  return (
    <Box
      display="flex"
      borderColor="borderColor"
      border="1px solid"
      borderRadius={12}
      alignItems="center"
      p={3}
      gridGap={16}
      position="relative"
    >
      <Box className={classes.accountItemAction} px={2}>
        <IconButton
          id="account-action"
          onClick={(e) => {
            handleClick(e);
          }}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          elevation={0}
          getContentAnchorEl={null}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          anchorEl={anchorEl}
          open={anchorEl?.id === "account-action"}
          onClose={handleClose}
        >
          <MenuItem onClick={handleDisconnect}>
            <Box
              display="flex"
              justifyContent="center"
              px={1}
              py={1}
              gridGap={8}
            >
              <DeleteForeverIcon color="error" />
              <SDTypography variant="bodyLg">Disconnect</SDTypography>
            </Box>
          </MenuItem>
        </Menu>
      </Box>
      <img src={getChainImageSrc(account.sourceChain)} width={40} height={40} />
      <SDTypography variant="bodyLg" fontWeight="bold">
        {account.sourceAccountAddress}
      </SDTypography>
    </Box>
  );
};

export default LinkedAccountItem;
