import { useStyles } from "@extension-onboarding/components/AccountsCard/AccountsCard.style";
import AccountCardItem from "@extension-onboarding/components/AccountsCard/components/AccountCardItem";
import EmptyContent from "@extension-onboarding/components/AccountsCard/components/EmptyContent";
import {
  useAppContext,
  ILinkedAccount,
} from "@extension-onboarding/context/App";
import { Box } from "@material-ui/core";
import React, { Fragment, ReactNode } from "react";

interface IAccountCardProps {
  useDivider?: boolean;
  onButtonClick?: ((account: ILinkedAccount) => void) | null;
  buttonText?: string;
  topContent?: ReactNode;
}

const AccountCard = ({
  useDivider = false,
  onButtonClick = null,
  buttonText,
  topContent,
}: IAccountCardProps) => {
  const classes = useStyles();
  const { linkedAccounts } = useAppContext();

  return (
    <Box className={classes.container}>
      {topContent && topContent}
      {linkedAccounts?.length ? (
        linkedAccounts?.map?.((account, index) => (
          <Fragment key={account.accountAddress}>
            <AccountCardItem
              {...(onButtonClick && {
                onButtonClick: () => {
                  onButtonClick(account);
                },
              })}
              account={account}
              buttonText={buttonText}
            />
            {useDivider && index + 1 !== linkedAccounts.length && (
              <Box className={classes.divider} />
            )}
          </Fragment>
        ))
      ) : (
        <EmptyContent />
      )}
    </Box>
  );
};

export default AccountCard;
