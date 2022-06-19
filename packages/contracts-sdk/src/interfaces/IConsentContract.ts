import { ResultAsync } from "neverthrow";
import {
  ConsentContractError,
  EthereumAccountAddress,
  IpfsCID,
  TokenIdNumber,
  TokenUri,
  Signature,
  ConsentToken,
} from "@snickerdoodlelabs/objects";

import { ContractOverrides } from "@contracts-sdk/interfaces/objects/ContractOverrides";
import { EventFilter, Event } from "ethers";

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
  getConsentOwner(): ResultAsync<EthereumAccountAddress, ConsentContractError>;

  /**
   * Returns the number of consent tokens owned by a specific address
   * @param address owner address
   */
  balanceOf(
    address: EthereumAccountAddress,
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
  ): ResultAsync<Event[], ConsentContractError>;

  /**
   * Returns a consent tokens owned by address
   * @param ownerAddress owner address
   */
  getConsentTokensOfAddress(
    ownerAddress: EthereumAccountAddress,
  ): ResultAsync<ConsentToken[], ConsentContractError>;

  filters: IConentContractFilters;
}

interface IConentContractFilters {
  Transfer(
    fromAddress: EthereumAccountAddress | null,
    toAddress: EthereumAccountAddress | null,
  ): ResultAsync<EventFilter, ConsentContractError>;
}

export const IConsentContractType = Symbol.for("IConsentContract");
