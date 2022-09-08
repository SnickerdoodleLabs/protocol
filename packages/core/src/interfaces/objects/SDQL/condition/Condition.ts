import { Operator } from "@core/interfaces/objects/SDQL/Operator.js";

export abstract class Condition extends Operator {
  /**
   * Abstraction over operator which always returns boolean
   */

  abstract check(): boolean;
}
