import { EWalletDataType } from "@snickerdoodlelabs/objects";

export const permissions = [
  {
    description: `On-chain transaction history, such as the kinds of dApps you've used in the past and how often you use them`,
    key: EWalletDataType.EVMTransactions,
    name: "Transaction History",
  },
  {
    description: "Fungible tokens you own across different blockchain networks",
    key: EWalletDataType.AccountBalances,
    name: "Token Balances",
  },
  {
    description:
      "NFT projects you interact with and/or currently own accross different blockchain networks",
    key: EWalletDataType.AccountNFTs,
    name: "NFTs",
  },
];

export const PROD_DATA_WALLET_URL = "https://datawallet.snickerdoodle.com/";
