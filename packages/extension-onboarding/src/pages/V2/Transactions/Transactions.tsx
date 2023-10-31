import Card from "@extension-onboarding/components/v2/Card";
import Table from "@extension-onboarding/components/v2/Table";
import UnauthScreen from "@extension-onboarding/components/v2/UnauthScreen";
import { useAppContext } from "@extension-onboarding/context/App";
import { useDataWalletContext } from "@extension-onboarding/context/DataWalletContext";
import {
  EVMTransaction,
  chainConfig,
  getChainInfoByChain,
} from "@snickerdoodlelabs/objects";
import {
  getCalculatedAge,
  abbreviateString,
  SDTypography,
} from "@snickerdoodlelabs/shared-components";
import { ethers } from "ethers";
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
        <SDTypography
          variant="link"
          color="textInfo"
          fontWeight="medium"
          onClick={() => {
            window.open(chainConfig.get(txn.chain)?.explorerURL + txn.hash);
          }}
        >
          {abbreviateWithBreakPoint(txn.hash, breakPoint)}
        </SDTypography>
      );
    },
  },
  {
    label: "Method",
    render: (txn: EVMTransaction, breakPoint) => {
      return (
        <SDTypography variant="bodyMd" color="textHeading" fontWeight="medium">
          {txn.methodId}
        </SDTypography>
      );
    },
    hideOn: ["xs" as const, "sm" as const],
  },
  {
    label: "Age",
    sortKey: "timestamp" as const,
    sortAsDefault: true,
    render: (txn: EVMTransaction) => (
      <SDTypography variant="bodyMd" color="textHeading" fontWeight="medium">
        {getCalculatedAge(txn.timestamp)}
      </SDTypography>
    ),
  },
  {
    label: "From",
    render: (txn: EVMTransaction, breakPoint) => {
      return (
        <SDTypography
          variant="link"
          color="textInfo"
          fontWeight="medium"
          onClick={() => {
            window.open(
              chainConfig
                .get(txn.chain)
                ?.explorerURL.replace("/tx/", "/address/")
                .replace("/extrinsic/", "/account/") + (txn.from ?? ""),
            );
          }}
        >
          {abbreviateWithBreakPoint(txn.from ?? "", breakPoint)}
        </SDTypography>
      );
    },
  },

  {
    label: "To",
    render: (txn: EVMTransaction, breakPoint) => {
      return (
        <SDTypography
          variant="link"
          color="textInfo"
          fontWeight="medium"
          onClick={() => {
            window.open(
              chainConfig
                .get(txn.chain)
                ?.explorerURL.replace("/tx/", "/address/")
                .replace("/extrinsic/", "/account/") + (txn.to ?? ""),
            );
          }}
        >
          {abbreviateWithBreakPoint(txn.to ?? "", breakPoint)}
        </SDTypography>
      );
    },
  },
  {
    label: "Value",
    render: (txn: EVMTransaction, breakPoint) => {
      return (
        <SDTypography variant="bodyMd" color="textHeading" fontWeight="medium">
          {_getTxValue(txn)}
        </SDTypography>
      );
    },
    hideOn: ["xs" as const, "sm" as const],
  },
  {
    label: "Txn Fee",
    render: (txn: EVMTransaction, breakPoint) => {
      return (
        <SDTypography variant="bodyMd" color="textHeading" fontWeight="medium">
          {parseFloat(_getTxValue(txn, "gasPrice")).toFixed(10)}
        </SDTypography>
      );
    },
    align: "right" as const,
    hideOn: ["xs" as const, "sm" as const],
  },
];

const _getTxValue = (
  tx: EVMTransaction,
  field: "value" | "gasPrice" = "value",
) => {
  const { decimals, symbol } = getChainInfoByChain(tx.chain).nativeCurrency;
  return `${Number.parseFloat(
    ethers.utils.formatUnits(tx[field] || "0", decimals),
  )} ${field === "value" ? symbol : ""}`;
};

const Transactions = () => {
  const { sdlDataWallet } = useDataWalletContext();
  const { linkedAccounts } = useAppContext();
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

  if (!(linkedAccounts.length > 0)) {
    return <UnauthScreen />;
  }
  return (
    <>
      {transactions && (
        <Card
          children={
            <Table
              defaultItemsPerPage={10}
              columns={columns}
              data={transactions}
            />
          }
        />
      )}
    </>
  );
};

export default Transactions;
