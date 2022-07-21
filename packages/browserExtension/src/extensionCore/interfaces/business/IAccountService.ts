import { SnickerDoodleCoreError, ExtensionCookieError } from "@shared/objects/errors";
import {
  EVMAccountAddress,
  LanguageCode,
  Signature,
} from "@snickerdoodlelabs/objects";

import { ResultAsync } from "neverthrow";

export interface IAccountService {
  addAccount(
    account: EVMAccountAddress,
    signature: Signature,
    languageCode: LanguageCode,
  ): ResultAsync<void, SnickerDoodleCoreError | ExtensionCookieError>;
  unlock(
    account: EVMAccountAddress,
    signature: Signature,
    languageCode: LanguageCode,
    calledWithCookie?: boolean,
  ): ResultAsync<void, SnickerDoodleCoreError | ExtensionCookieError>;
  getUnlockMessage(languageCode: LanguageCode): ResultAsync<string, SnickerDoodleCoreError>;
}
