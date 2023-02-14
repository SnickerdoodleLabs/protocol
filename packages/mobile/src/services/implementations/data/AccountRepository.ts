import {
  AccountAddress,
  Signature,
  EChain,
  LanguageCode,
  LinkedAccount,
  TokenBalance,
  WalletNFT,
  DataWalletAddress,
  EarnedReward,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";
import { IAccountRepository } from "../../interfaces/data/IAccountRepository";
import { SnickerDoodleCoreError } from "../../interfaces/objects/errors/SnickerDoodleCoreError";

export class AccountRepository implements IAccountRepository {
  addAccount(
    account: AccountAddress,
    signature: Signature,
    chain: EChain,
    languageCode: LanguageCode,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    throw new Error("Method not implemented.");
  }
  unlock(
    account: AccountAddress,
    signature: Signature,
    chain: EChain,
    languageCode: LanguageCode,
    calledWithCookie: boolean,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    throw new Error("Method not implemented.");
  }
  getUnlockMessage(
    languageCode: LanguageCode,
  ): ResultAsync<string, SnickerDoodleCoreError> {
    throw new Error("Method not implemented.");
  }
  getAccounts(): ResultAsync<LinkedAccount[], SnickerDoodleCoreError> {
    throw new Error("Method not implemented.");
  }
  getAccountBalances(): ResultAsync<TokenBalance[], SnickerDoodleCoreError> {
    throw new Error("Method not implemented.");
  }
  getAccountNFTs(): ResultAsync<WalletNFT[], SnickerDoodleCoreError> {
    throw new Error("Method not implemented.");
  }
  isDataWalletAddressInitialized(): ResultAsync<boolean, never> {
    throw new Error("Method not implemented.");
  }
  unlinkAccount(
    account: AccountAddress,
    signature: Signature,
    chain: EChain,
    languageCode: LanguageCode,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    throw new Error("Method not implemented.");
  }
  getDataWalletForAccount(
    accountAddress: AccountAddress,
    signature: Signature,
    languageCode: LanguageCode,
    chain: EChain,
  ): ResultAsync<DataWalletAddress | null, SnickerDoodleCoreError> {
    throw new Error("Method not implemented.");
  }
  getEarnedRewards(): ResultAsync<EarnedReward[], SnickerDoodleCoreError> {
    throw new Error("Method not implemented.");
  }
}
