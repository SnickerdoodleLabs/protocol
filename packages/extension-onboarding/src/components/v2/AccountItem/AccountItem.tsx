import { Box, Fade, Hidden, Theme, makeStyles } from "@material-ui/core";
import { LinkedAccount } from "@snickerdoodlelabs/objects/src/businessObjects";
import {
  useMedia,
  AccountIdentIcon,
  SDTypography,
  getAccountAddressText,
  abbreviateString,
} from "@snickerdoodlelabs/shared-components";
import React, { FC, useEffect } from "react";

interface IAccountItemProps {
  account: LinkedAccount;
  abbreviationSize?: number;
}

const useStyles = makeStyles((theme: Theme) => ({
  checkIcon: {
    color: theme.palette.success.main,
    position: "absolute",
    top: 0,
    zIndex: 1,
    left: 0,
    strokeDasharray: 50,
    transition: "all 300ms ease-in-out",
  },
}));

const AccountItem: FC<IAccountItemProps> = ({
  account,
  abbreviationSize = 6,
}) => {
  const currentBreakPoint = useMedia();
  const [isCopied, setIsCopied] = React.useState(false);
  const classes = useStyles();
  useEffect(() => {
    if (isCopied) {
      setTimeout(() => {
        setIsCopied(false);
      }, 1000);
    }
  }, [isCopied]);

  return (
    <Box display="flex" alignItems="center">
      <AccountIdentIcon
        accountAddress={account.sourceAccountAddress}
        size={currentBreakPoint === "xs" ? 32 : 40}
      />
      <Box ml={1.5} />
      <Box width={{ xs: undefined, sm: undefined, md: 402 }}>
        <SDTypography variant="bodyLg" fontWeight="medium" color="textHeading">
          {["xs", "sm"].includes(currentBreakPoint)
            ? abbreviateString(
                account.sourceAccountAddress,
                currentBreakPoint === "xs" ? abbreviationSize : undefined,
                currentBreakPoint === "xs" ? abbreviationSize : undefined,
              )
            : account.sourceAccountAddress}
        </SDTypography>
      </Box>
      <Box
        ml={{ xs: 1, sm: 1.5 }}
        width={{ xs: 16, sm: 20 }}
        height={{ xs: 16, sm: 20 }}
        position="relative"
      >
        <Fade in={!isCopied}>
          <img
            onClick={() => {
              navigator.clipboard.writeText(
                account.sourceAccountAddress.toLocaleLowerCase(),
              );
              setIsCopied(true);
            }}
            width="100%"
            height="100%"
            src={
              "https://storage.googleapis.com/dw-assets/shared/icons/copy.svg"
            }
          />
        </Fade>
        <Fade in={isCopied}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={classes.checkIcon}
          >
            <path d="M13.25 4.75L6 12L2.75 8.75" />
          </svg>
        </Fade>
      </Box>
    </Box>
  );
};

export default AccountItem;
