import { 
  AdContent,
  SDQL_Name,
  UnixTimestamp, 
} from "@snickerdoodlelabs/objects";
import { EAdDisplayType } from "packages/objects/src/primitives/EAdDisplayType";

export class AST_Ad {
  constructor(
    readonly key: SDQL_Name, //a1, a2, ..
    readonly name: SDQL_Name,
    readonly content: AdContent,
    readonly text: string | null,
    readonly displayType: EAdDisplayType,
    readonly weight: number,
    readonly expiry: UnixTimestamp,
    readonly keywords: string[]
  ) {}
}
