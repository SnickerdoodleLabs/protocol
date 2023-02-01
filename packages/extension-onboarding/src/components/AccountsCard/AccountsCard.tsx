import { useStyles } from "@extension-onboarding/components/AccountsCard/AccountsCard.style";
import AccountCardItem from "@extension-onboarding/components/AccountsCard/components/AccountCardItem";
import EmptyContent from "@extension-onboarding/components/AccountsCard/components/EmptyContent";
import { useAppContext } from "@extension-onboarding/context/App";
import { Box } from "@material-ui/core";
import { AccountAddress } from "@snickerdoodlelabs/objects";
import React, { ReactNode } from "react";

interface IAccountCardProps {
  receivingAddress: AccountAddress | undefined;
  onSelect: (accountAddress: AccountAddress) => void;
  buttonText?: string;
  topContent?: ReactNode;
}

const AccountCard = ({
  receivingAddress,
  onSelect,
  buttonText,
  topContent,
}: IAccountCardProps) => {
  const classes = useStyles();
  const { linkedAccounts } = useAppContext();
  return (
    <Box
      className={classes.container}
      {...(!topContent && { borderRadius: "0px !important" })}
    >
      {topContent && topContent}
      <Box className={classes.accountsContainer}>
        {linkedAccounts?.length ? (
          linkedAccounts?.map?.((account, index) => (
            <AccountCardItem
              key={account.accountAddress}
              useBg={index % 2 === 0}
              account={account}
              buttonText={buttonText}
              onSelect={() => {
                onSelect(account.accountAddress);
              }}
              isSelected={account.accountAddress === receivingAddress}
            />
          ))
        ) : (
          <EmptyContent />
        )}
      </Box>
    </Box>
  );
};

export default AccountCard;
