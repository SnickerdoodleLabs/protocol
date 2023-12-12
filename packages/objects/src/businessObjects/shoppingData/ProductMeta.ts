import { ProductId, ProductKeyword } from "@objects/primitives/index.js";

export class ProductMeta {
  constructor(
    readonly productId: ProductId,
    readonly category: string | null,
    readonly keywords: ProductKeyword[],
  ) {}
}
