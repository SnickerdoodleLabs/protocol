import {
  ConsentContractError,
  EVMAccountAddress,
  IpfsCID,
  TokenIdNumber,
  TokenUri,
  Signature,
  ConsentToken,
  RequestForData,
  BlockNumber,
} from "@snickerdoodlelabs/objects";
import { EventFilter, Event } from "ethers";
import { ResultAsync } from "neverthrow";

import { ContractOverrides } from "@contracts-sdk/interfaces/objects/ContractOverrides";

export interface IConsentContract {
  /**
   * Create a consent token owned by the signer
   * @param tokenId randomly generated token id
   * @param agreementURI token uri data
   * @param contractOverrides for overriding transaction gas object
   */
  optIn(
    tokenId: TokenIdNumber,
    agreementURI: TokenUri,
    contractOverrides?: ContractOverrides,
  ): ResultAsync<void, ConsentContractError>;

  /**
   * Create a consent token with providing the business signature
   * @param tokenId randomly generated token id
   * @param agreementURI token uri data
   * @param nonce nonce to verify the signature
   * @param signature business or consent contract owner signature
   * @param contractOverrides for overriding transaction gas object
   */
  restrictedOptIn(
    tokenId: TokenIdNumber,
    agreementURI: TokenUri,
    nonce: number,
    signature: Signature,
    contractOverrides?: ContractOverrides,
  ): ResultAsync<void, ConsentContractError>;

  /**
   * Submit for blockchain requestForData event
   * @param ipfsCID ipfs conent id of a query
   */
  requestForData(ipfsCID: IpfsCID): ResultAsync<void, ConsentContractError>;

  /**
   * Returns address of the consent contract owner (admin)
   */
  getConsentOwner(): ResultAsync<EVMAccountAddress, ConsentContractError>;

  /**
   * Returns the number of consent tokens owned by a specific address
   * @param address owner address
   */
  balanceOf(
    address: EVMAccountAddress,
  ): ResultAsync<number, ConsentContractError>;

  /**
   * Returns the token uri for a specific token Id
   * @param tokenId token Id
   */
  tokenURI(tokenId: TokenIdNumber): ResultAsync<TokenUri, ConsentContractError>;

  /**
   * Returns a topic event object that can be fetched for events logs
   * @param eventFilter event filer
   */
  queryFilter(
    eventFilter: EventFilter,
    fromBlock?: BlockNumber,
    toBlock?: BlockNumber,
  ): ResultAsync<Event[], ConsentContractError>;

  /**
   * Returns a consent tokens owned by address
   * @param ownerAddress owner address
   */
  getConsentTokensOfAddress(
    ownerAddress: EVMAccountAddress,
  ): ResultAsync<ConsentToken[], ConsentContractError>;

  /**
   * Returns a list of RequestForData events between two block numbers
   * @param requesterAddress owner address of the request
   * @param fromBlock from block number
   * @param toBlock to block number
   */
  getRequestForDataListByRequesterAddress(
    requesterAddress: EVMAccountAddress,
    fromBlock?: BlockNumber,
    toBlock?: BlockNumber,
  ): ResultAsync<RequestForData[], ConsentContractError>;

  filters: IConsentContractFilters;
}

interface IConsentContractFilters {
  Transfer(
    fromAddress: EVMAccountAddress | null,
    toAddress: EVMAccountAddress | null,
  ): ResultAsync<EventFilter, ConsentContractError>;

  RequestForData(
    ownerAddress: EVMAccountAddress,
  ): ResultAsync<EventFilter, ConsentContractError>;
}

export const IConsentContractType = Symbol.for("IConsentContract");
