import { ISDQLTimestampRange } from "@objects/interfaces/ISDQLTimestampRange.js";
import { EVMContractAddress } from "@objects/primitives/EVMContractAddress.js";

export interface ISDQLQueryContract {
  address: EVMContractAddress;
  networkid: string;
  function: string;
  direction: string;
  token: string;
  timestampRange: ISDQLTimestampRange;
}
