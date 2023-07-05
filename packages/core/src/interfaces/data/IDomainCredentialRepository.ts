import {
  DomainCredential,
  DomainName,
  EDataWalletPermission,
  PersistenceError,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IDomainCredentialRepository {
  getDomainCredential(
    domain: DomainName,
  ): ResultAsync<DomainCredential | null, PersistenceError>;
  addDomainCredential(
    domainCredential: DomainCredential,
  ): ResultAsync<void, PersistenceError>;
}

export const IDomainCredentialRepositoryType = Symbol.for(
  "IDomainCredentialRepository",
);
