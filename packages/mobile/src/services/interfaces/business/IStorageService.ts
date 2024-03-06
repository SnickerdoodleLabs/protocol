import {
  DomainName,
  ECloudStorageType,
  OAuth2Tokens,
  URLString,
  DataWalletBackup,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";
import { SnickerDoodleCoreError } from "../objects/errors/SnickerDoodleCoreError";

export interface IStorageService {
  setAuthenticatedStorage(
    type: ECloudStorageType,
    path: string,
    refreshToken: string,
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<void, SnickerDoodleCoreError>;

  authenticateDropbox(
    code: string,
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<OAuth2Tokens, SnickerDoodleCoreError>;

  getCurrentCloudStorage(
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<ECloudStorageType, SnickerDoodleCoreError>;

  getAvailableCloudStorageOptions(
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<Set<ECloudStorageType>, SnickerDoodleCoreError>;

  getDropboxAuth(
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<URLString, SnickerDoodleCoreError>;
}

export const IStorageServiceType = Symbol.for("IStorageService");
