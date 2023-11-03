export enum EPaths {
  ONBOARDING = "/onboarding",
  ONBOARDING_LINK_ACCOUNT = "/onboarding/link-account",
  ONBOARDING_BUILD_PROFILE = "/onboarding/build-profile",
  // ONBOARDING_OPT_IN = "/onboarding/opt-in",
  // ONBOARDING_PERMISSION_SELECTION = "/onboarding/permission-selection",
  ONBOARDING_TAG_SELECTION = "/onboarding/tag-selection",
  HOME = "/",
  CAMPAIGNS = "/campaigns",
  // MY_REWARDS = "/my-rewards",

  MARKETPLACE = "/marketplace",
  MARKETPLACE_CAMPAIGN_DETAIL = "/marketplace/reward-program-detail",
  MARKETPLACE_REWARD_DETAIL = "/marketplace/reward-program-detail/reward-detail",
  MARKETPLACE_TAG_DETAIL = "/marketplace/:tag",
  MARKETPLACE_CAMPAIGN_DETAIL_WITH_TAG = "/marketplace/:tag/reward-program-detail",
  MARKETPLACE_REWARD_DETAIL_WITH_TAG = "/marketplace/:tag/reward-program-detail/reward-detail",

  // MARKETPLACE_CAMPAIGNS = "/campaigns/marketplace",
  // MARKETPLACE_COLLECTION = "/rewards/marketplace/:brand",
  // MARKETPLACE_REWARD = "/rewards/marketplace/reward",
  SETTINGS = "/settings",
  WEB3_SETTINGS = "/settings/web3",
  WEB2_SETTINGS = "/settings/web2",
  REWARDS_SUBSCRIPTIONS = "/settings/rewards-subscriptions",
  REWARDS_SUBSCRIPTION_DETAIL = "/settings/rewards-subscriptions/reward-program-detail",
  REWARDS_SUBSCRIPTION_REWARD_DETAIL = "/settings/rewards-subscriptions/reward-program-detail/reward-detail",
  STORAGE_SETTINGS = "/settings/storage",
  // DATA_PERMISSIONS_SETTING = "/settings/data-permissions",
  TRANSACTION_HISTORY = "/data-dashboard/transaction-history",
  TOKENS = "/data-dashboard/tokens",
  NFTS = "/data-dashboard/nfts",
  POAP_NFTS = "/data-dashboard/poap-nfts",
  BROWSER_ACTIVITY = "/data-dashboard/browser-activity",
  SOCIAL_MEDIA_DATA = "/data-dashboard/social-media-data",
  // PERSONAL_INFO = "/data-dashboard/personal-info",
  SHOPPING_DATA = "/data-dashboard/shopping-data",
  NFT_DETAIL = "/data-dashboard/nfts/detail",
}
