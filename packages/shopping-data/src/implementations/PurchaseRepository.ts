// import {
//   PersistenceError,
//   DomainName,
//   ERecordKey,
// } from "@snickerdoodlelabs/objects";
// import { PurchasedProduct } from "@snickerdoodlelabs/shopping-data";
// import { inject, injectable } from "inversify";
// import { ResultAsync } from "neverthrow";

// import { IPurchaseRepository } from "@shopping-data/interfaces/index.js";

// @injectable()
// export class PurchaseRepository implements IPurchaseRepository {
//   public constructor(
//     @inject(IPersistenceType)
//     protected persistence: IPersistence,
//   ) {}
//   public add(purchase: PurchasedProduct): ResultAsync<void, PersistenceError> {
//     return this.persistence.updateRecord<PurchasedProduct>(
//       ERecordKey.PURCHASED_PRODUCT,
//       purchase,
//     );
//   }

//   public get(): ResultAsync<PurchasedProduct[], PersistenceError> {
//     return this.persistence.getAll<PurchasedProduct>(
//       ERecordKey.PURCHASED_PRODUCT,
//     );
//   }

//   public getByMarketplace(
//     marketPlace: DomainName,
//   ): ResultAsync<PurchasedProduct[], PersistenceError> {
//     return this.persistence.getAllByIndex<PurchasedProduct>(
//       ERecordKey.PURCHASED_PRODUCT,
//       "marketPlace",
//       marketPlace,
//     );
//   }
// }
