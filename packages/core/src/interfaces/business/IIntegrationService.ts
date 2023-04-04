import {
  DomainName,
  PersistenceError,
  EDataWalletPermission,
  UnauthorizedError,
  PEMEncodedRSAPublicKey,
  KeyGenerationError,
  JsonWebToken,
  InvalidSignatureError,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IIntegrationService {
  grantPermissions(
    permissions: EDataWalletPermission[],
    domain: DomainName,
  ): ResultAsync<void, PersistenceError>;

  revokePermissions(domain: DomainName): ResultAsync<void, PersistenceError>;

  requestPermissions(
    permissions: EDataWalletPermission[],
    sourceDomain: DomainName,
  ): ResultAsync<EDataWalletPermission[], PersistenceError>;

  /**
   * Returns the granted permissions for a particular domain
   * @param domain
   */
  getPermissions(
    domain: DomainName,
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<EDataWalletPermission[], PersistenceError | UnauthorizedError>;

  getTokenVerificationPublicKey(
    domain: DomainName,
  ): ResultAsync<PEMEncodedRSAPublicKey, PersistenceError | KeyGenerationError>;

  getBearerToken(
    nonce: string,
    domain: DomainName,
  ): ResultAsync<
    JsonWebToken,
    InvalidSignatureError | PersistenceError | KeyGenerationError
  >;
}

export const IIntegrationServiceType = Symbol.for("IIntegrationService");
