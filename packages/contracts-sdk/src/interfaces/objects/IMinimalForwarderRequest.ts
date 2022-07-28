import {
  EVMAccountAddress,
  EVMContractAddress,
  HexString,
} from "@objects/primitives";
import { BigNumber } from "ethers";

export interface IMinimalForwarderRequest extends Record<string, unknown> {
  to: EVMContractAddress; // Contract address for the metatransaction
  from: EVMAccountAddress; // EOA to run the transaction as
  value: BigNumber; // The amount of doodle token to pay. Should be 0.
  gas: BigNumber; // The amount of gas to pay.
  nonce: BigNumber; // Nonce for the EOA, recovered from the MinimalForwarder.getNonce()
  data: HexString; // The actual bytes of the request, encoded as a hex string
}
