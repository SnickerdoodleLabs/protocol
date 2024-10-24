import {
  AccountAddress,
  DataWalletAddress,
  EarnedReward,
  EChain,
  WalletNFT,
  LanguageCode,
  LinkedAccount,
  Signature,
  TokenBalance,
  UnauthorizedError,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { SnickerDoodleCoreError } from "../objects/errors/SnickerDoodleCoreError";

export interface IAccountService {
  addAccount(
    account: AccountAddress,
    signature: Signature,
    languageCode: LanguageCode,
    chain: EChain,
  ): ResultAsync<void, SnickerDoodleCoreError>;
  getLinkAccountMessage(
    languageCode: LanguageCode,
  ): ResultAsync<string, SnickerDoodleCoreError>;
  getAccounts(): ResultAsync<LinkedAccount[], SnickerDoodleCoreError>;
  getAccountBalances(): ResultAsync<TokenBalance[], SnickerDoodleCoreError>;

  isDataWalletAddressInitialized(): ResultAsync<boolean, UnauthorizedError>;
  unlinkAccount(
    account: AccountAddress,
    signature: Signature,
    chain: EChain,
    languageCode: LanguageCode,
  ): ResultAsync<void, SnickerDoodleCoreError>;
  getDataWalletForAccount(
    accountAddress: AccountAddress,
    signature: Signature,
    languageCode: LanguageCode,
    chain: EChain,
  ): ResultAsync<DataWalletAddress | null, SnickerDoodleCoreError>;
  getEarnedRewards(): ResultAsync<EarnedReward[], SnickerDoodleCoreError>;
}

export const IAccountServiceType = Symbol.for("IAccountService");
