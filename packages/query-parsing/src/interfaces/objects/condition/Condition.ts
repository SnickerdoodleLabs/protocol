import { Operator } from "@query-parsing/interfaces/objects/Operator";

export abstract class Condition extends Operator {
  /**
   * Abstraction over operator which always returns boolean
   */

  abstract check(): boolean;
}
