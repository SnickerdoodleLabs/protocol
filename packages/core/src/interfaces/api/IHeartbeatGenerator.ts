import { ResultAsync } from "neverthrow";

export interface IHeartbeatGenerator {
  initialize(): ResultAsync<void, never>;
}

export const IHeartbeatGeneratorType = Symbol.for("IHeartbeatGenerator");
