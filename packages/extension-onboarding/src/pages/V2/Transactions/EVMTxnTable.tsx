import AccountChainBar, {
  EDisplayMode,
} from "@extension-onboarding/components/AccountChainBar";
import Card from "@extension-onboarding/components/v2/Card";
import CardTitle from "@extension-onboarding/components/v2/CardTitle";
import Table from "@extension-onboarding/components/v2/Table";
import { useAppContext } from "@extension-onboarding/context/App";
import { Box } from "@material-ui/core";
import {
  AccountAddress,
  ChainId,
  EChainType,
  EVMAccountAddress,
  EVMTransaction,
  LinkedAccount,
  chainConfig,
  getChainInfoByChain,
} from "@snickerdoodlelabs/objects";
import {
  SDTypography,
  abbreviateString,
  getCalculatedAge,
} from "@snickerdoodlelabs/shared-components";
import { ethers } from "ethers";
import React, { FC, useMemo, useState } from "react";

interface IEVMTxnTableProps {
  transactions?: EVMTransaction[];
}

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

const EVMTxnTable: FC<IEVMTxnTableProps> = ({ transactions }) => {
  const { linkedAccounts } = useAppContext();
  const [selectedAccount, setSelectedAccount] = useState<AccountAddress>();
  const [selectedChain, setSelectedChain] = useState<ChainId>();
  const [displayMode, setDisplayMode] = useState<EDisplayMode>(
    EDisplayMode.MAINNET,
  );
  const transactionsToRender = useMemo(() => {
    if (!transactions) {
      return undefined;
    }
    let _transactions = [...transactions];
    if (selectedAccount) {
      _transactions = _transactions.filter(
        (t) => t.from === selectedAccount || t.to === selectedAccount,
      );
    }
    if (selectedChain) {
      _transactions = _transactions.filter((t) => t.chain === selectedChain);
    }
    return displayMode === EDisplayMode.MAINNET
      ? _transactions.filter(
          (t) => chainConfig.get(t.chain)?.type === EChainType.Mainnet,
        )
      : _transactions.filter(
          (t) => chainConfig.get(t.chain)?.type === EChainType.Testnet,
        );
  }, [transactions, displayMode, selectedAccount, selectedChain]);

  // filter accounts and chains to render on account chain bar
  const { accounts, chains } = useMemo(() => {
    const accountAdresses = (linkedAccounts || ([] as LinkedAccount[])).map(
      (account) => account.sourceAccountAddress,
    );
    return (transactions || ([] as EVMTransaction[])).reduce(
      (acc, txn) => {
        if (
          accountAdresses.includes(txn.from || ("" as EVMAccountAddress)) &&
          !acc.accounts.includes(txn.from || ("" as EVMAccountAddress))
        ) {
          acc.accounts.push(txn.from || ("" as EVMAccountAddress));
        }
        if (
          accountAdresses.includes(txn.to || ("" as EVMAccountAddress)) &&
          !acc.accounts.includes(txn.to || ("" as EVMAccountAddress))
        ) {
          acc.accounts.push(txn.to || ("" as EVMAccountAddress));
        }
        const txnChainId = getChainInfoByChain(txn.chain).chainId;
        if (!acc.chains.includes(txnChainId)) {
          acc.chains.push(txnChainId);
        }

        return acc;
      },
      {
        accounts: [] as AccountAddress[],
        chains: [] as ChainId[],
      },
    );
  }, [transactions, linkedAccounts]);
  return transactions ? (
    <>
      <Card>
        <CardTitle title="EVM Transactions" />
        <Box mt={3} />
        <AccountChainBar
          accountAdressesToRender={accounts}
          chainIdsToRender={chains}
          accountSelect={selectedAccount}
          chainSelect={selectedChain}
          setAccountSelect={setSelectedAccount}
          setChainSelect={setSelectedChain}
          displayMode={displayMode}
          setDisplayMode={setDisplayMode}
        />
        <Box mt={3} />
        {transactionsToRender && (
          <Table
            defaultItemsPerPage={10}
            columns={columns}
            data={transactionsToRender}
          />
        )}
      </Card>
    </>
  ) : null;
};

export default EVMTxnTable;
