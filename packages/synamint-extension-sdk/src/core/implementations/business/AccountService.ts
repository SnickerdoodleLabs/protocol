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
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import { IAccountService } from "@synamint-extension-sdk/core/interfaces/business";
import {
  IAccountRepository,
  IAccountRepositoryType,
} from "@synamint-extension-sdk/core/interfaces/data";
import { SnickerDoodleCoreError } from "@synamint-extension-sdk/shared";

@injectable()
export class AccountService implements IAccountService {
  constructor(
    @inject(IAccountRepositoryType)
    protected accountRepository: IAccountRepository,
  ) {}
  getQueryStatusByQueryCID(
    queryCID: IpfsCID,
  ): ResultAsync<QueryStatus | null, SnickerDoodleCoreError> {
    return this.accountRepository.getQueryStatusByQueryCID(queryCID);
  }

  getQueryStatuses(
    contractAddress: EVMContractAddress,
    blockNumber?: BlockNumber,
  ): ResultAsync<QueryStatus[], SnickerDoodleCoreError> {
    return this.accountRepository.getQueryStatuses(
      contractAddress,
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

  public getAccountNFTs(): ResultAsync<WalletNFT[], SnickerDoodleCoreError> {
    return this.accountRepository.getAccountNFTs();
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
