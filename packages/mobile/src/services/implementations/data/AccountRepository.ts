import {
  AccountAddress,
  Signature,
  EChain,
  LanguageCode,
  LinkedAccount,
  TokenBalance,
  WalletNFT,
  DataWalletAddress,
  EarnedReward,
  ISnickerdoodleCoreType,
  ISnickerdoodleCore,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";

import { IAccountRepository } from "../../interfaces/data/IAccountRepository";
import {
  IAccountStorageRepository,
  IAccountStorageRepositoryType,
} from "../../interfaces/data/IAccountStorageRepository";
import { SnickerDoodleCoreError } from "../../interfaces/objects/errors/SnickerDoodleCoreError";

import {
  IErrorUtils,
  IErrorUtilsType,
} from "../../interfaces/utils/IErrorUtils";

@injectable()
export class AccountRepository implements IAccountRepository {
  constructor(
    @inject(ISnickerdoodleCoreType) protected core: ISnickerdoodleCore,
    @inject(IErrorUtilsType) protected errorUtils: IErrorUtils,
    @inject(IAccountStorageRepositoryType)
    protected accountStorage: IAccountStorageRepository,
  ) {}
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
    account: AccountAddress,
    signature: Signature,
    chain: EChain,
    languageCode: LanguageCode,
    calledWithCookie: boolean,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.core
      .unlock(account, signature, languageCode, chain)
      .mapErr((error) => {
        return new SnickerDoodleCoreError((error as Error).message, error);
      })
      .andThen(() => {
        if (calledWithCookie) {
          return okAsync(undefined);
        }
        return this.accountStorage.writeAccountInfoToStorage(
          account,
          signature,
          languageCode,
          chain,
        );
      })
      .orElse((error) => {
        this.errorUtils.emit(error);
        return okAsync(undefined);
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
  public getAccounts(): ResultAsync<LinkedAccount[], SnickerDoodleCoreError> {
    return this.core.getAccounts().mapErr((error) => {
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
  public getAccountNFTs(): ResultAsync<WalletNFT[], SnickerDoodleCoreError> {
    return this.core.getAccountNFTs().mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message, error);
    });
  }

  public isDataWalletAddressInitialized(): ResultAsync<boolean, never> {
    return this.core.isDataWalletAddressInitialized();
  }
  public unlinkAccount(
    account: AccountAddress,
    signature: Signature,
    chain: EChain,
    languageCode: LanguageCode,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.core
      .unlinkAccount(account, signature, languageCode, chain)
      .mapErr((error) => {
        this.errorUtils.emit(error);
        return new SnickerDoodleCoreError((error as Error).message, error);
      });
  }
  public getDataWalletForAccount(
    accountAddress: AccountAddress,
    signature: Signature,
    languageCode: LanguageCode,
    chain: EChain,
  ): ResultAsync<DataWalletAddress | null, SnickerDoodleCoreError> {
    return this.core
      .getDataWalletForAccount(accountAddress, signature, languageCode, chain)
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
}
