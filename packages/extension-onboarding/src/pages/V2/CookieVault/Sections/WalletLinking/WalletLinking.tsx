import Card from "@extension-onboarding/components/v2/Card";
import CardTitle from "@extension-onboarding/components/v2/CardTitle";
import { Wallet } from "@extension-onboarding/components/v2/LinkedAccountItem";
import { WalletMenu } from "@extension-onboarding/components/v2/LinkingAccountMenu";
import { useAppContext } from "@extension-onboarding/context/App";
import { Box } from "@material-ui/core";
import React, { Fragment } from "react";
const WalletLinking = () => {
  const { linkedAccounts } = useAppContext();
  return (
    <Card>
      <CardTitle
        title="Wallets"
        subtitle="Anonymize your wallets and share data sets including Token Balances, NFT Holdings, and dApp usage."
      />
      <Box mt={4} />
      <WalletMenu />
      {linkedAccounts.length > 0 && <Box mt={4} />}
      {linkedAccounts.map((account) => (
        <Fragment key={account.sourceAccountAddress}>
          <Wallet account={account} />
          {linkedAccounts.indexOf(account) !== linkedAccounts.length - 1 && (
            <Box mt={3} />
          )}
        </Fragment>
      ))}
    </Card>
  );
};

export default WalletLinking;
