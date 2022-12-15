import { 
  IpfsCID, 
  ISO8601DateString, 
  SDQL_Name, 
  URLString 
} from "@snickerdoodlelabs/objects";

export class AST_Ad {
  constructor(
    readonly name: SDQL_Name,
    readonly content: {
      readonly type: "image" | "video",
      readonly src: IpfsCID | URLString
    },
    readonly text: string | null,
    readonly type: "banner" | "popup",
    readonly weight: number,
    readonly expiry: ISO8601DateString,
    readonly keywords: string[]
  ) {}
}
