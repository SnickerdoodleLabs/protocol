import { Box, Button, Typography } from "@material-ui/core";
import React, { FC, useMemo } from "react";

import tickIcon from "@extension-onboarding/assets/icons/tick.svg";
import { useStyles } from "@extension-onboarding/components/AccountsCard/components/AccountCardItem/AccountCardItem.style";
import { useAppContext } from "@extension-onboarding/context/App";
import { useLayoutContext } from "@extension-onboarding/context/LayoutContext";
import { EModalSelectors } from "@extension-onboarding/components/Modals";

interface IAccountCardItemProps {
  // TODO write correct interface
  account: {
    key: string;
    accountAddress: string;
    name: string;
  };
}

const ChainData: FC<IAccountCardItemProps> = ({
  account,
}: IAccountCardItemProps) => {
  const classes = useStyles();
  const { providerList, deleteAccount } = useAppContext();
  const { setModal } = useLayoutContext();

  const onPrimaryButtonClick = () => {
    deleteAccount(account);
  };

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
      <Button
          onClick={() => {
            setModal({
              modalSelector: EModalSelectors.ACCOUNT_UNLINKED,
              onPrimaryButtonClick
            });
          }}
        style={{color:"#8079B4",fontSize:12,fontWeight:500}}
        >
          Unlink Account
        </Button>

        <Button
          onClick={() => {
            setModal({
              modalSelector: EModalSelectors.ACCOUNT_UNLINKED,
              onPrimaryButtonClick
            });
          }}
          className={classes.linkAccountButton}
        >
          View Details
        </Button>
      </Box>
    </Box>
  );
};

export default ChainData;
