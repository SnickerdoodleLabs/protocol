import { URLString, UnixTimestamp } from "@objects/primitives";

export class ClickFilter {
  public constructor(
    public urls: URLString[] | null,
    public minTime: UnixTimestamp | null,
    public maxTime: UnixTimestamp | null,
  ) {}
}
