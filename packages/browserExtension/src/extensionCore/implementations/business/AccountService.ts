import { IAccountService } from "@interfaces/business";
import { IAccountRepository } from "@interfaces/data";
import { SnickerDoodleCoreError, ExtensionCookieError } from "@shared/objects/errors";

import {
  EVMAccountAddress,
  LanguageCode,
  Signature,
} from "@snickerdoodlelabs/objects";

import { ResultAsync } from "neverthrow";
export class AccountService implements IAccountService {
  constructor(protected accountRepository: IAccountRepository) {}

  public addAccount(
    account: EVMAccountAddress,
    signature: Signature,
    languageCode: LanguageCode,
  ): ResultAsync<void, SnickerDoodleCoreError | ExtensionCookieError> {
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
