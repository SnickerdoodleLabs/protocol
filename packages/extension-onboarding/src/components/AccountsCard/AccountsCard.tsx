import { Box, Typography } from "@material-ui/core";
import React, { FC, useCallback } from "react";

import { useStyles } from "@extension-onboarding/components/AccountsCard/AccountsCard.style";
import AccountCardItem from "@extension-onboarding/components/AccountsCard/components/AccountCardItem";
import EmptyContent from "@extension-onboarding/components/AccountsCard/components/EmptyContent";
import { EModalSelectors } from "@extension-onboarding/components/Modals";
import {
  useAppContext,
  ILinkedAccount,
} from "@extension-onboarding/context/App";
import { useLayoutContext } from "@extension-onboarding/context/LayoutContext";

const AccountCard: FC = () => {
  const classes = useStyles();
  const { linkedAccounts, deleteAccount } = useAppContext();
  const { setModal } = useLayoutContext();

  const onUnlinkClick = useCallback(
    (account: ILinkedAccount) => {
      setModal({
        modalSelector: EModalSelectors.ACCOUNT_UNLINKED,
        onPrimaryButtonClick: () => {
          deleteAccount(account);
        },
      });
    },
    [linkedAccounts],
  );
  return (
    <>
      <Typography className={classes.title}>Your Linked Account</Typography>
      <Box mt={5} className={classes.container}>
        {linkedAccounts?.length ? (
          linkedAccounts?.map?.((account) => (
            <AccountCardItem
              onUnlockClick={() => {
                onUnlinkClick(account);
              }}
              key={account.accountAddress}
              account={account}
            />
          ))
        ) : (
          <EmptyContent />
        )}
      </Box>
    </>
  );
};

export default AccountCard;
