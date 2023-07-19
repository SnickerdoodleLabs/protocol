import {
  ChainId,
  CompensationKey,
  IpfsCID,
  URLString,
  ISDQLConditionString,
} from "@objects/primitives/index.js";
import { ISDQLCallback } from "@objects/interfaces/ISDQLCallback.js";

export interface ISDQLCompensations {
  name: string;
  image: IpfsCID | URLString | null;
  description: string;
  requires?: ISDQLConditionString;
  chainId: ChainId;
  callback: ISDQLCallback;
  alternatives?: CompensationKey[];
}
