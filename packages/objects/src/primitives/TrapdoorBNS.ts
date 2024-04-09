import { make } from "ts-brand";

import { BigNumberString } from "@objects/primitives/BigNumberString.js";
import { ExtendPrimitive } from "@objects/utilities/ExtendPrimitive";

export type TrapdoorBNS = ExtendPrimitive<
  BigNumberString,
  "TrapdoorBNS",
  "__trapdoor__"
>;
export const TrapdoorBNS = make<TrapdoorBNS>();
