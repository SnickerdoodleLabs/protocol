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
  UnauthorizedError,
  DomainName,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";

import { IAccountService } from "../../interfaces/business/IAccountService";
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
export class AccountService implements IAccountService {
  constructor(
    @inject(ISnickerdoodleCoreType) protected core: ISnickerdoodleCore,
    @inject(IErrorUtilsType) protected errorUtils: IErrorUtils,
    @inject(IAccountStorageRepositoryType)
    protected accountStorage: IAccountStorageRepository,
  ) {}
  getAccountBalances(
    sourceDomain: DomainName | undefined,
  ): ResultAsync<TokenBalance[], SnickerDoodleCoreError> {
    return this.core.getAccountBalances(sourceDomain).mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message);
    });
  }
  isDataWalletAddressInitialized(
    sourceDomain: DomainName | undefined,
  ): ResultAsync<boolean, SnickerDoodleCoreError> {
    return this.core
      .isDataWalletAddressInitialized(sourceDomain)
      .mapErr((error) => {
        this.errorUtils.emit(error);
        return new SnickerDoodleCoreError((error as Error).message);
      });
  }
  getEarnedRewards(
    sourceDomain: DomainName | undefined,
  ): ResultAsync<EarnedReward[], SnickerDoodleCoreError> {
    return this.core.getEarnedRewards(sourceDomain).mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message);
    });
  }
  public addAccount(
    accountAddress: AccountAddress,
    signature: Signature,
    languageCode: LanguageCode,
    chain: EChain,
    sourceDomain: DomainName | undefined,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.core.account
      .addAccount(accountAddress, signature, languageCode, chain, sourceDomain)
      .mapErr((error) => {
        this.errorUtils.emit(error);
        return new SnickerDoodleCoreError((error as Error).message);
      });
  }

  public getLinkAccountMessage(
    languageCode: LanguageCode,
    sourceDomain: DomainName | undefined,
  ): ResultAsync<string, SnickerDoodleCoreError> {
    return this.core.account
      .getLinkAccountMessage(languageCode, sourceDomain)
      .mapErr((error) => {
        this.errorUtils.emit(error);
        return new SnickerDoodleCoreError((error as Error).message);
      });
  }

  public getAccounts(
    sourceDomain: DomainName | undefined,
  ): ResultAsync<LinkedAccount[], SnickerDoodleCoreError> {
    return this.core.account.getAccounts(sourceDomain).mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message);
    });
  }

  public unlinkAccount(
    accountAddress: AccountAddress,
    chain: EChain,
    sourceDomain: DomainName | undefined,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.core.account
      .unlinkAccount(accountAddress, chain, sourceDomain)
      .mapErr((error) => {
        this.errorUtils.emit(error);
        return new SnickerDoodleCoreError((error as Error).message);
      });
  }

  public getNfts(
    benchmark: UnixTimestamp | undefined,
    chains: EChain[] | undefined,
    accounts: LinkedAccount[] | undefined,
    sourceDomain: DomainName | undefined,
  ): ResultAsync<WalletNFT[], SnickerDoodleCoreError> {
    return this.core.nft
      .getNfts(benchmark, chains, accounts, sourceDomain)
      .mapErr((error) => {
        this.errorUtils.emit(error);
        return new SnickerDoodleCoreError((error as Error).message);
      });
  }
}
