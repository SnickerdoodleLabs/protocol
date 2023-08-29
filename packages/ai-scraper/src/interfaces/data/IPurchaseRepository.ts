import { DomainName, PersistenceError } from "@snickerdoodlelabs/objects";
import { PurchasedProduct } from "@snickerdoodlelabs/shopping-data";
import { ResultAsync } from "neverthrow";

export interface IPurchaseRepository {
  add(purchase: PurchasedProduct): ResultAsync<void, PersistenceError>;
  get(): ResultAsync<PurchasedProduct[], PersistenceError>;
  getByMarketplace(
    marketPlace: DomainName,
  ): ResultAsync<PurchasedProduct[], PersistenceError>;
}
