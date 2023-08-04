import {
  AccountAddress,
  EarnedReward,
  EChain,
  WalletNFT,
  LanguageCode,
  LinkedAccount,
  Signature,
  TokenBalance,
  UnauthorizedError,
  IpfsCID,
  QueryStatus,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { SnickerDoodleCoreError } from "@synamint-extension-sdk/shared/objects/errors";

export interface IAccountRepository {
  addAccount(
    account: AccountAddress,
    signature: Signature,
    chain: EChain,
    languageCode: LanguageCode,
  ): ResultAsync<void, SnickerDoodleCoreError>;
  getLinkAccountMessage(
    languageCode: LanguageCode,
  ): ResultAsync<string, SnickerDoodleCoreError>;
  getAccounts(): ResultAsync<LinkedAccount[], SnickerDoodleCoreError>;
  getAccountBalances(): ResultAsync<TokenBalance[], SnickerDoodleCoreError>;
  getAccountNFTs(): ResultAsync<WalletNFT[], SnickerDoodleCoreError>;
  isDataWalletAddressInitialized(): ResultAsync<boolean, UnauthorizedError>;
  unlinkAccount(
    account: AccountAddress,
    chain: EChain,
  ): ResultAsync<void, SnickerDoodleCoreError>;
  getEarnedRewards(): ResultAsync<EarnedReward[], SnickerDoodleCoreError>;
  getQueryStatusByQueryCID(
    queryCID: IpfsCID,
  ): ResultAsync<QueryStatus | null, SnickerDoodleCoreError>;
}

export const IAccountRepositoryType = Symbol.for("IAccountRepository");
