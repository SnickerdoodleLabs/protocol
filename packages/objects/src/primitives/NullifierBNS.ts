import { make } from "ts-brand";

import { BigNumberString } from "@objects/primitives/BigNumberString.js";

export type NullifierBNS = BigNumberString & {
  __nullifier__: "NullifierBNS";
};
export const NullifierBNS = make<NullifierBNS>();
