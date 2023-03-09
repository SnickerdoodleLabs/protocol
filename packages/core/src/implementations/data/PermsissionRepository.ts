import {
  DomainName,
  EDataWalletPermission,
  JSONString,
  PersistenceError,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import {
  IDataWalletPersistence,
  IDataWalletPersistenceType,
  IPermissionRepository,
} from "@core/interfaces/data/index.js";

@injectable()
export class PermissionRepository implements IPermissionRepository {
  public constructor(
    @inject(IDataWalletPersistenceType)
    protected persistence: IDataWalletPersistence,
  ) {}

  public getPermissions(
    domain: DomainName,
  ): ResultAsync<EDataWalletPermission[], PersistenceError> {
    throw new Error("Not implemented");
  }

  public setPermissions(
    domain: DomainName,
    permissions: EDataWalletPermission[],
  ): ResultAsync<void, PersistenceError> {
    throw new Error("Not implemented");
  }
}

interface DomainPermissions {
  [key: DomainName]: EDataWalletPermission[] | undefined;
}
