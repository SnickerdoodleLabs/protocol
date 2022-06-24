import { EthereumContractAddress } from "@snickerdoodlelabs/objects";

export class BusinessConsentContract {
  public constructor(
    public contractAddress: EthereumContractAddress,
    public consentName: string,
  ) {}
}
