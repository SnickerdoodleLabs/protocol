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
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import { IAccountService } from "@interfaces/business";
import { IAccountRepository, IAccountRepositoryType } from "@interfaces/data";
import { SnickerDoodleCoreError } from "@shared/objects/errors";

@injectable()
export class AccountService implements IAccountService {
  constructor(
    @inject(IAccountRepositoryType)
    protected accountRepository: IAccountRepository,
  ) {}

  public getAccounts(): ResultAsync<LinkedAccount[], SnickerDoodleCoreError> {
    return this.accountRepository.getAccounts();
  }

  public getAccountBalances(): ResultAsync<
    TokenBalance[],
    SnickerDoodleCoreError
  > {
    return this.accountRepository.getAccountBalances();
  }

  public getAccountNFTs(): ResultAsync<IAccountNFT[], SnickerDoodleCoreError> {
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

  public isDataWalletAddressInitialized(): ResultAsync<boolean, never> {
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
