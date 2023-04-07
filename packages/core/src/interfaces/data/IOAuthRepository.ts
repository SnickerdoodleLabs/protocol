import {
  DomainName,
  EDataWalletPermission,
  PersistenceError,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IOAuthRepository {}

export const IOAuthRepositoryType = Symbol.for("IOAuthRepository");
