import {
  ChainId,
  EVMContractAddress,
  ProviderUrl,
} from "@snickerdoodlelabs/objects";
export class ChainInformation {
  constructor(
    public name: string,
    public chainId: ChainId,
    public providerUrls: ProviderUrl[],
    public metatransactionForwarderAddress: EVMContractAddress,
  ) {}
}
