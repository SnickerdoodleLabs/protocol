import { QueryTypes } from "@objects/primitives";

export interface ICompensationDeps {
  queryDeps: Set<QueryTypes>;
  adDeps: [];
}
