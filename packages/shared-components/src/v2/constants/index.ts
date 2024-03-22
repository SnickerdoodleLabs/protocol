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

enum EWalletDataTypeGroup {
  SOCIAL,
  WALLET,
  PERSONAL,
  BROWSER_ACTIVITY,
}

export const DataTypeGroupProperties = {
  [EWalletDataTypeGroup.SOCIAL]: {
    name: "Social",
    order: 1,
  },
  [EWalletDataTypeGroup.WALLET]: {
    name: "Wallet",
    order: 0,
  },
  [EWalletDataTypeGroup.PERSONAL]: {
    name: "Personal Information",
    order: 2,
  },
  [EWalletDataTypeGroup.BROWSER_ACTIVITY]: {
    name: "Browser Activity",
    order: 3,
  },
};

interface IDataPermissionScheme {
  key: EWalletDataType;
  name: string;
  groupKey: EWalletDataTypeGroup;
  icon: string;
}

export const uiSupportedPermissions: IDataPermissionScheme[] = [
  {
    key: EWalletDataType.Discord,
    name: "Discord",
    groupKey: EWalletDataTypeGroup.SOCIAL,
    icon: "https://storage.googleapis.com/dw-assets/shared/icons-v2/discord.png",
  },
  {
    key: EWalletDataType.AccountNFTs,
    name: "NFTs",
    groupKey: EWalletDataTypeGroup.WALLET,
    icon: "https://storage.googleapis.com/dw-assets/shared/icons-v2/nfts.svg",
  },
  {
    key: EWalletDataType.AccountBalances,
    name: "Token Balance",
    groupKey: EWalletDataTypeGroup.WALLET,
    icon: "https://storage.googleapis.com/dw-assets/shared/icons-v2/token-balance.svg",
  },
  // not confirmed but not icons provided
  {
    key: EWalletDataType.AccountSize,
    name: "Account Count",
    groupKey: EWalletDataTypeGroup.WALLET,
    // placeholder for now
    icon: "https://storage.googleapis.com/dw-assets/shared/icons/eth.png",
  },
  {
    key: EWalletDataType.EVMTransactions,
    name: "Transaction History",
    groupKey: EWalletDataTypeGroup.WALLET,
    icon: "https://storage.googleapis.com/dw-assets/shared/icons/transactions.png",
  },
  {
    key: EWalletDataType.Gender,
    name: "Gender",
    groupKey: EWalletDataTypeGroup.PERSONAL,
    icon: "https://storage.googleapis.com/dw-assets/shared/icons/gender.png",
  },
  {
    key: EWalletDataType.Age,
    name: "Age",
    groupKey: EWalletDataTypeGroup.PERSONAL,
    icon: "https://storage.googleapis.com/dw-assets/shared/icons/dob.png",
  },
  {
    key: EWalletDataType.Location,
    name: "Location",
    groupKey: EWalletDataTypeGroup.PERSONAL,
    icon: "https://storage.googleapis.com/dw-assets/shared/icons/country.png",
  },
  {
    key: EWalletDataType.SiteVisits,
    name: "Browser History",
    groupKey: EWalletDataTypeGroup.BROWSER_ACTIVITY,
    icon: "https://storage.googleapis.com/dw-assets/shared/icons/browser-history.png",
  },
];

export const ffSupportedPermissions = uiSupportedPermissions.map((p) => p.key);

export const getGroupedDataPermissions = (dataTypes: EWalletDataType[]) => {
  return dataTypes.reduce((acc, type) => {
    const permission = uiSupportedPermissions.find(
      (permission) => permission.key === type,
    );
    if (permission) {
      if (!acc[permission.groupKey]) {
        acc[permission.groupKey] = [] as IDataPermissionScheme[];
      }
      acc[permission.groupKey].push(permission);
    }
    return acc;
  }, {} as Record<EWalletDataTypeGroup, IDataPermissionScheme[]>);
};

export const getGroupedDataTypesG = <T extends { dataType: EWalletDataType }>(
  items: T[],
) => {
  return items.reduce((acc, item) => {
    const permission = uiSupportedPermissions.find(
      (permission) => permission.key === item.dataType,
    );
    if (permission) {
      if (!acc[permission.groupKey]) {
        acc[permission.groupKey] = [];
      }
      acc[permission.groupKey].push({ permission, ...item });
    }
    return acc;
  }, {} as Record<EWalletDataTypeGroup, (T & { permission: IDataPermissionScheme })[]>);
};

export const getDataTypeProperties = (dataType: EWalletDataType) => {
  return uiSupportedPermissions.find((p) => p.key === dataType);
};
