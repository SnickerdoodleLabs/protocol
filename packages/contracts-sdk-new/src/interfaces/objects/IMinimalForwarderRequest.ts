import {
  EVMAccountAddress,
  EVMContractAddress,
  HexString,
} from "@snickerdoodlelabs/objects";

export interface IMinimalForwarderRequest extends Record<string, unknown> {
  to: EVMContractAddress; // Contract address for the metatransaction
  from: EVMAccountAddress; // EOA to run the transaction as
  value: bigint; // The amount of doodle token to pay. Should be 0.
  gas: bigint; // The amount of gas to pay.
  nonce: bigint; // Nonce for the EOA, recovered from the MinimalForwarder.getNonce()
  data: HexString; // The actual bytes of the request, encoded as a hex string
}
