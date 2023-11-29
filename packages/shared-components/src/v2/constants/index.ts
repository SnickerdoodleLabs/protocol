import {
  EKnownDomains,
  EWalletDataType,
  URLString,
} from "@snickerdoodlelabs/objects";

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

export const SCRAPING_URLS: { key: EKnownDomains; url: URLString }[] = [
  {
    key: EKnownDomains.Amazon,
    url: URLString(
      "https://www.amazon.com/gp/css/order-history?ie=UTF8&ref_=nav_AccountFlyout_orders",
    ),
  },
];

export const SCRAPING_INDEX: Map<EKnownDomains, string> = new Map([
  [EKnownDomains.Amazon, "AmazonShoppingdataSDL"],
]);
