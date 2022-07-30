import { URLString } from "@objects/primitives";
import { UnixTimestamp } from "@objects/businessObjects";
/**
 * I honestly don't know what we need to collect for clicks. I'm not a data guy. Presumeably,
 * you want to know where you clicked and when you did it.
 */
export class ClickData {
  public constructor(
    public url: URLString,
    public timestamp: UnixTimestamp,
    public element: string,
  ) {}
}
