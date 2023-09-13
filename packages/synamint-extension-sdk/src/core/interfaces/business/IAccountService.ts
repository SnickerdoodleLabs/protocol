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
  EVMContractAddress,
  BlockNumber,
  DomainName,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { SnickerDoodleCoreError } from "@synamint-extension-sdk/shared/objects/errors";

export interface IAccountService {
  addAccount(
    account: AccountAddress,
    signature: Signature,
    chain: EChain,
    languageCode: LanguageCode,
    sourceDomain?: DomainName,
  ): ResultAsync<void, SnickerDoodleCoreError>;
  getLinkAccountMessage(
    languageCode: LanguageCode,
    sourceDomain?: DomainName,
  ): ResultAsync<string, SnickerDoodleCoreError>;
  getAccounts(
    sourceDomain?: DomainName,
  ): ResultAsync<LinkedAccount[], SnickerDoodleCoreError>;
  getAccountBalances(): ResultAsync<TokenBalance[], SnickerDoodleCoreError>;
  getAccountNFTs(): ResultAsync<WalletNFT[], SnickerDoodleCoreError>;
  isDataWalletAddressInitialized(): ResultAsync<boolean, UnauthorizedError>;
  unlinkAccount(
    account: AccountAddress,
    chain: EChain,
    sourceDomain?: DomainName,
  ): ResultAsync<void, SnickerDoodleCoreError>;
  getEarnedRewards(): ResultAsync<EarnedReward[], SnickerDoodleCoreError>;
  getQueryStatusByQueryCID(
    queryCID: IpfsCID,
  ): ResultAsync<QueryStatus | null, SnickerDoodleCoreError>;
  getQueryStatuses(
    contractAddress: EVMContractAddress,
    blockNumber?: BlockNumber,
  ): ResultAsync<QueryStatus[], SnickerDoodleCoreError>;
}

export const IAccountServiceType = Symbol.for("IAccountService");
