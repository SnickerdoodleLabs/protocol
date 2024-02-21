import { Wallet } from "@extension-onboarding/components/v2/LinkedAccountItem";
import { WalletMenu } from "@extension-onboarding/components/v2/LinkingAccountMenu";
import { useAppContext } from "@extension-onboarding/context/App";
import { Box } from "@material-ui/core";
import { SDButton } from "@snickerdoodlelabs/shared-components";
import React, { FC, Fragment } from "react";

interface IAccountLinkingProps {
  onComplete: () => void;
}

const AccountLinking: FC<IAccountLinkingProps> = ({ onComplete }) => {
  const { linkedAccounts } = useAppContext();
  return (
    <>
      <WalletMenu />
      {linkedAccounts.length > 0 && (
        <>
          <Box mt={3} />
          {linkedAccounts.map((account, index) => (
            <Fragment key={index}>
              <Wallet account={account} key={index} />
              {index !== linkedAccounts.length - 1 && <Box mt={3} />}
            </Fragment>
          ))}
        </>
      )}

      <Box mt={6}>
        <SDButton
          variant={linkedAccounts.length > 0 ? "contained" : "outlined"}
          color="primary"
          onClick={() => {
            onComplete();
          }}
        >
          {linkedAccounts.length > 0 ? "Next" : "Skip"}
        </SDButton>
      </Box>
    </>
  );
};

export default AccountLinking;
