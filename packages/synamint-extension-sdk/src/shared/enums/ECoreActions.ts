export enum ECoreActions {
  UNLOCK = "UNLOCK",
  GET_DATA_WALLET_ADDRESS = "GET_DATA_WALLET_ADDRESS",
  GET_UNLOCK_MESSAGE = "GET_UNLOCK_MESSAGE",
  GET_STATE = "GET_EXTERNAL_STATE",
  GET_INTERNAL_STATE = "GET_INTERNAL_STATE",
  ADD_ACCOUNT = "ADD_ACCOUNT",
  ADD_ACCOUNT_WITH_EXTERNAL_SIGNATURE = "ADD_ACCOUNT_WITH_EXTERNAL_SIGNATURE",
  ADD_ACCOUNT_WITH_EXTERNAL_TYPED_DATA_SIGNATURE = "ADD_ACCOUNT_WITH_EXTERNAL_TYPED_DATA_SIGNATURE",
  GET_AGE = "GET_AGE",
  SET_GIVEN_NAME = "SET_GIVEN_NAME",
  GET_GIVEN_NAME = "GET_GIVEN_NAME",
  SET_FAMILY_NAME = "SET_FAMILY_NAME",
  GET_FAMILY_NAME = "GET_FAMILY_NAME",
  SET_BIRTHDAY = "SET_BIRTHDAY",
  GET_BIRTHDAY = "GET_BIRTHDAY",
  SET_GENDER = "SET_GENDER",
  GET_GENDER = "GET_GENDER",
  SET_EMAIL = "SET_EMAIL",
  GET_EMAIL = "GET_EMAIL",
  SET_LOCATION = "SET_LOCATION",
  GET_LOCATION = "GET_LOCATION",
  GET_TOKEN_PRICE = "GET_TOKEN_PRICE",
  GET_TOKEN_INFO = "GET_TOKEN_INFO",
  GET_TOKEN_MARKET_DATA = "GET_TOKEN_MARKET_DATA",
  GET_ACCOUNT_BALANCES = "GET_ACCOUNT_BALANCES",

  GET_ACCOUNT_NFTS = "GET_ACCOUNT_NFTS",
  GET_ACCOUNT_PERSISTENCE_NFTS = "GET_ACCOUNT_PERSISTENCE_NFTS",
  GET_ACCOUNT_NFT_HISTORY = "GET_ACCOUNT_NFT_HISTORY",
  GET_ACCOUNT_NFT_CACHE = "GET_ACCOUNT_NFT_CACHE",

  GET_ACCOUNTS = "GET_ACCOUNTS",
  UNLINK_ACCOUNT = "UNLINK_ACCOUNT",
  GET_COHORT_INVITATION_WITH_DOMAIN = "GET_COHORT_INVITATION_WITH_DOMAIN",
  UPDATE_AGREEMENT_PERMISSIONS = "UPDATE_AGREEMENT_PERMISSIONS",
  ACCEPT_INVITATION = "ACCEPT_INVITATION",
  REJECT_INVITATION = "REJECT_INVITATION",
  IS_DATA_WALLET_ADDRESS_INITIALIZED = "IS_DATA_WALLET_ADDRESS_INITIALIZED",
  GET_AGREEMENT_PERMISSIONS = "GET_AGREEMENT_PERMISSIONS",
  GET_ACCEPTED_INVITATIONS_CID = "GET_ACCEPTED_INVITATIONS_CID",
  GET_AVAILABLE_INVITATIONS_CID = "GET_AVAILABLE_INVITATIONS_CID",
  GET_INVITATION_METADATA_BY_CID = "GET_INVITATION_METADATA_BY_CID",
  LEAVE_COHORT = "LEAVE_COHORT",
  GET_CONTRACT_CID = "GET_CONTRACT_CID",
  CHECK_INVITATION_STATUS = "CHECK_INVITATION_STATUS",
  GET_EARNED_REWARDS = "GET_EARNED_REWARDS",
  GET_SITE_VISITS = "GET_SITE_VISITS",
  GET_SITE_VISITS_MAP = "GET_SITE_VISITS_MAP",
  GET_MARKETPLACE_LISTINGS_BY_TAG = "GET_MARKETPLACE_LISTINGS_BY_TAG",
  GET_LISTING_TOTAL_BY_TAG = "GET_LISTING_TOTAL_BY_TAG",
  SET_DEFAULT_RECEIVING_ACCOUNT = "SET_DEFAULT_RECEIVING_ACCOUNT",
  SET_RECEIVING_ACCOUNT = "SET_RECEIVING_ACCOUNT",
  GET_RECEIVING_ACCOUNT = "GET_RECEIVING_ACCOUNT",
  GET_CONSENT_CAPACITY = "GET_CONSENT_CAPACITY",
  GET_CONSENT_CONTRACT_URLS = "GET_CONSENT_CONTRACT_URLS",
  GET_EARNED_REWARDS_BY_CONTRACT_ADDRESS = "GET_EARNED_REWARDS_BY_CONTRACT_ADDRESS",
  INITIALIZE_DISCORD_USER = "INITIALIZE_DISCORD_USER",
  INSTALLATION_DISCORD_URL = "INSTALLATION_DISCORD_URL",
  GET_DISCORD_USER_PROFILES = "GET_DISCORD_USER_PROFILES",
  GET_DISCORD_GUILD_PROFILES = "GET_DISCORD_GUILD_PROFILES",
  UNLINK_DISCORD_ACCOUNT = "UNLINK_DISCORD_ACCOUNT",
  GET_CONFIG = "GET_CONFIG",
  METRICS_GET_METRICS = "METRICS_GET_METRICS",
  GET_QUERY_STATUS_BY_CID = "GET_QUERY_STATUS_BY_CID",
  GET_QUERY_STATUSES = "GET_QUERY_STATUSES",
  GET_TRANSACTION_VALUE_BY_CHAIN = "GET_TRANSACTION_VALUE_BY_CHAIN",
  GET_TRANSACTIONS = "GET_TRANSACTIONS",

  TWITTER_GET_REQUEST_TOKEN = "TWITTER_GET_REQUEST_TOKEN",
  TWITTER_LINK_PROFILE = "TWITTER_LINK_PROFILE",
  TWITTER_UNLINK_PROFILE = "TWITTER_UNLINK_PROFILE",
  TWITTER_GET_LINKED_PROFILES = "TWITTER_GET_LINKED_PROFILES",

  REQUEST_PERMISSIONS = "REQUEST_PERMISSIONS",
  GET_PERMISSIONS = "GET_PERMISSIONS",
  GET_TOKEN_VERIFICATION_PUBLIC_KEY = "GET_TOKEN_VERIFICATION_PUBLIC_KEY",
  GET_BEARER_TOKEN = "GET_BEARER_TOKEN",
  GET_DROPBOX_AUTH_URL = "GET_DROPBOX_AUTH_URL",
  AUTHENTICATE_DROPBOX = "AUTHENTICATE_DROPBOX",
  SET_AUTHENTICATED_STORAGE = "SET_AUTHENTICATED_STORAGE",

  // Questionnaire
  GET_ALL_QUESTIONNAIRES = "GET_ALL_QUESTIONNAIRES",
  GET_QUESTIONNAIRES = "GET_QUESTIONNAIRES",
  ANSWER_QUESTIONNAIRE = "ANSWER_QUESTIONNAIRE",
  GET_QUESTIONNAIRES_FOR_CONSENT_CONTRACT = "GET_QUESTIONNAIRES_FOR_CONSENT_CONTRACT",
  GET_CONSENT_CONTRACTS_BY_QUESTIONNAIRE_CID = "GET_CONSENT_CONTRACTS_BY_QUESTIONNAIRE_CID",
  GET_RECOMMENDED_CONSENT_CONTRACTS = "GET_RECOMMENDED_CONSENT_CONTRACTS",

  // TODO core proxy functions
  GET_AVAILABLE_CLOUD_STORAGE_OPTIONS = "GET_AVAILABLE_CLOUD_STORAGE_OPTIONS",
  GET_CURRENT_STORAGE_TYPE = "GET_CURRENT_STORAGE_TYPE",

  // External local storage calls
  SET_UI_STATE = "SET_UI_STATE",
  GET_UI_STATE = "GET_UI_STATE",
}
