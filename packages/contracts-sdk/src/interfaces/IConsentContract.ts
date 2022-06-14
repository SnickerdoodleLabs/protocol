import { BigNumber, ethers } from "ethers";
import { ResultAsync } from "neverthrow";
import {
  ConsentContractError,
  EthereumAccountAddress,
  IpfsCID,
  OptInTokenId,
  OptInTokenUri,
  Signature,
} from "@snickerdoodlelabs/objects";

import { ContractOverrides } from "@contracts-sdk/interfaces/objects/ContractOverrides";

export interface IConsentContract {
  optIn(
    tokenId: OptInTokenId,
    agreementURI: OptInTokenUri,
    contractOverrides?: ContractOverrides,
  ): ResultAsync<void, ConsentContractError>;

  restrictedOptIn(
    tokenId: OptInTokenId,
    agreementURI: OptInTokenUri,
    nonce: number,
    signature: Signature,
    contractOverrides?: ContractOverrides,
  ): ResultAsync<void, ConsentContractError>;

  requestForData(ipfsCID: IpfsCID): ResultAsync<void, ConsentContractError>;

  getConsentOwner(): ResultAsync<EthereumAccountAddress, ConsentContractError>;
}

export const IConsentContractType = Symbol.for("IConsentContract");
