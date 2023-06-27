import { Box } from "@material-ui/core";
import { useStyles } from "@shared-components/components/AccountsCard/AccountsCard.style";
import AccountCardItem from "@shared-components/components/AccountsCard/components/AccountCardItem";
import EmptyContent from "@shared-components/components/AccountsCard/components/EmptyContent";
import { AccountAddress } from "@snickerdoodlelabs/objects";
import React, { ReactNode } from "react";

interface IAccountCardProps {
  receivingAddress: AccountAddress | undefined;
  onSelect: (accountAddress: AccountAddress) => void;
  buttonText?: string;
  topContent?: ReactNode;
  accounts: AccountAddress[];
}

export const AccountsCard = ({
  receivingAddress,
  onSelect,
  buttonText,
  topContent,
  accounts,
}: IAccountCardProps) => {
  const classes = useStyles();
  return (
    <Box
      className={classes.container}
      {...(!topContent && { borderRadius: "0px !important" })}
    >
      {topContent && topContent}
      <Box className={classes.accountsContainer}>
        {accounts?.length ? (
          accounts?.map?.((account, index) => (
            <AccountCardItem
              key={account}
              useBg={index % 2 === 0}
              accountAddress={account}
              buttonText={buttonText}
              onSelect={() => {
                onSelect(account);
              }}
              isSelected={account === receivingAddress}
            />
          ))
        ) : (
          <EmptyContent />
        )}
      </Box>
    </Box>
  );
};
