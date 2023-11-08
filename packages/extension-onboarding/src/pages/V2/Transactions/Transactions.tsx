import AccountChainBar, {
  EDisplayMode,
} from "@extension-onboarding/components/AccountChainBar";
import Card from "@extension-onboarding/components/v2/Card";
import Table from "@extension-onboarding/components/v2/Table";
import UnauthScreen from "@extension-onboarding/components/v2/UnauthScreen";
import { useAppContext } from "@extension-onboarding/context/App";
import { useDataWalletContext } from "@extension-onboarding/context/DataWalletContext";
import { Box } from "@material-ui/core";
import {
  AccountAddress,
  ChainId,
  EChain,
  EChainTechnology,
  EChainType,
  EVMTransaction,
  LinkedAccount,
  chainConfig,
  getChainInfoByChain,
} from "@snickerdoodlelabs/objects";
import {
  getCalculatedAge,
  abbreviateString,
  SDTypography,
} from "@snickerdoodlelabs/shared-components";
import { ethers } from "ethers";
import React, { useEffect, useMemo, useState } from "react";

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
  const [selectedAccount, setSelectedAccount] = useState<AccountAddress>();
  const [selectedChain, setSelectedChain] = useState<ChainId>();
  const [transactions, setTransactions] = useState<EVMTransaction[]>();
  const [displayMode, setDisplayMode] = useState<EDisplayMode>(
    EDisplayMode.MAINNET,
  );

  useEffect(() => {
    getTransactions();
  }, []);
  const getTransactions = () => {
    sdlDataWallet
      .getTransactions()
      .map((transactions) => {
        // filter out non-evm transactions for now
        setTransactions(
          transactions.filter(
            (txn) =>
              getChainInfoByChain(txn.chain).chainTechnology ===
              EChainTechnology.EVM,
          ) as EVMTransaction[],
        );
      })
      .mapErr((err) => {
        console.log(err);
      });
  };

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

  // filter only evm accounts and evm technology chains
  const { accounts, chains } = useMemo(() => {
    const supportedChains = Array.from(chainConfig.values()).reduce(
      (acc, chain) => {
        if (chain.chainTechnology === EChainTechnology.EVM) {
          acc.push(chain.chainId);
        }
        return acc;
      },
      [] as ChainId[],
    );
    return {
      chains: supportedChains,
      accounts: (linkedAccounts || ([] as LinkedAccount[]))
        .filter((account) => account.sourceChain === EChain.EthereumMainnet)
        .map((account) => account.sourceAccountAddress),
    };
  }, [linkedAccounts]);

  if (!(linkedAccounts.length > 0)) {
    return <UnauthScreen />;
  }
  return (
    <>
      {transactions && (
        <>
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
            <Card
              children={
                <Table
                  defaultItemsPerPage={10}
                  columns={columns}
                  data={transactionsToRender}
                />
              }
            />
          )}
        </>
      )}
    </>
  );
};

export default Transactions;
