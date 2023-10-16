import { EWalletDataType } from "@snickerdoodlelabs/objects";

export const FF_SUPPORTED_PERMISSIONS = [
  {
    description: `The on-chain activity of your connected digital, including what applications you use and how frequently you use them`,
    key: EWalletDataType.EVMTransactions,
    name: "Transaction History",
  },
  {
    description: "The fungible token balances in your connected digital wallet",
    key: EWalletDataType.AccountBalances,
    name: "Token Balances",
  },
  {
    description:
      "The non-fungible token collections in your connected digital wallet",
    key: EWalletDataType.AccountNFTs,
    name: "NFTs",
  },
];
