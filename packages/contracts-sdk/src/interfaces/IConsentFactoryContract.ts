import { ContractOverrides } from "@contracts-sdk/interfaces/objects/ContractOverrides";
import {
  ConsentFactoryContractError,
  EVMAccountAddress,
  EVMContractAddress,
  HexString,
} from "@snickerdoodlelabs/objects";
import { BigNumber } from "ethers";
import { ResultAsync } from "neverthrow";

export interface IConsentFactoryContract {
  /**
   * Creates a consent contract for user
   * @param ownerAddress Address of the owner of the Consent contract instance
   * @param baseUri Base uri for the for the Consent contract instance
   * @param overrides Any transaction call overrides
   */
  createConsent(
    ownerAddress: EVMAccountAddress,
    baseUri: string,
    overrides?: ContractOverrides,
  ): ResultAsync<void, ConsentFactoryContractError>;

  /**
   *  Return the number Consent addresses that user has deployed
   * @param owneraddress Address of the user
   */
  getUserDeployedConsentsCount(
    owneraddress: EVMAccountAddress,
  ): ResultAsync<BigNumber, ConsentFactoryContractError>;

  /**
   *  Return the an array of Consent addresses that user has deployed
   * @param owneraddress Address of the user
   * @param startingIndex Starting array index to query
   * @param endingIndex Ending array index to query
   */
  getUserDeployedConsentsByIndex(
    ownerAddress: EVMAccountAddress,
    startingIndex: number,
    endingIndex: number,
  ): ResultAsync<EVMContractAddress[], ConsentFactoryContractError>;

  /**
   *  Return the number Consent addresses that user has opted in
   * @param owneraddress Address of the user
   */
  getUserConsentAddressesCount(
    owneraddress: EVMAccountAddress,
  ): ResultAsync<BigNumber, ConsentFactoryContractError>;

  /**
   *  Return the an array of Consent addresses that user has opted in
   * @param owneraddress Address of the user
   * @param startingIndex Starting array index to query
   * @param endingIndex Ending array index to query
   */
  getUserConsentAddressesByIndex(
    ownerAddress: EVMAccountAddress,
    startingIndex: number,
    endingIndex: number,
  ): ResultAsync<EVMContractAddress[], ConsentFactoryContractError>;

  /**
   *  Return the number Consent addresses that user has specific roles for
   * @param owneraddress Address of the user
   * @param role The queried role
   */
  getUserRoleAddressesCount(
    owneraddress: EVMAccountAddress,
    role: HexString,
  ): ResultAsync<BigNumber, ConsentFactoryContractError>;

  /**
   *  Return the an array of Consent addresses that user has specific roles for
   * @param owneraddress Address of the user
   * @param role The queried role
   * @param startingIndex Starting array index to query
   * @param endingIndex Ending array index to query
   */
  getUserRoleAddressesCountByIndex(
    ownerAddress: EVMAccountAddress,
    role: HexString,
    startingIndex: number,
    endingIndex: number,
  ): ResultAsync<EVMContractAddress[], ConsentFactoryContractError>;

  // Check if still needed, this function queries the ConsentDeployed() event to obtain consent addresses
  /* getConsentsDeployedByOwner(
    ownerAddress: EVMAccountAddress,
  ): ResultAsync<EVMContractAddress[], ConsentFactoryContractError>; */
}

export const IConsentFactoryContractType = Symbol.for(
  "IConsentFactoryContract",
);
