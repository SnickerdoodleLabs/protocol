import { IpfsCID, SDQL_Name, URLString } from "@snickerdoodlelabs/objects";

export class AST_Ad {
  constructor(
    readonly name: SDQL_Name,
    readonly contentUrl: IpfsCID | URLString,
    readonly text: string | null,
    readonly type: "banner" | "popup",
    readonly placement: "right corner" | null,
    readonly platform: "mobile" | "web",
    readonly weight: number,
  ) {}
}
