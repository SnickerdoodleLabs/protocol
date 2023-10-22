import { Box, Fade } from "@material-ui/core";
import { LinkedAccount } from "@snickerdoodlelabs/objects/src/businessObjects";
import {
  useMedia,
  AccountIdentIcon,
  SDTypography,
  getAccountAddressText,
} from "@snickerdoodlelabs/shared-components";
import React, { FC, useEffect } from "react";

interface IAccountItemProps {
  account: LinkedAccount;
}
const AccountItem: FC<IAccountItemProps> = ({ account }) => {
  const currentBreakPoint = useMedia();
  const [isCopied, setIsCopied] = React.useState(false);
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
        size={40}
      />
      <Box ml={1.5} />
      <Box width={{ xs: undefined, sm: undefined, md: 402 }}>
        <SDTypography variant="bodyLg" fontWeight="medium" color="textHeading">
          {["xs", "sm"].includes(currentBreakPoint)
            ? getAccountAddressText(account.sourceAccountAddress)
            : account.sourceAccountAddress}
        </SDTypography>
      </Box>
      <Box ml={1.5} />
      <img
        onClick={() => {
          navigator.clipboard.writeText(
            account.sourceAccountAddress.toLocaleLowerCase(),
          );
          setIsCopied(true);
        }}
        width={20}
        height={20}
        src={"https://storage.googleapis.com/dw-assets/shared/icons/copy.svg"}
      />
      <Fade in={isCopied}>
        <SDTypography>copied</SDTypography>
      </Fade>
    </Box>
  );
};

export default AccountItem;
