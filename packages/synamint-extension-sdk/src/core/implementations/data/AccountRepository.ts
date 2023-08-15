import {
  AccountAddress,
  DataWalletAddress,
  EarnedReward,
  EChain,
  EVMAccountAddress,
  WalletNFT,
  ISnickerdoodleCore,
  ISnickerdoodleCoreType,
  LanguageCode,
  LinkedAccount,
  Signature,
  TokenBalance,
  UnauthorizedError,
  IpfsCID,
  QueryStatus,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";

import { IAccountRepository } from "@synamint-extension-sdk/core/interfaces/data";
import {
  IContextProvider,
  IContextProviderType,
  IErrorUtils,
  IErrorUtilsType,
} from "@synamint-extension-sdk/core/interfaces/utilities";
import { SnickerDoodleCoreError } from "@synamint-extension-sdk/shared/objects/errors";

@injectable()
export class AccountRepository implements IAccountRepository {
  constructor(
    @inject(ISnickerdoodleCoreType) protected core: ISnickerdoodleCore,
    @inject(IErrorUtilsType) protected errorUtils: IErrorUtils,
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
  ) {}
  getQueryStatusByQueryCID(
    queryCID: IpfsCID,
  ): ResultAsync<QueryStatus | null, SnickerDoodleCoreError> {
    return this.core.getQueryStatusByQueryCID(queryCID).mapErr((error) => {
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

  public addAccount(
    account: AccountAddress,
    signature: Signature,
    chain: EChain,
    languageCode: LanguageCode,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.core.account
      .addAccount(account, signature, languageCode, chain)
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
  ): ResultAsync<string, SnickerDoodleCoreError> {
    return this.core.account
      .getLinkAccountMessage(languageCode)
      .mapErr((error) => {
        this.errorUtils.emit(error);
        return new SnickerDoodleCoreError((error as Error).message, error);
      });
  }

  public isDataWalletAddressInitialized(): ResultAsync<
    boolean,
    UnauthorizedError
  > {
    return this.core.isDataWalletAddressInitialized();
  }

  public unlinkAccount(
    account: AccountAddress,
    chain: EChain,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.core.account.unlinkAccount(account, chain).mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message, error);
    });
  }
}
