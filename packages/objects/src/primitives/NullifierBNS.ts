import { make } from "ts-brand";

import { BigNumberString } from "@objects/primitives/BigNumberString.js";
import { ExtendPrimitive } from "@objects/utilities/ExtendPrimitive.js";

export type NullifierBNS = ExtendPrimitive<
  BigNumberString,
  "NullifierBNS",
  "__nullifier__"
>;
export const NullifierBNS = make<NullifierBNS>();
