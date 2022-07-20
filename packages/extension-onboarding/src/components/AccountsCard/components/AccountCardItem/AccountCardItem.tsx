import { Box, Button, Typography } from "@material-ui/core";
import React, { FC, useMemo } from "react";

import tickIcon from "@extension-onboarding/assets/icons/tick.svg";
import { useStyles } from "@extension-onboarding/components/AccountsCard/components/AccountCardItem/AccountCardItem.style";
import { useAppContext } from "@extension-onboarding/Context/App";

interface IAccountCardItemProps {
  // TODO write correct interface
  account: {
    key: string;
    accountAddress: string;
    name: string;
  };
  onUnlockClick: () => void;
}

const AccountCardItem: FC<IAccountCardItemProps> = ({
  account,
  onUnlockClick,
}: IAccountCardItemProps) => {
  const classes = useStyles();
  const { providerList } = useAppContext();

  const providerObject = useMemo(
    () => providerList.find((provider) => provider.key === account.key),
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
        <Button onClick={onUnlockClick} className={classes.linkAccountButton}>
          Unlink Account
        </Button>
      </Box>
    </Box>
  );
};

export default AccountCardItem;
