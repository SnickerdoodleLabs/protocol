import AccountItem from "@extension-onboarding/components/v2/AccountItem";
import AccountRemoveItem from "@extension-onboarding/components/v2/AccountRemoveItem";
import Table, { IColumn } from "@extension-onboarding/components/v2/Table";
import { useAppContext } from "@extension-onboarding/context/App";
import { Box } from "@material-ui/core";
import { LinkedAccount } from "@snickerdoodlelabs/objects";
import {
  Card,
  CardTitle,
  getChainImageSrc,
} from "@snickerdoodlelabs/shared-components";
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
