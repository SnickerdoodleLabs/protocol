export enum EInternalActions {
  UNLOCK = "UNLOCK",
  GET_STATE = "GET_INTERNAL_STATE",
  GET_UNLOCK_MESSAGE = "GET_UNLOCK_MESSAGE",
  ADD_ACCOUNT = "ADD_ACCOUNT",
  GET_ACCOUNT_BALANCES = "GET_ACCOUNT_BALANCES",
  GET_ACCOUNT_NFTS = "GET_ACCOUNT_NFTS",
  GET_ACCOUNTS = "GET_ACCOUNTS",
  IS_DATA_WALLET_ADDRESS_INITIALIZED = "IS_DATA_WALLET_ADDRESS_INITIALIZED",
  GET_AGE = "GET_AGE",
  GET_GIVEN_NAME = "GET_GIVEN_NAME",
  GET_FAMILY_NAME = "GET_FAMILY_NAME",
  GET_EMAIL = "GET_EMAIL",
}

export enum EExternalActions {
  UNLOCK = "UNLOCK",
  GET_DATA_WALLET_ADDRESS = "GET_DATA_WALLET_ADDRESS",
  GET_UNLOCK_MESSAGE = "GET_UNLOCK_MESSAGE",
  GET_STATE = "GET_EXTERNAL_STATE",
  ADD_ACCOUNT = "ADD_ACCOUNT",
  SET_AGE = "SET_AGE",
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
  GET_ACCOUNT_BALANCES = "GET_ACCOUNT_BALANCES",
  GET_ACCOUNT_NFTS = "GET_ACCOUNT_NFTS",
  GET_ACCOUNTS = "GET_ACCOUNTS",
  GET_COHORT_INVITATION_WITH_DOMAIN = "GET_COHORT_INVITATION_WITH_DOMAIN",
  ACCEPT_INVITATION = "ACCEPT_INVITATION",
  ACCEPT_PUBLIC_INVITIATION_BY_CONSENT_CONTRACT_ADDRESS = "ACCEPT_PUBLIC_INVITIATION_BY_CONSENT_CONTRACT_ADDRESS",
  METATRANSACTION_SIGNATURE_REQUEST_CALLBACK = "METATRANSACTION_SIGNATURE_REQUEST_CALLBACK",
  REJECT_INVITATION = "REJECT_INVITATION",
  IS_DATA_WALLET_ADDRESS_INITIALIZED = "IS_DATA_WALLET_ADDRESS_INITIALIZED",
  CLOSE_TAB = "CLOSE_TAB",
  GET_DEFAULT_PERMISSIONS = "GET_DEFAULT_PERMISSIONS",
  SET_DEFAULT_PERMISSIONS = "SET_DEFAULT_PERMISSIONS",
  SET_DEFAULT_PERMISSIONS_TO_ALL = "SET_DEFAULT_PERMISSIONS_TO_ALL",
  GET_AGREEMENT_PERMISSIONS = "GET_AGREEMENT_PERMISSIONS",
  GET_ACCEPTED_INVITATIONS_CID = "GET_ACCEPTED_INVITATIONS_CID",
  GET_AVAILABLE_INVITATIONS_CID = "GET_AVAILABLE_INVITATIONS_CID",
  GET_INVITATION_METADATA_BY_CID = "GET_INVITATION_METADATA_BY_CID",
  LEAVE_COHORT = "LEAVE_COHORT",
  CHECK_URL = "CHECK_URL",
}
