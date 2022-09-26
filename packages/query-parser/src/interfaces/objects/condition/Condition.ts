import { Operator } from "@query-parser/interfaces/objects/Operator.js";

export abstract class Condition extends Operator {
  /**
   * Abstraction over operator which always returns boolean
   */

  abstract check(): boolean;
}
