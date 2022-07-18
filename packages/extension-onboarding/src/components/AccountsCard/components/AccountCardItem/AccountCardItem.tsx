import { Box, Typography } from "@material-ui/core";
import React, { FC, useMemo } from "react";

import tickIcon from "@extension-onboarding/assets/icons/tick.svg";
import { useStyles } from "@extension-onboarding/components/AccountsCard/components/AccountCardItem/AccountCardItem.style";
import { useAppContext } from "@extension-onboarding/Context/App";

interface IAccountCardItemProps {
  // TODO write correct interface
  account: {
    key: string;
    accountAddress: string;
  };
}

const AccountCardItem: FC<IAccountCardItemProps> = ({
  account,
}: IAccountCardItemProps) => {
  const classes = useStyles();
  const { providerList } = useAppContext();

  const providerObject = useMemo(
    () => providerList.find((provider) => provider.key === account.key),
    [providerList, account],
  );

  return (
    <Box display="flex">
      <Box position="relative" mr={4}>
        <img className={classes.providerLogo} src={providerObject?.icon} />
        <img className={classes.tickIcon} src={tickIcon} />
      </Box>
      <Box>
        <Typography>
          {account.accountAddress.slice(0, 5)} ................
          {account.accountAddress.slice(-4)}
        </Typography>
        <Typography>{providerObject?.name} Account</Typography>
      </Box>
      <Box></Box>
    </Box>
  );
};

export default AccountCardItem;
