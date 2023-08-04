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

  public getEarnedRewards(): ResultAsync<
    EarnedReward[],
    SnickerDoodleCoreError
  > {
    return this.accountRepository.getEarnedRewards();
  }

  public getAccounts(): ResultAsync<LinkedAccount[], SnickerDoodleCoreError> {
    return this.accountRepository.getAccounts();
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
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.accountRepository.addAccount(
      account,
      signature,
      chain,
      languageCode,
    );
  }

  public getLinkAccountMessage(
    languageCode: LanguageCode,
  ): ResultAsync<string, SnickerDoodleCoreError> {
    return this.accountRepository.getLinkAccountMessage(languageCode);
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
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.accountRepository.unlinkAccount(account, chain);
  }
}
