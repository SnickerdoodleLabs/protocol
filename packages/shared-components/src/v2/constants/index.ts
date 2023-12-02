import { EWalletDataType } from "@snickerdoodlelabs/objects";

export const FF_SUPPORTED_PERMISSIONS: {
  description: string;
  key: EWalletDataType | EWalletDataType[];
  name: string;
}[] = [
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
  {
    description:
      "Share high-level demographic information like age range, gender, and current country you are located in. No one will ever know specifics about where you are or your birthdate",
    key: [
      EWalletDataType.Gender,
      EWalletDataType.Age,
      EWalletDataType.Location,
    ],
    name: "Demographics",
  },
  {
    name: "Browser History",
    description:
      "Basic browser history and time spent on pages you have visited",
    key: EWalletDataType.SiteVisits,
  },
  {
    name: "Social Media",
    description:
      "Discord Server Name, Joining/creation date, Server Icon, Ownership information",
    key: EWalletDataType.Discord,
  },
  {
    name: "Account Count",
    description:
      "The total count of blockchain accounts that have been successfully linked to your Data Wallet",
    key: EWalletDataType.AccountSize,
  },
];

export const FF_SUPPORTED_ALL_PERMISSIONS: EWalletDataType[] =
  FF_SUPPORTED_PERMISSIONS.map((item) => item.key).flat();

export const CONSENT_SETTINGS_PERMISSIONS: {
  key: EWalletDataType;
  name: string;
  description: string;
}[] = [
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
  {
    key: EWalletDataType.AccountSize,
    name: "Linked Accounts",
    description:
      "Share the number of the accounts you linked. No one will ever know your account addresses.",
  },
];

interface ITokenInfo {
  [tickerSymbol: string]: { displayName: string; iconSrc: string };
}

export const tokenInfoObj: ITokenInfo = {
  ETH: {
    displayName: "Ethereum",
    iconSrc: "https://storage.googleapis.com/dw-assets/shared/icons/eth.png",
  },
  AVAX: {
    displayName: "AVAX",
    iconSrc:
      "https://storage.googleapis.com/dw-assets/shared/icons/avax-circle.png",
  },
  USDC: {
    displayName: "USDC",
    iconSrc:
      "https://storage.googleapis.com/dw-assets/shared/icons/usdc-circle.png",
  },
  MATIC: {
    displayName: "MATIC",
    iconSrc:
      "https://storage.googleapis.com/dw-assets/shared/icons/polygon-circle.png",
  },
  SOL: {
    displayName: "Sol",
    iconSrc: "https://storage.googleapis.com/dw-assets/shared/icons/sol.png",
  },
  xDAI: {
    displayName: "xDAI",
    iconSrc:
      "https://storage.googleapis.com/dw-assets/shared/icons/xDAI-circle.png",
  },
  BNB: {
    displayName: "Binance",
    iconSrc:
      "https://storage.googleapis.com/dw-assets/shared/icons/bnb-circle.png",
  },
  GLMR: {
    displayName: "Moonbeam",
    iconSrc:
      "https://storage.googleapis.com/dw-assets/shared/icons/moonbeam-circle.png",
  },

  ARB: {
    displayName: "Arbitrum",
    iconSrc:
      "https://storage.googleapis.com/dw-assets/shared/icons/arbitrum-circle.png",
  },
  OP: {
    displayName: "Optimism",
    iconSrc:
      "https://storage.googleapis.com/dw-assets/shared/icons/optimism-circle.png",
  },
  ASTR: {
    displayName: "Astar",
    iconSrc:
      "https://storage.googleapis.com/dw-assets/shared/icons/astar-logo.png",
  },
  SUI: {
    displayName: "Sui",
    iconSrc: "https://storage.googleapis.com/dw-assets/shared/icons/sui.png",
  },
};
