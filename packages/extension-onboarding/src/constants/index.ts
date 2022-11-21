export const ALERT_MESSAGES = {
  ACCOUNT_ADDED:
    "Your  account has successfully been linked. Let’s continue to link more accounts! The more wallets you connect, the more rewards you get!",
  PROFILE_FILLED_WITH_GOOGLE_DATA:
    "Your profile info has been auto-filled with your Google profile info.",
};

export enum EWalletProviderKeys {
  METAMASK = "metamask",
  PHANTOM = "phantom",
  WALLET_CONNECT = "walletConnect",
  COINBASE = "coinbase",
}

export const DOWNLOAD_URL =
  "https://chrome.google.com/webstore/detail/data-wallet/eakgkbblgjcanmmalnebjolplnlijmkc";

export const googleScopes =
  "profile email https://www.googleapis.com/auth/user.addresses.read https://www.googleapis.com/auth/user.birthday.read https://www.googleapis.com/auth/user.gender.read https://www.googleapis.com/auth/user.phonenumbers.read https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile";

export const LOCAL_STORAGE_SDL_INVITATION_KEY = "sdlInvitation";

export const PRIVACY_POLICY_URL =
  "https://policy.snickerdoodle.com/snickerdoodle-labs-data-privacy-policy";

export const ZENDEKS_URL =
  "https://data-wallet.zendesk.com/hc/en-us/requests/new";
