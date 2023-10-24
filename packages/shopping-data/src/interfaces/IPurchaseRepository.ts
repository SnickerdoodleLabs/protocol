import {
  DomainName,
  PersistenceError,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { PurchasedProduct } from "@shopping-data/objects/index.js";

export interface IPurchaseRepository {
  add(purchase: PurchasedProduct): ResultAsync<void, PersistenceError>;
  get(): ResultAsync<PurchasedProduct[], PersistenceError>;
  getByMarketplace(
    marketPlace: DomainName,
  ): ResultAsync<PurchasedProduct[], PersistenceError>;
  getByMarketplaceAndDate(
    marketPlace: DomainName,
    datePurchased: UnixTimestamp,
  ): ResultAsync<PurchasedProduct[], PersistenceError>;
}

export const IPurchaseRepositoryType = Symbol.for("IPurchaseRepository");
