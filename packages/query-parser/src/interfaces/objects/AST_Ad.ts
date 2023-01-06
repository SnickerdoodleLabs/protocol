import { 
  IpfsCID, 
  ISO8601DateString, 
  SDQL_Name, 
} from "@snickerdoodlelabs/objects";

export class AST_Ad {
  constructor(
    readonly key: SDQL_Name, //a1, a2, ..
    readonly name: SDQL_Name,
    readonly content: {
      readonly type: "image" | "video",
      readonly src: IpfsCID
    },
    readonly text: string | null,
    readonly type: "banner" | "popup",
    readonly weight: number,
    readonly expiry: ISO8601DateString,
    readonly keywords: string[]
  ) {}
}
