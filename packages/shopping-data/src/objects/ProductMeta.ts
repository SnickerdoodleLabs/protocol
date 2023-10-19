import { ProductKeyword } from "@shopping-data/objects/primitives/index.js";

export class ProductMeta {
  constructor(
    readonly category: string | null,
    readonly keywords: ProductKeyword[],
  ) {}
}
