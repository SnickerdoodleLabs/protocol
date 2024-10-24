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
  ChainTransaction,
  TransactionFilter,
  TransactionFlowInsight,
  DomainName,
  ISnickerdoodleCore,
  ISnickerdoodleCoreType,
  WalletNFTHistory,
  WalletNftWithHistory,
  UnixTimestamp,
  NftRepositoryCache,
  EQueryProcessingStatus,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";

import { IAccountService } from "@synamint-extension-sdk/core/interfaces/business";
import {
  IAccountRepository,
  IAccountRepositoryType,
} from "@synamint-extension-sdk/core/interfaces/data";
import {
  IErrorUtils,
  IErrorUtilsType,
} from "@synamint-extension-sdk/core/interfaces/utilities";
import { SnickerDoodleCoreError } from "@synamint-extension-sdk/shared";

@injectable()
export class AccountService implements IAccountService {
  constructor(
    @inject(IAccountRepositoryType)
    protected accountRepository: IAccountRepository,
    @inject(IErrorUtilsType) protected errorUtils: IErrorUtils,
    @inject(ISnickerdoodleCoreType) protected core: ISnickerdoodleCore,
  ) {}

  public getQueryStatusByQueryCID(
    queryCID: IpfsCID,
  ): ResultAsync<QueryStatus | null, SnickerDoodleCoreError> {
    return this.accountRepository.getQueryStatusByQueryCID(queryCID);
  }

  public getQueryStatuses(
    contractAddress?: EVMContractAddress,
    status?: EQueryProcessingStatus[],
    blockNumber?: BlockNumber,
  ): ResultAsync<QueryStatus[], SnickerDoodleCoreError> {
    return this.accountRepository.getQueryStatuses(
      contractAddress,
      status,
      blockNumber,
    );
  }

  public getEarnedRewards(): ResultAsync<
    EarnedReward[],
    SnickerDoodleCoreError
  > {
    return this.accountRepository.getEarnedRewards();
  }

  public getAccounts(
    sourceDomain?: DomainName,
  ): ResultAsync<LinkedAccount[], SnickerDoodleCoreError> {
    return this.accountRepository.getAccounts(sourceDomain);
  }

  public getAccountBalances(): ResultAsync<
    TokenBalance[],
    SnickerDoodleCoreError
  > {
    return this.accountRepository.getAccountBalances();
  }

  public getNfts(
    benchmark?: UnixTimestamp,
    chains?: EChain[],
    accounts?: LinkedAccount[],
    sourceDomain?: DomainName,
  ): ResultAsync<WalletNFT[], SnickerDoodleCoreError> {
    return this.accountRepository.getNfts(
      benchmark,
      chains,
      accounts,
      sourceDomain,
    );
  }

  public addAccount(
    account: AccountAddress,
    signature: Signature,
    chain: EChain,
    languageCode: LanguageCode,
    sourceDomain?: DomainName,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.accountRepository.addAccount(
      account,
      signature,
      chain,
      languageCode,
      sourceDomain,
    );
  }

  public getTransactions(
    filter?: TransactionFilter,
    sourceDomain?: DomainName,
  ): ResultAsync<ChainTransaction[], SnickerDoodleCoreError> {
    return this.accountRepository.getTransactions(filter, sourceDomain);
  }
  public getTransactionValueByChain(
    sourceDomain?: DomainName,
  ): ResultAsync<TransactionFlowInsight[], SnickerDoodleCoreError> {
    return this.accountRepository.getTransactionValueByChain(sourceDomain);
  }
  // NOTE: I did this one without the AccountRepository, because
  // that layer is not needed- we don't need to wrap access to the core,
  // it is effectively a repository by itself. I had wanted to refactor
  // this whole file for a while.
  public addAccountWithExternalSignature(
    accountAddress: AccountAddress,
    message: string,
    signature: Signature,
    chain: EChain,
    sourceDomain?: DomainName,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.core.account
      .addAccountWithExternalSignature(
        accountAddress,
        message,
        signature,
        chain,
        sourceDomain,
      )
      .mapErr((error) => {
        this.errorUtils.emit(error);
        return new SnickerDoodleCoreError((error as Error).message, error);
      })
      .orElse((error) => {
        this.errorUtils.emit(error);
        return okAsync(undefined);
      });
  }

  public addAccountWithExternalTypedDataSignature(
    accountAddress: AccountAddress,
    domain: ethers.TypedDataDomain,
    types: Record<string, Array<ethers.TypedDataField>>,
    value: Record<string, unknown>,
    signature: Signature,
    chain: EChain,
    sourceDomain?: DomainName,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.core.account
      .addAccountWithExternalTypedDataSignature(
        accountAddress,
        domain,
        types,
        value,
        signature,
        chain,
        sourceDomain,
      )
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
    return this.accountRepository.getLinkAccountMessage(
      languageCode,
      sourceDomain,
    );
  }

  public isDataWalletAddressInitialized(): ResultAsync<
    boolean,
    UnauthorizedError
  > {
    return this.accountRepository.isDataWalletAddressInitialized();
  }

  public unlinkAccount(
    account: AccountAddress,
    chain: EChain,
    sourceDomain?: DomainName,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.accountRepository.unlinkAccount(account, chain, sourceDomain);
  }
}
