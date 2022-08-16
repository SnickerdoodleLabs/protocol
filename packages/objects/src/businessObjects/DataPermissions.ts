import { ok, okAsync, ResultAsync } from "neverthrow";
import { EWalletDataType } from "../enum";

/**
 * DataPermissions represent the rules to follow when processing queries for a particular
 * cohort. They are basically auto-reject rules to follow that are baked into the consent
 * token itself in the Token URI.
 */
export class DataPermissions {
  public constructor(protected flags: number) {}

  public age(): boolean {
    return (this.flags & EWalletDataType.Age) > 0;
  }
}
