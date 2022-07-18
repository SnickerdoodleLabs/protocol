import { Box } from "@material-ui/core";
import React, { FC } from "react";

import { useStyles } from "@extension-onboarding/components/AccountsCard/AccountsCard.style";
import AccountCardItem from "@extension-onboarding/components/AccountsCard/components/AccountCardItem";
import EmptyContent from "@extension-onboarding/components/AccountsCard/components/EmptyContent";
import { useAppContext } from "@extension-onboarding/Context/App";

const AccountCard: FC = () => {
  const classes = useStyles();
  const { linkedAccounts } = useAppContext();
  return (
    <Box className={classes.container}>
      {linkedAccounts?.length ? (
        linkedAccounts?.map?.((account) => (
          <AccountCardItem key={account.accountAddress} account={account} />
        ))
      ) : (
        <EmptyContent />
      )}
    </Box>
  );
};

export default AccountCard;
