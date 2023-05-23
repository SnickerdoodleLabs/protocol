import {
  EVMAccountAddress,
  CrumbsContractError,
  TokenId,
  TokenUri,
  HexString,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { ResultAsync } from "neverthrow";

import { IBaseContract } from "@contracts-sdk/interfaces/IBaseContract.js";
import { ContractOverrides } from "@contracts-sdk/interfaces/objects/index.js";

export interface ICrumbsContract extends IBaseContract {
  /**
   * Gets the token id mapped to a particular account address, returns 0 if no such token exists
   * @param accountAddress the owner account address
   * @param contractOverrides for overriding transaction gas object
   */
  addressToCrumbId(
    accountAddress: EVMAccountAddress,
    contractOverrides?: ContractOverrides,
  ): ResultAsync<TokenId | null, CrumbsContractError>;

  /**
   * Gets the token URI value for the crumb owned by a particular account address
   * transaction reverts with error 'ERC721Metadata: URI query for nonexistent token' if token id does not exist
   * @param tokenId the token id to query
   * @param contractOverrides for overriding transaction gas object
   */
  tokenURI(
    tokenId: TokenId,
    contractOverrides?: ContractOverrides,
  ): ResultAsync<TokenUri | null, CrumbsContractError>;

  /**
   * Creates a crumb id for the address calling the contract
   * @param crumbId the crumb id / token id
   * @param mask the mask of the private key
   */
  createCrumb(
    crumbId: TokenId,
    tokenUri: TokenUri,
    contractOverrides?: ContractOverrides,
  ): ResultAsync<void, CrumbsContractError>;

  /**
   * Returns an encoded call to createCrumb. Useful for metatransactions
   * @param crumbId
   * @param crumbContent
   */
  encodeCreateCrumb(crumbId: TokenId, crumbContent: TokenUri): HexString;

  /**
   * Burns the crumb id belonging to the function caller
   * @param crumbId the crumb id / token id
   */
  burnCrumb(
    crumbId: TokenId,
    contractOverrides?: ContractOverrides,
  ): ResultAsync<void, CrumbsContractError>;

  encodeBurnCrumb(crumbId: TokenId): HexString;
}

export const ICrumbsContractType = Symbol.for("ICrumbsContract");
