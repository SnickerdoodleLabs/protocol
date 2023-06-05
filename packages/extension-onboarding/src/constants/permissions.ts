import { EWalletDataType } from "@snickerdoodlelabs/objects";

export const UI_SUPPORTED_PERMISSIONS = [
  EWalletDataType.Gender,
  EWalletDataType.Age,
  EWalletDataType.Location,
  EWalletDataType.SiteVisits,
  EWalletDataType.EVMTransactions,
  EWalletDataType.AccountBalances,
  EWalletDataType.AccountNFTs,
  EWalletDataType.Discord,
  EWalletDataType.Twitter
];

export const PERMISSION_NAMES = {
  [EWalletDataType.Gender]: "Gender",
  [EWalletDataType.Age]: "Birthday",
  [EWalletDataType.Location]: "Country",
  [EWalletDataType.SiteVisits]: "Browser History",
  [EWalletDataType.EVMTransactions]: "Transaction History",
  [EWalletDataType.AccountBalances]: "Token Balances",
  [EWalletDataType.AccountNFTs]: "NFTs",
  [EWalletDataType.Discord]: "Discord",
  [EWalletDataType.Twitter]: "Twitter",
  // [EWalletDataType.LatestBlockNumber]: "Latest Block Number",
};

export const PERMISSION_TEXT_NAMES = {
  [EWalletDataType.Gender]: "gender",
  [EWalletDataType.Age]: "birthday",
  [EWalletDataType.Location]: "country",
  [EWalletDataType.SiteVisits]: "browser history",
  [EWalletDataType.EVMTransactions]: "transaction history",
  [EWalletDataType.AccountBalances]: "token balances",
  [EWalletDataType.AccountNFTs]: "NFTs",
  // [EWalletDataType.LatestBlockNumber]: "Latest Block Number",
};

export const PERMISSIONS = [
  {
    title: "Personal Info",
    dataTypes: [
      EWalletDataType.Gender,
      EWalletDataType.Age,
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
    dataTypes: [EWalletDataType.Discord , EWalletDataType.Twitter],
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
  [EWalletDataType.Twitter]:
    "Name,  User Name, User ID, Followers, Following information",
};