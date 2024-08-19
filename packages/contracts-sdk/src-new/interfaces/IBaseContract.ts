import { EVMContractAddress } from "@snickerdoodlelabs/objects";

export interface IBaseContract {
  getContractAddress(): EVMContractAddress;
}
