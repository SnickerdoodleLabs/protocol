import {
  AccountAddress,
  EChain,
  EVMAccountAddress,
  IEVMBalance,
  IEVMNFT,
  ISnickerdoodleCore,
  ISnickerdoodleCoreType,
  LanguageCode,
  LinkedAccount,
  Signature,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";

import { IAccountRepository } from "@interfaces/data";
import {
  IAccountCookieUtils,
  IAccountCookieUtilsType,
  IContextProvider,
  IContextProviderType,
  IErrorUtils,
  IErrorUtilsType,
} from "@interfaces/utilities";
import {
  SnickerDoodleCoreError,
  ExtensionCookieError,
} from "@shared/objects/errors";

@injectable()
export class AccountRepository implements IAccountRepository {
  constructor(
    @inject(ISnickerdoodleCoreType) protected core: ISnickerdoodleCore,
    @inject(IAccountCookieUtilsType)
    protected accountCookieUtils: IAccountCookieUtils,
    @inject(IErrorUtilsType) protected errorUtils: IErrorUtils,
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
  ) {}
  public getAccounts(): ResultAsync<LinkedAccount[], SnickerDoodleCoreError> {
    return this.core.getAccounts().mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message, error);
    });
  }

  public getAccountBalances(): ResultAsync<
    IEVMBalance[],
    SnickerDoodleCoreError
  > {
    return this.core.getAccountBalances().mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message, error);
    });
  }

  public getAccountNFTs(): ResultAsync<IEVMNFT[], SnickerDoodleCoreError> {
    return this.core.getAccountNFTs().mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message, error);
    });
  }

  public addAccount(
    account: AccountAddress,
    signature: Signature,
    chain: EChain,
    languageCode: LanguageCode,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.core
      .addAccount(account, signature, languageCode, chain)
      .mapErr((error) => {
        this.errorUtils.emit(error);
        return new SnickerDoodleCoreError((error as Error).message, error);
      });
  }

  public unlock(
    account: EVMAccountAddress,
    signature: Signature,
    chain: EChain,
    languageCode: LanguageCode,
    calledWithCookie: boolean,
  ): ResultAsync<void, SnickerDoodleCoreError | ExtensionCookieError> {
    return this.core
      .unlock(account, signature, languageCode, chain)
      .mapErr((error) => {
        return new SnickerDoodleCoreError((error as Error).message, error);
      })
      .andThen(() => {
        if (calledWithCookie) {
          return okAsync(undefined);
        }
        return this.accountCookieUtils.writeAccountInfoToCookie(
          account,
          signature,
          languageCode,
        );
      })
      .mapErr((error) => {
        this.errorUtils.emit(error);
        return error;
      });
  }
  public getUnlockMessage(
    languageCode: LanguageCode,
  ): ResultAsync<string, SnickerDoodleCoreError> {
    return this.core.getUnlockMessage(languageCode).mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message, error);
    });
  }

  public isDataWalletAddressInitialized(): ResultAsync<boolean, never> {
    return this.core.isDataWalletAddressInitialized();
  }

  public getUnlinkAccountRequest(
    accountAddress: EVMAccountAddress,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.core
      .getUnlinkAccountRequest(accountAddress)
      .mapErr((error) => {
        this.errorUtils.emit(error);
        return new SnickerDoodleCoreError((error as Error).message, error);
      })
      .map((metatransactionSignatureRequest) => {
        this.contextProvider.notifyPortsWithIncomingMetatransactionSignatureRequest(
          metatransactionSignatureRequest,
        );
      });
  }
}
