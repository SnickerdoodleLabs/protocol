import AccountItem from "@extension-onboarding/components/v2/AccountItem";
import AccountRemoveItem from "@extension-onboarding/components/v2/AccountRemoveItem";
import Card from "@extension-onboarding/components/v2/Card";
import CardTitle from "@extension-onboarding/components/v2/CardTitle";

import Table, { IColumn } from "@extension-onboarding/components/v2/Table";
import { useAppContext } from "@extension-onboarding/context/App";
import { useDataWalletContext } from "@extension-onboarding/context/DataWalletContext";
import Box from "@material-ui/core/Box";
import { LinkedAccount } from "@snickerdoodlelabs/objects";
import { getChainImageSrc } from "@snickerdoodlelabs/shared-components";
import React from "react";

const columns: IColumn<LinkedAccount>[] = [
  {
    label: "AccountAddress",
    render: (row: LinkedAccount) => (
      <AccountItem abbreviationSize={3} account={row} />
    ),
  },
  {
    label: "Chain",
    render: (row: LinkedAccount) => (
      <img src={getChainImageSrc(row.sourceChain)} width={40} height={40} />
    ),
    align: "center" as const,
    hideOn: ["xs"],
  },
  {
    label: "Unlink",
    render: (row: LinkedAccount) => <AccountRemoveItem account={row} />,
    align: "center" as const,
  },
];

const LinkedCryptoAccounts = () => {
  const { sdlDataWallet } = useDataWalletContext();
  const { linkedAccounts } = useAppContext();

  return (
    <Card>
      <CardTitle
        title="Your Linked Web3 Accounts"
        subtitle="Your accounts to receive airdrops from."
      />
      <Box mt={3} />
      <Table columns={columns} data={linkedAccounts} />
    </Card>
  );
};

export default LinkedCryptoAccounts;
