import {
  AccountAddress,
  DataWalletAddress,
  EChain,
  TokenBalance,
  IAccountNFT,
  LanguageCode,
  LinkedAccount,
  Signature,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { SnickerDoodleCoreError } from "@shared/objects/errors";

export interface IAccountService {
  addAccount(
    account: AccountAddress,
    signature: Signature,
    chain: EChain,
    languageCode: LanguageCode,
  ): ResultAsync<void, SnickerDoodleCoreError>;
  unlock(
    account: AccountAddress,
    signature: Signature,
    chain: EChain,
    languageCode: LanguageCode,
    calledWithCookie?: boolean,
  ): ResultAsync<void, SnickerDoodleCoreError>;
  getUnlockMessage(
    languageCode: LanguageCode,
  ): ResultAsync<string, SnickerDoodleCoreError>;
  getAccounts(): ResultAsync<LinkedAccount[], SnickerDoodleCoreError>;
  getAccountBalances(): ResultAsync<TokenBalance[], SnickerDoodleCoreError>;
  getAccountNFTs(): ResultAsync<IAccountNFT[], SnickerDoodleCoreError>;
  isDataWalletAddressInitialized(): ResultAsync<boolean, never>;
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
}

export const IAccountServiceType = Symbol.for("IAccountService");
