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
    name: "Social Media",
    description:
      "Discord Server Name, Joining/creation date, Server Icon, Ownership information",
    key: EWalletDataType.Discord,
  },
];

export const FF_SUPPORTED_ALL_PERMISSIONS: EWalletDataType[] =
  FF_SUPPORTED_PERMISSIONS.map((item) => item.key).flat();
