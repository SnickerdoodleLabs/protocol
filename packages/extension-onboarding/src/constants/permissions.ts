import { EWalletDataType } from "@snickerdoodlelabs/objects";

export const PERMISSION_NAMES = {
  [EWalletDataType.Gender]: "Gender",
  [EWalletDataType.Birthday]: "Birthday",
  [EWalletDataType.Location]: "Location",
  [EWalletDataType.SiteVisits]: "Sites Visited",
  [EWalletDataType.EVMTransactions]: "Transaction History",
  [EWalletDataType.AccountBalances]: "Token Balances",
  [EWalletDataType.AccountNFTs]: "NFTs",
  // [EWalletDataType.LatestBlockNumber]: "Latest Block Number",
};

export const PERMISSIONS = [
  {
    title: "Web2 Data",
    dataTypes: [
      EWalletDataType.Gender,
      EWalletDataType.Birthday,
      EWalletDataType.Location,
      EWalletDataType.SiteVisits,
    ],
  },
  {
    title: "Web3 Data",
    dataTypes: [
      EWalletDataType.EVMTransactions,
      EWalletDataType.AccountBalances,
      EWalletDataType.AccountNFTs,
      // EWalletDataType.LatestBlockNumber,
    ],
  },
];

export const PERMISSION_DESCRIPTIONS = {
  [EWalletDataType.Location]:
    "Refers to location data you filled in, yourself or with google, while creating your data wallet",
  [EWalletDataType.SiteVisits]:
    "Web navigation history recorded while your Snickerdoodle extension is active",
  [EWalletDataType.EVMTransactions]:
    "Consent to share insights about your on-chain transaction history, such as what kinds of Dapps you've used in the past and how often you use them.",
  [EWalletDataType.AccountBalances]:
    "Provide aggregate, anonymized insights regarding the kinds of fungible tokens you own across different blockchain networks.",
  [EWalletDataType.AccountNFTs]:
    "Share anonymized insights about the kinds of NFT projects you interact with and currently own accross different blockchain networks.",
};
