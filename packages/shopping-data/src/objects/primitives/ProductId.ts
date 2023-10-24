import { Brand, make } from "ts-brand";

export type ProductId = Brand<string, "ProductId">;
export const ProductId = make<ProductId>();
