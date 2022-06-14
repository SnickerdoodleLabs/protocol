import { BigNumber, ethers } from "ethers";
import { ResultAsync } from "neverthrow";
import {
  ConsentFactoryContractError,
  ConsentName,
  EthereumAccountAddress,
  EthereumContractAddress,
} from "@snickerdoodlelabs/objects";

import { ContractOverrides } from "@contracts-sdk/interfaces/objects/ContractOverrides";

export interface IConsentFactoryContract {
  createConsent(
    ownerAddress: EthereumAccountAddress,
    baseUri: string,
    consentName: ConsentName,
    overrides?: ContractOverrides,
  ): ResultAsync<EthereumContractAddress, ConsentFactoryContractError>;

  getConsentsDeployedByOwner(
    ownerAddress: EthereumAccountAddress,
  ): ResultAsync<EthereumContractAddress[], ConsentFactoryContractError>;
}

export const IConsentFactoryContractType = Symbol.for(
  "IConsentFactoryContract",
);
