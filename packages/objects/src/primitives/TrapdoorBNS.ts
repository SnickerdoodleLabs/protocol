import { make } from "ts-brand";

import { BigNumberString } from "@objects/primitives/BigNumberString.js";

export type TrapdoorBNS = BigNumberString & {
  __trapdoor__: "TrapdoorBNS";
};
export const TrapdoorBNS = make<TrapdoorBNS>();
