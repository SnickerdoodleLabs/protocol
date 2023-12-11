import {
  AccountAddress,
  EarnedReward,
  EChain,
  WalletNFT,
  ISnickerdoodleCore,
  ISnickerdoodleCoreType,
  LanguageCode,
  LinkedAccount,
  Signature,
  TokenBalance,
  UnauthorizedError,
  IpfsCID,
  QueryStatus,
  EVMContractAddress,
  BlockNumber,
  ChainTransaction,
  TransactionFilter,
  TransactionFlowInsight,
  DomainName,
  TransactionPaymentCounter,
  WalletNFTHistory,
  WalletNftWithHistory,
  UnixTimestamp,
  NftRepositoryCache,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";

import { IAccountRepository } from "@synamint-extension-sdk/core/interfaces/data";
import {
  IContextProvider,
  IContextProviderType,
  IErrorUtils,
  IErrorUtilsType,
} from "@synamint-extension-sdk/core/interfaces/utilities";
import { SnickerDoodleCoreError } from "@synamint-extension-sdk/shared/objects/errors";

@injectable()
export class AccountRepository implements IAccountRepository {
  constructor(
    @inject(ISnickerdoodleCoreType) protected core: ISnickerdoodleCore,
    @inject(IErrorUtilsType) protected errorUtils: IErrorUtils,
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
  ) {}

  getQueryStatusByQueryCID(
    queryCID: IpfsCID,
  ): ResultAsync<QueryStatus | null, SnickerDoodleCoreError> {
    return this.core.getQueryStatusByQueryCID(queryCID).mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message, error);
    });
  }

  getQueryStatuses(
    contractAddress: EVMContractAddress,
    blockNumber?: BlockNumber,
  ): ResultAsync<QueryStatus[], SnickerDoodleCoreError> {
    return this.core
      .getQueryStatuses(contractAddress, blockNumber)
      .mapErr((error) => {
        this.errorUtils.emit(error);
        return new SnickerDoodleCoreError((error as Error).message, error);
      });
  }

  public getEarnedRewards(): ResultAsync<
    EarnedReward[],
    SnickerDoodleCoreError
  > {
    return this.core.getEarnedRewards().mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message, error);
    });
  }
  public getAccounts(
    sourceDomain?: DomainName,
  ): ResultAsync<LinkedAccount[], SnickerDoodleCoreError> {
    return this.core.account.getAccounts(sourceDomain).mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message, error);
    });
  }

  public getAccountBalances(): ResultAsync<
    TokenBalance[],
    SnickerDoodleCoreError
  > {
    return this.core.getAccountBalances().mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message, error);
    });
  }

  public getTransactions(
    filter?: TransactionFilter,
    sourceDomain?: DomainName,
  ): ResultAsync<ChainTransaction[], SnickerDoodleCoreError> {
    return this.core.getTransactions(filter, sourceDomain).mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message, error);
    });
  }
  public getTransactionValueByChain(
    sourceDomain?: DomainName,
  ): ResultAsync<TransactionFlowInsight[], SnickerDoodleCoreError> {
    return this.core
      .getTransactionValueByChain(sourceDomain)
      .mapErr((error) => {
        this.errorUtils.emit(error);
        return new SnickerDoodleCoreError((error as Error).message, error);
      });
  }

  public getCachedNFTs(
    benchmark?: UnixTimestamp,
    chains?: EChain[],
    accounts?: LinkedAccount[],
    sourceDomain?: DomainName,
  ): ResultAsync<WalletNftWithHistory[], SnickerDoodleCoreError> {
    return this.core.nft
      .getCachedNFTs(benchmark, chains, accounts, sourceDomain)
      .mapErr((error) => {
        this.errorUtils.emit(error);
        return new SnickerDoodleCoreError((error as Error).message, error);
      });
  }

  getCache(
    sourceDomain?: DomainName,
  ): ResultAsync<NftRepositoryCache, SnickerDoodleCoreError> {
    return this.core.nft.getCache(sourceDomain).mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message, error);
    });
  }

  public getPersistenceNFTs(
    sourceDomain?: DomainName,
  ): ResultAsync<WalletNFT[], SnickerDoodleCoreError> {
    return this.core.nft.getPersistenceNFTs(sourceDomain).mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message, error);
    });
  }

  public getNFTsHistory(
    sourceDomain?: DomainName,
  ): ResultAsync<WalletNFTHistory[], SnickerDoodleCoreError> {
    return this.core.nft.getNFTsHistory(sourceDomain).mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message, error);
    });
  }

  public addAccount(
    account: AccountAddress,
    signature: Signature,
    chain: EChain,
    languageCode: LanguageCode,
    sourceDomain?: DomainName,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.core.account
      .addAccount(account, signature, languageCode, chain, sourceDomain)
      .mapErr((error) => {
        this.errorUtils.emit(error);
        return new SnickerDoodleCoreError((error as Error).message, error);
      })
      .orElse((error) => {
        this.errorUtils.emit(error);
        return okAsync(undefined);
      });
  }

  public getLinkAccountMessage(
    languageCode: LanguageCode,
    sourceDomain?: DomainName,
  ): ResultAsync<string, SnickerDoodleCoreError> {
    return this.core.account
      .getLinkAccountMessage(languageCode, sourceDomain)
      .mapErr((error) => {
        this.errorUtils.emit(error);
        return new SnickerDoodleCoreError((error as Error).message, error);
      });
  }

  public isDataWalletAddressInitialized(): ResultAsync<
    boolean,
    UnauthorizedError
  > {
    return this.core.isDataWalletAddressInitialized();
  }

  public unlinkAccount(
    account: AccountAddress,
    chain: EChain,
    sourceDomain?: DomainName,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.core.account
      .unlinkAccount(account, chain, sourceDomain)
      .mapErr((error) => {
        this.errorUtils.emit(error);
        return new SnickerDoodleCoreError((error as Error).message, error);
      });
  }
}
