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
  ChainId,
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

  public getEarnedRewards(): ResultAsync<
    EarnedReward[],
    SnickerDoodleCoreError
  > {
    return this.accountRepository.getEarnedRewards();
  }

  public getAccounts(): ResultAsync<LinkedAccount[], SnickerDoodleCoreError> {
    return this.accountRepository.getAccounts();
  }

  public getAccountBalances(
    chains?: ChainId[],
    accounts?: LinkedAccount[],
  ): ResultAsync<TokenBalance[], SnickerDoodleCoreError> {
    return this.accountRepository.getAccountBalances(chains, accounts);
  }

  public getAccountNFTs(
    chains?: ChainId[],
    accounts?: LinkedAccount[],
  ): ResultAsync<WalletNFT[], SnickerDoodleCoreError> {
    return this.accountRepository.getAccountNFTs(chains, accounts);
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

  public getDataWalletForAccount(
    accountAddress: AccountAddress,
    signature: Signature,
    languageCode: LanguageCode,
    chain: EChain,
  ): ResultAsync<DataWalletAddress | null, SnickerDoodleCoreError> {
    return this.accountRepository.getDataWalletForAccount(
      accountAddress,
      signature,
      languageCode,
      chain,
    );
  }

  public unlock(
    account: AccountAddress,
    signature: Signature,
    chain: EChain,
    languageCode: LanguageCode,
    calledWithCookie?: boolean,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.accountRepository.unlock(
      account,
      signature,
      chain,
      languageCode,
      calledWithCookie || false,
    );
  }

  public getUnlockMessage(
    languageCode: LanguageCode,
  ): ResultAsync<string, SnickerDoodleCoreError> {
    return this.accountRepository.getUnlockMessage(languageCode);
  }

  public isDataWalletAddressInitialized(): ResultAsync<
    boolean,
    UnauthorizedError
  > {
    return this.accountRepository.isDataWalletAddressInitialized();
  }

  public unlinkAccount(
    account: AccountAddress,
    signature: Signature,
    chain: EChain,
    languageCode: LanguageCode,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.accountRepository.unlinkAccount(
      account,
      signature,
      chain,
      languageCode,
    );
  }
}
