import { BigNumber, ethers } from "ethers";
import { ResultAsync } from "neverthrow";
import {
  ConsentFactoryContractError,
  ConsentName,
  EVMAccountAddress,
  EVMContractAddress,
} from "@snickerdoodlelabs/objects";

import { ContractOverrides } from "@contracts-sdk/interfaces/objects/ContractOverrides";

export interface IConsentFactoryContract {
  createConsent(
    ownerAddress: EVMAccountAddress,
    baseUri: string,
    consentName: ConsentName,
    overrides?: ContractOverrides,
  ): ResultAsync<EVMContractAddress, ConsentFactoryContractError>;

  getConsentsDeployedByOwner(
    ownerAddress: EVMAccountAddress,
  ): ResultAsync<EVMContractAddress[], ConsentFactoryContractError>;
}

export const IConsentFactoryContractType = Symbol.for(
  "IConsentFactoryContract",
);
