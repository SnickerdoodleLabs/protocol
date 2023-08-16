export enum ERecordKey {
  ACCOUNT = "SD_Accounts",
  SITE_VISITS = "SD_SiteVisits",
  TRANSACTIONS = "SD_Transactions",
  BALANCES = "SD_Balances",
  BALANCES_LAST_UPDATE = "SD_Balances_lastUpdate",
  NFTS = "SD_NFTs",
  NFTS_LAST_UPDATE = "SD_NFTs_lastUpdate",
  URLs = "SD_URLs",
  CLICKS = "SD_CLICKS",
  EARNED_REWARDS = "SD_EarnedRewards",
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
}

export enum EFieldKey {
  AUTHENTICATED_STORAGE_SETTINGS = "SD_AuthenticatedStorageSettings",
  FIRST_NAME = "SD_GivenName",
  LAST_NAME = "SD_FamilyName",
  BIRTHDAY = "SD_Birthday",
  GENDER = "SD_Gender",
  EMAIL = "SD_Email",
  LOCATION = "SD_Location",
  DEFAULT_RECEIVING_ADDRESS = "SD_DefaultReceivingAddress",
  // TODO: move these to records
  ACCEPTED_INVITATIONS = "SD_OptedInAccounts",
  REJECTED_COHORTS = "SD_RejectedCohorts",
  DOMAIN_PERMISSIONS = "SD_DomainPermissions",
}

export type StorageKey = EFieldKey | ERecordKey;
