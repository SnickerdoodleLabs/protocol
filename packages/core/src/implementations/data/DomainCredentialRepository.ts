import {
  DomainCredential,
  DomainName,
  EBackupPriority,
  PersistenceError,
  VolatileStorageMetadata,
} from "@snickerdoodlelabs/objects";
import { ERecordKey } from "@snickerdoodlelabs/persistence";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import {
  IDataWalletPersistence,
  IDataWalletPersistenceType,
  IDomainCredentialRepository,
} from "@core/interfaces/data/index.js";

@injectable()
export class DomainCredentialRepository implements IDomainCredentialRepository {
  public constructor(
    @inject(IDataWalletPersistenceType)
    protected persistence: IDataWalletPersistence,
  ) {}

  public getDomainCredential(
    domain: DomainName,
  ): ResultAsync<DomainCredential | null, PersistenceError> {
    return this.persistence.getObject(ERecordKey.DOMAIN_CREDENTIALS, domain);
  }

  public addDomainCredential(
    domainCredential: DomainCredential,
  ): ResultAsync<void, PersistenceError> {
    return this.persistence.updateRecord(
      ERecordKey.DOMAIN_CREDENTIALS,
      new VolatileStorageMetadata<DomainCredential>(
        EBackupPriority.NORMAL,
        domainCredential,
        DomainCredential.CURRENT_VERSION,
      ),
    );
  }
}
