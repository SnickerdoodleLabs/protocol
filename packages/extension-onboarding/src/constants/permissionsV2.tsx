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
  // [EWalletDataType.LatestBlockNumber]: "Latest Block Number",
};

interface IPermissionItem {
  key: EWalletDataType;
  name: string;
  description: string;
}

export const PERMS: IPermissionItem[] = [
  {
    key: EWalletDataType.EVMTransactions,
    name: "Transaction History",
    description:
      "Share high-level information about your wallet transaction statistics. No one will ever see your actual wallet address or transaction hashes.",
  },
  {
    key: EWalletDataType.AccountBalances,
    name: "Token Balances",
    description:
      "Share aggregate token holding information. No one will ever see exact token balances or wallet addresses.",
  },
  {
    key: EWalletDataType.AccountNFTs,
    name: "NFTs",
    description:
      "Share aggregate NFT ownership information. No one will ever see your token ids or wallet addresses.",
  },
  {
    key: EWalletDataType.Age,
    name: "Age Range",
    description:
      "Share high level age range information. No one will ever see your actual birth date.",
  },
  {
    key: EWalletDataType.Gender,
    name: "Gender",
    description:
      "This refers to your gender, with options for male, female, non-binary, and unspecified.",
  },
  {
    key: EWalletDataType.SiteVisits,
    name: "Browser History",
    description:
      "Web navigation history recorded while your Snickerdoodle extension is active",
  },
  {
    key: EWalletDataType.Location,
    name: "Country",
    description:
      "Share high-level country code. No one will ever know your exact location.",
  },
  {
    key: EWalletDataType.Discord,
    name: "Discord",
    description:
      "Share what kinds of Discord channels you are subscribed to. No one will ever know your discord handle.",
  },
];
