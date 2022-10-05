import {
  EVMAccountAddress,
  EVMContractAddress,
  HexString,
} from "@snickerdoodlelabs/objects";
import { BigNumber } from "ethers";

export class MetatransactionRequest {
  public constructor(
    public to: EVMContractAddress, // Contract address for the metatransaction
    public from: EVMAccountAddress, // EOA to run the transaction as
    public value: BigNumber, // The amount of doodle token to pay. Should be 0.
    public gas: BigNumber, // The amount of gas to pay.
    public nonce: BigNumber, // Nonce for the EOA, recovered from the MinimalForwarder.getNonce()
    public data: HexString, // The actual bytes of the request, encoded as a hex string
  ) {}
}
