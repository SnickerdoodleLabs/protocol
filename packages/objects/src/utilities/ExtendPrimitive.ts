export declare type ExtendPrimitive<
  Primitive,
  newType extends string,
  newTypeName extends string = newType,
> = Primitive & {
  [K in newTypeName]: newType;
};
