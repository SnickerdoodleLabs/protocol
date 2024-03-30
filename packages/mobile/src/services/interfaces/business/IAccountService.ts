import {
  AccountAddress,
  Signature,
  EChain,
  LanguageCode,
  LinkedAccount,
  TokenBalance,
  DataWalletAddress,
  EarnedReward,
  DomainName,
  UnauthorizedError,
  WalletNFT,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";
import { SnickerDoodleCoreError } from "../objects/errors/SnickerDoodleCoreError";

export interface IAccountService {
  addAccount(
    accountAddress: AccountAddress,
    signature: Signature,
    languageCode: LanguageCode,
    chain: EChain,
    sourceDomain: DomainName | undefined,
  ): ResultAsync<void, SnickerDoodleCoreError>;

  getLinkAccountMessage(
    languageCode: LanguageCode,
    sourceDomain: DomainName | undefined,
  ): ResultAsync<string, SnickerDoodleCoreError>;

  getAccounts(
    sourceDomain: DomainName | undefined,
  ): ResultAsync<LinkedAccount[], SnickerDoodleCoreError>;

  unlinkAccount(
    accountAddress: AccountAddress,
    chain: EChain,
    sourceDomain: DomainName | undefined,
  ): ResultAsync<void, SnickerDoodleCoreError>;

  getAccountBalances(
    sourceDomain: DomainName | undefined,
  ): ResultAsync<TokenBalance[], SnickerDoodleCoreError>;

  isDataWalletAddressInitialized(
    sourceDomain: DomainName | undefined,
  ): ResultAsync<boolean, SnickerDoodleCoreError>;

  getEarnedRewards(
    sourceDomain: DomainName | undefined,
  ): ResultAsync<EarnedReward[], SnickerDoodleCoreError>;

  getNfts(
    benchmark: UnixTimestamp | undefined,
    chains: EChain[] | undefined,
    accounts: LinkedAccount[] | undefined,
    sourceDomain: DomainName | undefined,
  ): ResultAsync<WalletNFT[], SnickerDoodleCoreError>;
}

export const IAccountServiceType = Symbol.for("IAccountService");
