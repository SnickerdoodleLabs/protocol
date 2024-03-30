import { injectable, inject } from "inversify";
import {
  DomainName,
  ECloudStorageType,
  OAuth2Tokens,
  URLString,
  ISnickerdoodleCoreType,
  ISnickerdoodleCore,
  RefreshToken,
} from "@snickerdoodlelabs/objects";
import { IStorageService } from "../../interfaces/business/IStorageService";
import { ResultAsync } from "neverthrow";
import {
  IErrorUtils,
  IErrorUtilsType,
} from "../../interfaces/utils/IErrorUtils";
import { SnickerDoodleCoreError } from "../../interfaces/objects/errors/SnickerDoodleCoreError";

@injectable()
export class StorageService implements IStorageService {
  constructor(
    @inject(ISnickerdoodleCoreType) private core: ISnickerdoodleCore,
    @inject(IErrorUtilsType) private errorUtils: IErrorUtils,
  ) {}

  public setAuthenticatedStorage(
    type: ECloudStorageType,
    path: string,
    refreshToken: RefreshToken,
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.core.storage
      .setAuthenticatedStorage(type, path, refreshToken, sourceDomain)
      .mapErr((error) => {
        this.errorUtils.emit(error);
        return new SnickerDoodleCoreError((error as Error).message);
      });
  }

  public authenticateDropbox(
    code: string,
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<OAuth2Tokens, SnickerDoodleCoreError> {
    return this.core.storage
      .authenticateDropbox(code, sourceDomain)
      .mapErr((error) => {
        this.errorUtils.emit(error);
        return new SnickerDoodleCoreError((error as Error).message);
      });
  }

  public getCurrentCloudStorage(
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<ECloudStorageType, SnickerDoodleCoreError> {
    return this.core.storage
      .getCurrentCloudStorage(sourceDomain)
      .mapErr((error) => {
        this.errorUtils.emit(error);
        return new SnickerDoodleCoreError((error as Error).message);
      });
  }

  public getAvailableCloudStorageOptions(
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<Set<ECloudStorageType>, SnickerDoodleCoreError> {
    return this.core.storage
      .getAvailableCloudStorageOptions(sourceDomain)
      .mapErr((error) => {
        this.errorUtils.emit(error);
        return new SnickerDoodleCoreError((error as Error).message);
      });
  }

  public getDropboxAuth(
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<URLString, SnickerDoodleCoreError> {
    return this.core.storage.getDropboxAuth(sourceDomain).mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message);
    });
  }
}
