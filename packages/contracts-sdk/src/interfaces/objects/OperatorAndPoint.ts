import {
  EVMContractAddress,
  PasskeyId,
  PasskeyPublicKeyPointX,
  PasskeyPublicKeyPointY,
  EVMAccountAddress,
} from "@snickerdoodlelabs/objects";

export class OperatorAndPoint {
  public constructor(
    public operator: EVMAccountAddress | EVMContractAddress,
    public x: PasskeyPublicKeyPointX,
    public y: PasskeyPublicKeyPointY,
    public keyId: PasskeyId,
  ) {}
}
