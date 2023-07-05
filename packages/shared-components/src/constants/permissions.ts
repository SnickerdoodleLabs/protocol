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

export const PERMISSIONS_WITH_ICONS: Partial<
  Record<
    EWalletDataType,
    { name: string; icon: string; dataType: EWalletDataType }
  >
> = {
  [EWalletDataType.Gender]: {
    name: PERMISSION_NAMES[EWalletDataType.Gender],
    icon: "https://storage.googleapis.com/dw-assets/shared/icons/gender.png",
    dataType: EWalletDataType.Gender,
  },
  [EWalletDataType.Age]: {
    name: PERMISSION_NAMES[EWalletDataType.Age],
    icon: "https://storage.googleapis.com/dw-assets/shared/icons/dob.png",
    dataType: EWalletDataType.Age,
  },
  [EWalletDataType.Location]: {
    name: PERMISSION_NAMES[EWalletDataType.Location],
    icon: "https://storage.googleapis.com/dw-assets/shared/icons/country.png",
    dataType: EWalletDataType.Location,
  },
  [EWalletDataType.SiteVisits]: {
    name: PERMISSION_NAMES[EWalletDataType.SiteVisits],
    icon: "https://storage.googleapis.com/dw-assets/shared/icons/browser-history.png",
    dataType: EWalletDataType.SiteVisits,
  },
  [EWalletDataType.EVMTransactions]: {
    name: PERMISSION_NAMES[EWalletDataType.EVMTransactions],
    icon: "https://storage.googleapis.com/dw-assets/shared/icons/transactions.png",
    dataType: EWalletDataType.EVMTransactions,
  },
  [EWalletDataType.AccountBalances]: {
    name: PERMISSION_NAMES[EWalletDataType.AccountBalances],
    icon: "https://storage.googleapis.com/dw-assets/shared/icons/tokens.png",
    dataType: EWalletDataType.AccountBalances,
  },
  [EWalletDataType.AccountNFTs]: {
    name: PERMISSION_NAMES[EWalletDataType.AccountNFTs],
    icon: "https://storage.googleapis.com/dw-assets/shared/icons/nft.png",
    dataType: EWalletDataType.AccountNFTs,
  },
  [EWalletDataType.Discord]: {
    name: PERMISSION_NAMES[EWalletDataType.Discord],
    icon: "https://storage.googleapis.com/dw-assets/shared/icons/discord.png",
    dataType: EWalletDataType.Discord,
  },
  [EWalletDataType.Twitter]: {
    name: PERMISSION_NAMES[EWalletDataType.Twitter],
    icon: "https://storage.googleapis.com/dw-assets/shared/icons/twitter.svg",
    dataType: EWalletDataType.Twitter,
  }
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