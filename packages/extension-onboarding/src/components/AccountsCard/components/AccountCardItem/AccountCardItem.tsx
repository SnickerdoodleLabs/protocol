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
        {providerObject?.icon ? (
          <img className={classes.providerLogo} src={providerObject?.icon} />
        ) : (
          <Box className={classes.providerLogo}>
            <Box
              width={40}
              height={40}
              borderRadius={20}
              bgcolor="#8079B4"
              justifyContent="center"
              alignItems="center"
              display="flex"
            >
              <Typography style={{ fontSize: 12, color: "white" }}>
                {account.accountAddress.slice(0, 3)}.
                {account.accountAddress.slice(-1)}
              </Typography>
            </Box>
          </Box>
        )}
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
