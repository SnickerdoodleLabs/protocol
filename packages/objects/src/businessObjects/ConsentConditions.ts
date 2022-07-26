import { ok, okAsync, ResultAsync } from "neverthrow"

/**
 * ConsentConditions represent the rules to follow when processing queries for a particular
 * cohort. They are basically auto-reject rules to follow that are baked into the consent
 * token itself in the Token URI.
 */
export class ConsentConditions {
  public constructor(public allowCrossBusinessQueries: boolean) { }

  public checkAge(): boolean {
    return true;
  }
  public checkLocation(): boolean {
    return true;
  }
  public checkNetwork(): boolean {
    return true;
  }
  public checkContract(): boolean {
    return true;
  }
}