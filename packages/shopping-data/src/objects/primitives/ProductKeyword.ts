import { Brand, make } from "ts-brand";

export type ProductKeyword = Brand<string, "ProductKeyword">;
export const ProductKeyword = make<ProductKeyword>();
