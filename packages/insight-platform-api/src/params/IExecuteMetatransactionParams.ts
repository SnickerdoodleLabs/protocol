import {
  BigNumberString,
  EVMAccountAddress,
  EVMContractAddress,
  HexString,
  Signature,
} from "@snickerdoodlelabs/objects";

export interface IExecuteMetatransactionParams {
  accountAddress: EVMAccountAddress;
  contractAddress: EVMContractAddress;
  nonce: BigNumberString;
  value: BigNumberString;
  gas: BigNumberString;
  data: HexString;
  metatransactionSignature: Signature;
  requestSignature: Signature;
}
