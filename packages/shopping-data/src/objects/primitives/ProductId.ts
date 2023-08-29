import { Brand, make } from "ts-brand";

export type ProductId = Brand<number, "ProductId">;
export const ProductId = make<ProductId>();
