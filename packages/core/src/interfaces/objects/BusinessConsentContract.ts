import { EVMContractAddress } from "@snickerdoodlelabs/objects";

export class BusinessConsentContract {
  public constructor(
    public contractAddress: EVMContractAddress,
    public consentName: string,
  ) {}
}
