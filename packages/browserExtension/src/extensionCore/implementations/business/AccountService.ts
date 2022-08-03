import { IAccountService } from "@interfaces/business";
import { IAccountRepository } from "@interfaces/data";
import {
  SnickerDoodleCoreError,
  ExtensionCookieError,
} from "@shared/objects/errors";

import {
  EVMAccountAddress,
  IEVMBalance,
  IEVMNFT,
  LanguageCode,
  Signature,
} from "@snickerdoodlelabs/objects";

import { ResultAsync } from "neverthrow";
export class AccountService implements IAccountService {
  constructor(protected accountRepository: IAccountRepository) {}

  public getAccounts(): ResultAsync<
    EVMAccountAddress[],
    SnickerDoodleCoreError
  > {
    return this.accountRepository.getAccounts();
  }

  public getAccountBalances(): ResultAsync<
    IEVMBalance[],
    SnickerDoodleCoreError
  > {
    return this.accountRepository.getAccountBalances();
  }

  public getAccountNFTs(): ResultAsync<IEVMNFT[], SnickerDoodleCoreError> {
    return this.accountRepository.getAccountNFTs();
  }

  public addAccount(
    account: EVMAccountAddress,
    signature: Signature,
    languageCode: LanguageCode,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.accountRepository.addAccount(account, signature, languageCode);
  }

  public unlock(
    account: EVMAccountAddress,
    signature: Signature,
    languageCode: LanguageCode,
    calledWithCookie?: boolean,
  ): ResultAsync<void, SnickerDoodleCoreError | ExtensionCookieError> {
    return this.accountRepository.unlock(
      account,
      signature,
      languageCode,
      calledWithCookie || false,
    );
  }

  public getUnlockMessage(
    languageCode: LanguageCode,
  ): ResultAsync<string, SnickerDoodleCoreError> {
    return this.accountRepository.getUnlockMessage(languageCode);
  }
}
