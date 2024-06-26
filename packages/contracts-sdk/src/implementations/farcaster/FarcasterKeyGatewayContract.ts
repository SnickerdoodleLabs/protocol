import {
  SIGNED_KEY_REQUEST_VALIDATOR_EIP_712_TYPES,
  KEY_GATEWAY_EIP_712_TYPES,
  KEY_GATEWAY_ADDRESS,
} from "@farcaster/hub-nodejs";
import {
  EVMAccountAddress,
  EVMContractAddress,
  BlockchainCommonErrors,
  UnixTimestamp,
  FarcasterKeyGatewayContractError,
  FarcasterUserId,
  FarcasterSignedKeyRequestSignature,
  FarcasterEncodedSignedKeyRequestMetadata,
  FarcasterAddSignature,
  FarcasterKey,
  SignerUnavailableError,
} from "@snickerdoodlelabs/objects";
import { ParamType, TypedDataField, ethers } from "ethers";
import { injectable } from "inversify";
import { ResultAsync, errAsync, okAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { IEthersContractError } from "@contracts-sdk/implementations/BlockchainErrorMapper.js";
import { FarcasterContractBase } from "@contracts-sdk/implementations/farcaster/FarcasterContractBase.js";
import {
  ContractOverrides,
  IFarcasterKeyGatewayContract,
  WrappedTransactionResponse,
} from "@contracts-sdk/interfaces/index.js";
import {
  ContractsAbis,
  SignedKeyRequest,
} from "@contracts-sdk/interfaces/objects/index.js";

@injectable()
export class FarcasterKeyGatewayContract
  extends FarcasterContractBase<FarcasterKeyGatewayContractError>
  implements IFarcasterKeyGatewayContract
{
  constructor(protected providerOrSigner: ethers.Provider | ethers.Signer) {
    super(
      providerOrSigner,
      EVMContractAddress(KEY_GATEWAY_ADDRESS),
      ContractsAbis.FarcasterKeyGatewayAbi.abi,
    );
  }

  public nonces(
    address: EVMAccountAddress,
  ): ResultAsync<
    bigint,
    FarcasterKeyGatewayContractError | BlockchainCommonErrors
  > {
    return this.ensureOptimism().andThen(() => {
      return ResultAsync.fromPromise(
        this.contract.nonces(address) as Promise<bigint>,
        (e) => {
          return this.generateError(e, "Unable to call nonces()");
        },
      );
    });
  }

  public add(
    keyToAdd: FarcasterKey,
    encodedMetadata: FarcasterEncodedSignedKeyRequestMetadata, // obtained from getEncodedSignedKeyRequestMetadata()
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    FarcasterKeyGatewayContractError | BlockchainCommonErrors
  > {
    // Based on the docs, only keyType and metadataType of 1 is supported at the moment
    // https://docs.farcaster.xyz/reference/contracts/reference/key-gateway#add
    return ResultUtils.combine([
      this.ensureOptimism(),
      this.ensureHasSigner("add"),
    ]).andThen(() => {
      return this.writeToContract(
        "add",
        [1, keyToAdd, 1, encodedMetadata],
        overrides,
      );
    });
  }

  // Called by third party on behalf of an fid
  // Called by the owner's EW to sign a 'Register' signature
  // The signature and encodedMetadata for the 'Add' function must first be obtained using the wallet owning the fid via getSignedKeyRequestSignatureAndEncodedMetadata()
  public addFor(
    fidOwnerAddress: EVMAccountAddress,
    keyToAdd: FarcasterKey,
    encodedMetadata: FarcasterEncodedSignedKeyRequestMetadata,
    deadline: UnixTimestamp,
    signature: FarcasterAddSignature,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    FarcasterKeyGatewayContractError | BlockchainCommonErrors
  > {
    // Based on the docs, only keyType and metadataType of 1 are supported at the moment
    // https://docs.farcaster.xyz/reference/contracts/reference/key-gateway#addfor

    return ResultUtils.combine([
      this.ensureOptimism(),
      this.ensureHasSigner("addFor"),
    ]).andThen(() => {
      return this.writeToContract(
        "addFor",
        [
          fidOwnerAddress,
          1, // 1 is the only key type for now
          keyToAdd, // the key to be registered - doesn't have to be same key as mainUser, could be a newly generated key
          1, // 1 is the only key type for now
          encodedMetadata,
          signature,
          deadline,
        ],
        overrides,
      );
    });
  }

  public getAddSignature(
    ownerAddress: EVMAccountAddress,
    keyToAdd: EVMAccountAddress,
    encodedMetadata: FarcasterEncodedSignedKeyRequestMetadata,
    deadline: UnixTimestamp,
  ): ResultAsync<
    FarcasterAddSignature,
    FarcasterKeyGatewayContractError | BlockchainCommonErrors
  > {
    return ResultUtils.combine([
      this.ensureOptimism(),
      this.ensureHasSigner("getAddSignature"),
    ]).andThen(() => {
      return this.nonces(ownerAddress).andThen((latestNonce) => {
        const addKeyMessage = {
          owner: ownerAddress,
          keyType: 1,
          key: keyToAdd,
          metadataType: 1,
          metadata: encodedMetadata,
          nonce: latestNonce,
          deadline: deadline,
        };

        return ResultAsync.fromPromise(
          (this.providerOrSigner as ethers.Signer).signTypedData(
            KEY_GATEWAY_EIP_712_TYPES.domain,
            this.removeReadonlyFromReadonlyTypes(
              KEY_GATEWAY_EIP_712_TYPES.types,
            ),
            addKeyMessage,
          ) as Promise<FarcasterAddSignature>,
          (e) => {
            return e as FarcasterKeyGatewayContractError;
          },
        );
      });
    });
  }

  public getSignedKeyRequestSignatureAndEncodedMetadata(
    ownerFid: FarcasterUserId,
    keyToAdd: FarcasterKey,
    deadline: UnixTimestamp,
  ): ResultAsync<
    SignedKeyRequest,
    FarcasterKeyGatewayContractError | BlockchainCommonErrors
  > {
    return ResultUtils.combine([
      this.ensureOptimism(),
      this.ensureHasSigner("getSignedKeyRequestSignatureAndEncodedMetadata"),
    ]).andThen(() => {
      return this.getSignedKeyRequestSignature(
        ownerFid,
        keyToAdd,
        deadline,
      ).andThen((metadataSignature) => {
        const metadataStruct = {
          requestFid: ownerFid,
          requestSigner: keyToAdd,
          signature: metadataSignature,
          deadline: deadline,
        };

        const metadataStructType = ParamType.from({
          components: [
            {
              name: "requestFid",
              type: "uint256",
            },
            {
              name: "requestSigner",
              type: "address",
            },
            {
              name: "signature",
              type: "bytes",
            },
            {
              name: "deadline",
              type: "uint256",
            },
          ],
          name: "SignedKeyRequestMetadata",
          type: "tuple",
        });

        const encodedMetadataStruct = ethers.AbiCoder.defaultAbiCoder().encode(
          [metadataStructType],
          [metadataStruct],
        );

        return okAsync(
          new SignedKeyRequest(
            FarcasterSignedKeyRequestSignature(metadataSignature),
            FarcasterEncodedSignedKeyRequestMetadata(encodedMetadataStruct),
          ),
        );
      });
    });
  }

  // Returns SignedKeyRequestSignature
  public getSignedKeyRequestSignature(
    ownerFid: FarcasterUserId,
    keyToAdd: FarcasterKey, // key to be tied to account
    deadline: UnixTimestamp,
  ): ResultAsync<
    FarcasterSignedKeyRequestSignature,
    FarcasterKeyGatewayContractError | BlockchainCommonErrors
  > {
    return ResultUtils.combine([
      this.ensureOptimism(),
      this.ensureHasSigner("getSignedKeyRequestSignatureAndEncodedMetadata"),
    ]).andThen(() => {
      //    https://docs.farcaster.xyz/reference/contracts/reference/signed-key-request-validator#signedkeyrequestmetadata-struct
      //    Needs to be a EIP712 signature
      const metadataMessage = {
        requestFid: ownerFid,
        key: keyToAdd,
        deadline,
      };

      return ResultAsync.fromPromise(
        (this.providerOrSigner as ethers.Signer).signTypedData(
          SIGNED_KEY_REQUEST_VALIDATOR_EIP_712_TYPES.domain,
          this.removeReadonlyFromReadonlyTypes(
            SIGNED_KEY_REQUEST_VALIDATOR_EIP_712_TYPES.types,
          ),
          metadataMessage,
        ) as Promise<FarcasterSignedKeyRequestSignature>,
        (e) => {
          return e as FarcasterKeyGatewayContractError;
        },
      );
    });
  }

  protected removeReadonlyFromReadonlyTypes<T>(
    obj: T,
  ): Record<string, TypedDataField[]> {
    return obj as Record<string, TypedDataField[]>;
  }

  protected generateContractSpecificError(
    msg: string,
    e: IEthersContractError,
    transaction: ethers.Transaction | null,
  ): FarcasterKeyGatewayContractError {
    return new FarcasterKeyGatewayContractError(msg, e, transaction);
  }
}
