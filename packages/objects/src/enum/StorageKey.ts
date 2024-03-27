export enum ERecordKey {
  ACCOUNT = "SD_Accounts",
  // Field name change required deleting the old object store and creating a new one with a corrected keypath.
  SITE_VISITS = "SD_SiteVisits_V2",
  TRANSACTIONS = "SD_Transactions",
  BALANCES = "SD_Balances",
  BALANCES_LAST_UPDATE = "SD_Balances_lastUpdate",
  NFTS = "SD_NFTs",
  NFTS_HISTORY = "SD_NFTS_HISTORY",
  URLs = "SD_URLs",
  CLICKS = "SD_CLICKS",
  // Field name change required deleting the old object store and creating a new one with a corrected keypath.
  EARNED_REWARDS = "SD_EarnedRewards_V2",
  COIN_INFO = "SD_CoinInfo",
  RESTORED_BACKUPS = "SD_RestoredBackups",
  ELIGIBLE_ADS = "SD_EligibleAds",
  AD_SIGNATURES = "SD_AdSignatures",
  RECEIVING_ADDRESSES = "SD_ReceivingAddresses",
  SOCIAL_PROFILE = "SD_SocialProfile",
  SOCIAL_GROUP = "SD_SocialGroup",
  QUERY_STATUS = "SD_QueryStatus",
  DOMAIN_CREDENTIALS = "SD_DomainCredentials",
  REJECTED_INVITATIONS = "SD_RejectedInvitations",
  OPTED_IN_INVITATIONS = "SD_OptedInInvitations",

  QUESTIONNAIRES = "SD_Questionnaires",
  QUESTIONNAIRES_HISTORY = "SD_Questionnaires_history",

  PERMISSIONS = "SD_Permissions",
}

export enum EFieldKey {
  AUTHENTICATED_STORAGE_SETTINGS = "SD_AuthenticatedStorageSettings",
  DATA_WALLET_PRIVATE_KEY = "SD_DataWalletPrivateKey",
  FIRST_NAME = "SD_GivenName",
  LAST_NAME = "SD_FamilyName",
  BIRTHDAY = "SD_Birthday",
  GENDER = "SD_Gender",
  EMAIL = "SD_Email",
  LOCATION = "SD_Location",
  DEFAULT_RECEIVING_ADDRESS = "SD_DefaultReceivingAddress",
  DOMAIN_PERMISSIONS = "SD_DomainPermissions",
}

export enum EExternalFieldKey {
  UI_STATE = "SD_UIState",
}

export type StorageKey = EFieldKey | ERecordKey;
