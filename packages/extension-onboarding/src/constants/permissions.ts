import { EWalletDataType } from "@snickerdoodlelabs/objects";

export const PERMISSION_NAMES = {
  [EWalletDataType.Gender]: "Gender",
  [EWalletDataType.Birthday]: "Birthday",
  [EWalletDataType.Location]: "Location",
  [EWalletDataType.SiteVisits]: "Site Visits",
  [EWalletDataType.EVMTransactions]: "EVM Transactions",
  [EWalletDataType.AccountBalances]: "AccountBalance",
  [EWalletDataType.AccountNFTs]: "Account NFTs",
  [EWalletDataType.LatestBlockNumber]: "Latest Block Number",
};

export const PERMISSIONS = [
  {
    title: "Demographic Info",
    dataTypes: [
      EWalletDataType.Gender,
      EWalletDataType.Birthday,
      EWalletDataType.Location,
    ],
  },
  {
    title: "On-Chain Info",
    dataTypes: [
      EWalletDataType.SiteVisits,
      EWalletDataType.EVMTransactions,
      EWalletDataType.AccountBalances,
      EWalletDataType.AccountNFTs,
      EWalletDataType.LatestBlockNumber,
    ],
  },
];
