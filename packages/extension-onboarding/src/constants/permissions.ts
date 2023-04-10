import { EWalletDataType } from "@snickerdoodlelabs/objects";

export const PERMISSION_NAMES = {
  [EWalletDataType.Gender]: "Gender",
  [EWalletDataType.Birthday]: "Birthday",
  [EWalletDataType.Location]: "Location",
  [EWalletDataType.SiteVisits]: "Sites Visited",
  [EWalletDataType.EVMTransactions]: "Transaction History",
  [EWalletDataType.AccountBalances]: "Token Balances",
  [EWalletDataType.AccountNFTs]: "NFTs",
  [EWalletDataType.Discord]: "Discord",
  // [EWalletDataType.LatestBlockNumber]: "Latest Block Number",
};

export const PERMISSIONS = [
  {
    title: "Personal Info",
    dataTypes: [
      EWalletDataType.Gender,
      EWalletDataType.Birthday,
      EWalletDataType.Location,
      EWalletDataType.SiteVisits,
    ],
  },
  {
    title: "Crypto Accounts",
    dataTypes: [
      EWalletDataType.EVMTransactions,
      EWalletDataType.AccountBalances,
      EWalletDataType.AccountNFTs,
      // EWalletDataType.LatestBlockNumber,
    ],
  },
  {
    title: "Social Data",
    dataTypes: [EWalletDataType.Discord],
  },
];

export const PERMISSION_DESCRIPTIONS = {
  [EWalletDataType.Location]:
    "Refers to location data you filled in, yourself or with google, while creating your data wallet",
  [EWalletDataType.SiteVisits]:
    "Web navigation history recorded while your Snickerdoodle extension is active",
  [EWalletDataType.EVMTransactions]:
    "On-chain transaction history, such as the kinds of Dapps you've used in the past and how often you use them",
  [EWalletDataType.AccountBalances]:
    "Fungible tokens you own across different blockchain networks",
  [EWalletDataType.AccountNFTs]:
    "NFT projects you interact with and/or currently own accross different blockchain networks",
  [EWalletDataType.Discord]:
    "Server name,  server icon, server ownership information",
};
