import { URLString, UnixTimestamp } from "@objects/primitives/index.js";

export class ClickFilter {
  public constructor(
    public urls: URLString[] | null,
    public minTime: UnixTimestamp | null,
    public maxTime: UnixTimestamp | null,
  ) {}
}
