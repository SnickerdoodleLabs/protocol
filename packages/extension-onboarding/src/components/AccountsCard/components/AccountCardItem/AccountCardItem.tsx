import copyIcon from "@extension-onboarding/assets/icons/copy.svg";
import tickIcon from "@extension-onboarding/assets/icons/tick.svg";
import AccountIdentIcon from "@extension-onboarding/components/AccountIdentIcon";
import { useStyles } from "@extension-onboarding/components/AccountsCard/components/AccountCardItem/AccountCardItem.style";
import Radio from "@extension-onboarding/components/Radio";
import {
  useAppContext,
  ILinkedAccount,
} from "@extension-onboarding/context/App";
import { Box, Fade, Typography } from "@material-ui/core";
import React, { FC, useEffect, useState } from "react";
interface IAccountCardItemProps {
  account: ILinkedAccount;
  onButtonClick?: () => void;
  buttonText?: string;
  onSelect: () => void;
  isSelected: boolean;
  useBg: boolean;
}

const AccountCardItem: FC<IAccountCardItemProps> = ({
  account,
  isSelected,
  onSelect,
  useBg,
}: IAccountCardItemProps) => {
  const classes = useStyles();
  const [isCopied, setIsCopied] = useState(false);
  useEffect(() => {
    if (isCopied) {
      setTimeout(() => {
        setIsCopied(false);
      }, 1000);
    }
  }, [isCopied]);
  return (
    <Box
      display="flex"
      alignItems="center"
      pl={3.75}
      py={2}
      {...(useBg && { bgcolor: "#F2F2F8" })}
    >
      <AccountIdentIcon accountAddress={account.accountAddress} />
      <Typography className={classes.accountAddressText}>
        {account.accountAddress.slice(0, 5)} ................
        {account.accountAddress.slice(-4)}
      </Typography>
      <img
        onClick={() => {
          navigator.clipboard.writeText(
            account.accountAddress.toLocaleLowerCase(),
          );
          setIsCopied(true);
        }}
        className={classes.copyIcon}
        src={copyIcon}
      />
      <Fade in={isCopied}>
        <Typography>copied</Typography>
      </Fade>
      <Box marginLeft="auto" px={8.5} alignItems="center" display="flex">
        <Radio checked={isSelected} onClick={onSelect} />
      </Box>
    </Box>
  );
};

export default AccountCardItem;
