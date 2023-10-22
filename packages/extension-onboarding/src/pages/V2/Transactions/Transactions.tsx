import Container from "@extension-onboarding/components/v2/Container";
import DashboardTitle from "@extension-onboarding/components/v2/DashboardTitle";
import Table from "@extension-onboarding/components/v2/Table";
import { useDataWalletContext } from "@extension-onboarding/context/DataWalletContext";
import { EVMTransaction, chainConfig } from "@snickerdoodlelabs/objects";
import {
  getCalculatedAge,
  abbreviateString,
} from "@snickerdoodlelabs/shared-components";
import React, { useEffect, useState } from "react";

const abbreviateWithBreakPoint = (value: string, breakPoint): string => {
  const [prefixLength, suffixLength, dotLenght] =
    breakPoint === "xs" ? [4, 0, 2] : [];
  return abbreviateString(value, prefixLength, suffixLength, dotLenght);
};

const columns = [
  {
    label: "Txn Hash",
    render: (txn: EVMTransaction, breakPoint) => {
      return (
        <a
          target="_blank"
          href={chainConfig.get(txn.chain)?.getExplorerURL(txn.hash)}
        >
          {abbreviateWithBreakPoint(txn.hash, breakPoint)}
        </a>
      );
    },
  },
  {
    label: "Method Id",
    render: (txn: EVMTransaction, breakPoint) => {
      return <>{txn.methodId}</>;
    },
    hideOn: ["xs" as const, "sm" as const],
  },
  {
    label: "Age",
    sortKey: "timestamp" as const,
    render: (txn: EVMTransaction) => <>{getCalculatedAge(txn.timestamp)}</>,
  },
  {
    label: "From",
    render: (txn: EVMTransaction, breakPoint) => {
      return (
        <a
          target="_blank"
          href={
            chainConfig
              .get(txn.chain)
              ?.explorerURL.replace("/tx/", "/address/")
              .replace("/extrinsic/", "/account/") + (txn.from ?? "")
          }
        >
          {abbreviateWithBreakPoint(txn.from ?? "", breakPoint)}
        </a>
      );
    },
  },

  {
    label: "To",
    render: (txn: EVMTransaction, breakPoint) => {
      return (
        <a
          target="_blank"
          href={
            chainConfig
              .get(txn.chain)
              ?.explorerURL.replace("/tx/", "/address/")
              .replace("/extrinsic/", "/account/") + (txn.to ?? "")
          }
        >
          {abbreviateWithBreakPoint(txn.to ?? "", breakPoint)}
        </a>
      );
    },
  },
  {
    label: "Value",
    render: (txn: EVMTransaction, breakPoint) => {
      return <>{txn.value}</>;
    },
    hideOn: ["xs" as const, "sm" as const],
  },
  {
    label: "Gas Fee",
    render: (txn: EVMTransaction, breakPoint) => {
      return <>{txn.gasPrice}</>;
    },
    align: "right" as const,
    hideOn: ["xs" as const, "sm" as const],
  },
];

const Transactions = () => {
  const { sdlDataWallet } = useDataWalletContext();
  // noramally getTransaction designed to return also sol transactions double check
  const [transactions, setTransactions] = useState<EVMTransaction[]>();
  useEffect(() => {
    getTransactions();
  }, []);
  const getTransactions = () => {
    sdlDataWallet
      .getTransactions()
      .map((transactions) => {
        setTransactions(transactions as EVMTransaction[]);
      })
      .mapErr((err) => {
        console.log(err);
      });
  };
  return (
    <Container>
      <DashboardTitle
        title="Transactions"
        description="Track your transactions for linked web3 accounts. Stay updated on your token, NFT, and airdrop activity."
      />
      {transactions && (
        <Table defaultItemsPerPage={10} columns={columns} data={transactions} />
      )}
    </Container>
  );
};

export default Transactions;
