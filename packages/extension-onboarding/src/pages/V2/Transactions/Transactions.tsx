import UnauthScreen from "@extension-onboarding/components/v2/UnauthScreen";
import { useAppContext } from "@extension-onboarding/context/App";
import { useDataWalletContext } from "@extension-onboarding/context/DataWalletContext";
import EVMTxnTable from "@extension-onboarding/pages/V2/Transactions/EVMTxnTable";
import SuiTxnTable from "@extension-onboarding/pages/V2/Transactions/SuiTxnTable";
import { Box } from "@material-ui/core";
import {
  EChainTechnology,
  EVMTransaction,
  SolanaTransaction,
  SuiTransaction,
  getChainInfoByChain,
} from "@snickerdoodlelabs/objects";
import React, { useEffect, useState } from "react";
interface ITransactionsState {
  solanaTransactions: SolanaTransaction[];
  evmTransactions: EVMTransaction[];
  suiTransactions: SuiTransaction[];
}

const Transactions = () => {
  const { sdlDataWallet } = useDataWalletContext();
  const { linkedAccounts } = useAppContext();
  const [transactions, setTransactions] = useState<ITransactionsState>();

  useEffect(() => {
    getTransactions();
  }, []);
  const getTransactions = () => {
    sdlDataWallet
      .getTransactions()
      .map((_transactions) => {
        setTransactions({
          solanaTransactions: _transactions.filter(
            (txn) =>
              getChainInfoByChain(txn.chain).chainTechnology ===
              EChainTechnology.Solana,
          ) as SolanaTransaction[],
          evmTransactions: _transactions.filter(
            (txn) =>
              getChainInfoByChain(txn.chain).chainTechnology ===
              EChainTechnology.EVM,
          ) as EVMTransaction[],
          suiTransactions: _transactions.filter(
            (txn) =>
              getChainInfoByChain(txn.chain).chainTechnology ===
              EChainTechnology.Sui,
          ) as SuiTransaction[],
        });
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
      <EVMTxnTable transactions={transactions?.evmTransactions} />
      <Box mt={3} />
      <SuiTxnTable transactions={transactions?.suiTransactions} />
    </>
  );
};

export default Transactions;
