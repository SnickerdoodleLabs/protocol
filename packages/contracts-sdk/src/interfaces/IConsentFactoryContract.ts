import {
  BaseURI,
  BigNumberString,
  ConsentFactoryContractError,
  ConsentName,
  EVMAccountAddress,
  EVMContractAddress,
  MarketplaceListing,
  MarketplaceTag,
  BlockchainCommonErrors,
  TransactionResponseError,
  IpfsCID,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { EConsentRoles } from "@contracts-sdk/interfaces/enums/index.js";
import { IBaseContract } from "@contracts-sdk/interfaces/IBaseContract.js";
import { IERC7529Contract } from "@contracts-sdk/interfaces/IERC7529Contract.js";
import {
  WrappedTransactionResponse,
  ContractOverrides,
} from "@contracts-sdk/interfaces/objects/index.js";

export interface IConsentFactoryContract
  extends IBaseContract,
    IERC7529Contract<ConsentFactoryContractError> {
  /**
   * Creates a consent contract for user
   * @param ownerAddress Address of the owner of the Consent contract instance
   * @param baseUri Base uri for the for the Consent contract instance
   * @param name Name for the for the Consent contract instance
   * @param overrides Any transaction call overrides
   */
  createConsent(
    ownerAddress: EVMAccountAddress,
    baseUri: BaseURI,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentFactoryContractError
  >;

  /**
   *  Return the amount of gas required to create a Consent contract
   * @param ownerAddress Address of the user
   * @param baseUri URI for consent contract
   * @param name Name of the consent contract
   */
  estimateGasToCreateConsent(
    ownerAddress: EVMAccountAddress,
    baseUri: BaseURI,
    name: ConsentName,
  ): ResultAsync<bigint, ConsentFactoryContractError | BlockchainCommonErrors>;

  /**
   *  Return Consent addresses by checking ContractDeployed event logs
   */
  getDeployedConsents(): ResultAsync<
    EVMContractAddress[],
    ConsentFactoryContractError | BlockchainCommonErrors
  >;

  /**
   * Returns the number of seconds that a listing will be active for
   */
  listingDuration(): ResultAsync<
    number,
    ConsentFactoryContractError | BlockchainCommonErrors
  >;

  getMaxTagsPerListing(): ResultAsync<
    number,
    ConsentFactoryContractError | BlockchainCommonErrors
  >;

  getGovernanceToken(): ResultAsync<
    EVMContractAddress,
    ConsentFactoryContractError | BlockchainCommonErrors
  >;

  isStakingToken(
    stakingToken: EVMContractAddress,
  ): ResultAsync<boolean, ConsentFactoryContractError | BlockchainCommonErrors>;

  getListingDuration(): ResultAsync<
    number,
    ConsentFactoryContractError | BlockchainCommonErrors
  >;

  setListingDuration(
    listingDuration: number,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentFactoryContractError
  >;

  setMaxTagsPerListing(
    maxTagsPerListing: number,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentFactoryContractError
  >;

  registerStakingToken(
    stakingToken: EVMContractAddress,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentFactoryContractError
  >;

  adminRemoveListings(
    tag: MarketplaceTag,
    stakingToken: EVMContractAddress,
    removedSlot: BigNumberString[],
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentFactoryContractError
  >;

  blockContentObject(
    stakingToken: EVMContractAddress,
    contentAddress: EVMContractAddress,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentFactoryContractError
  >;

  unblockContentObject(
    stakingToken: EVMContractAddress,
    contentAddress: EVMContractAddress,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentFactoryContractError
  >;

  getListingsByTag(
    tag: MarketplaceTag,
    stakingToken: EVMContractAddress,
    removeExpired: boolean,
  ): ResultAsync<
    MarketplaceListing[],
    ConsentFactoryContractError | BlockchainCommonErrors
  >;

  getListingsForward(
    tag: MarketplaceTag,
    stakingToken: EVMContractAddress,
    startingSlot: BigNumberString,
    numberOfSlots: number,
    removeExpired: boolean,
  ): ResultAsync<
    MarketplaceListing[],
    ConsentFactoryContractError | BlockchainCommonErrors
  >;

  getListingsBackward(
    tag: MarketplaceTag,
    stakingToken: EVMContractAddress,
    startingSlot: BigNumberString,
    numberOfSlots: number,
    removeExpired: boolean,
  ): ResultAsync<
    MarketplaceListing[],
    ConsentFactoryContractError | BlockchainCommonErrors
  >;

  getTagTotal(
    tag: MarketplaceTag,
    stakingToken: EVMContractAddress,
  ): ResultAsync<number, ConsentFactoryContractError | BlockchainCommonErrors>;

  getAddressOfConsentCreated(
    txRes: WrappedTransactionResponse,
  ): ResultAsync<EVMContractAddress, TransactionResponseError>;

  // #region Questionnaires
  /**
   * Returns a list of all questionnaires
   */
  getQuestionnaires(): ResultAsync<
    IpfsCID[],
    ConsentFactoryContractError | BlockchainCommonErrors
  >;

  /**
   * Adds a questionnaire to the list of default questionnaires
   * Only callable by address with DEFAULT_ADMIN_ROLE
   * If domain already exists, reverts with error message "Consent : Questionnaire already added"
   * @param ipfsCid Domain name
   */
  addQuestionnaire(
    ipfsCid: IpfsCID,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentFactoryContractError
  >;

  /**
   * Removes a questionnaire from the contract storage at the index position
   * Only callable by address with DEFAULT_ADMIN_ROLE
   * If the index is out of range, this reverts with error message "Consent : Questionnaire index out of range"
   * @param index Index of the questionnaire. This must be a value between 0 and the number of questionnaires inclusive, otherwise it reverts
   */
  removeQuestionnaire(
    index: number,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentFactoryContractError
  >;
  // #endregion Questionnaires
}
