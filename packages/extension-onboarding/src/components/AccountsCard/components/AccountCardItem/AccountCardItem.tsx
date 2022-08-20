import { Box, Button, Typography } from "@material-ui/core";
import React, { FC, useMemo } from "react";

import tickIcon from "@extension-onboarding/assets/icons/tick.svg";
import { useStyles } from "@extension-onboarding/components/AccountsCard/components/AccountCardItem/AccountCardItem.style";
import {
  useAppContext,
  ILinkedAccount,
} from "@extension-onboarding/context/App";

interface IAccountCardItemProps {
  account: ILinkedAccount;
  onButtonClick?: () => void;
  buttonText?: string;
}

const AccountCardItem: FC<IAccountCardItemProps> = ({
  account,
  onButtonClick,
  buttonText,
}: IAccountCardItemProps) => {
  const classes = useStyles();
  const { providerList } = useAppContext();

  const providerObject = useMemo(
    () => providerList.find((provider) => provider.key === account.providerKey),
    [providerList, account],
  );

  return (
    <Box display="flex" position="relative">
      <Box position="relative">
        <img className={classes.providerLogo} src={providerObject?.icon} />
        <img className={classes.tickIcon} src={tickIcon} />
      </Box>
      <Box>
        <Typography className={classes.accountAddressText}>
          {account.accountAddress.slice(0, 5)} ................
          {account.accountAddress.slice(-4)}
        </Typography>
        <Typography className={classes.chainText}>
          {providerObject?.name} Account
        </Typography>
      </Box>
      <Box className={classes.linkAccountContainer}>
        {onButtonClick && (
          <Button onClick={onButtonClick} className={classes.linkAccountButton}>
            {buttonText}
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default AccountCardItem;
