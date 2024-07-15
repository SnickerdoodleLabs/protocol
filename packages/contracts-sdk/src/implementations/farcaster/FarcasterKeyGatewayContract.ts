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
  FarcasterKeyGatewayAddKeySignature,
  UnexpectedNetworkError,
  ED25519PublicKey,
} from "@snickerdoodlelabs/objects";
import { ParamType, TypedDataField, ethers } from "ethers";
import { injectable } from "inversify";
import { ResultAsync, errAsync, okAsync } from "neverthrow";

import { BaseContract } from "@contracts-sdk/implementations/BaseContract.js";
import { IEthersContractError } from "@contracts-sdk/implementations/BlockchainErrorMapper.js";
import {
  ContractOverrides,
  IFarcasterKeyGatewayContract,
  WrappedTransactionResponse,
} from "@contracts-sdk/interfaces/index.js";
import {
  ContractsAbis,
  SignedKeyRequest,
} from "@contracts-sdk/interfaces/objects/index.js";
import { FarcasterKeyGatewayAddKeyMessage, FarcasterKeyGatewayAddKeySignatureParams, FarcasterKeyGatewayEIP712AddTypes, FarcasterKeyGatewayEIP712Domain } from "@contracts-sdk/interfaces/objects/farcaster/index.js";

@injectable()
export class FarcasterKeyGatewayContract
  extends BaseContract<FarcasterKeyGatewayContractError>
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
    return ResultAsync.fromPromise(
      this.contract.nonces(address) as Promise<bigint>,
      (e) => {
        return this.generateError(e, "Unable to call nonces()");
      },
    );
  }

  public add(
    keyToAdd: ED25519PublicKey,
    encodedMetadata: FarcasterEncodedSignedKeyRequestMetadata, // obtained from getEncodedSignedKeyRequestMetadata()
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    FarcasterKeyGatewayContractError | BlockchainCommonErrors
  > {
    // Based on the docs, only keyType and metadataType of 1 is supported at the moment
    // https://docs.farcaster.xyz/reference/contracts/reference/key-gateway#add
    return this.assureSigner("add").andThen(() => {
      return this.writeToContract(
        "add",
        [
          1,
          ethers.hexlify(ethers.toUtf8Bytes(keyToAdd)),
          1,
          ethers.hexlify(ethers.toUtf8Bytes(encodedMetadata)),
        ],
        overrides,
      );
    });
  }

  // Called by third party on behalf of an fid
  // Called by the owner's EW to sign a 'Register' signature
  // The signature and encodedMetadata for the 'Add' function must first be obtained using the wallet owning the fid via getSignedKeyRequestSignatureAndEncodedMetadata()
  public addFor(
    fidOwnerAddress: EVMAccountAddress,
    keyToAdd: ED25519PublicKey,
    encodedMetadata: FarcasterEncodedSignedKeyRequestMetadata,
    deadline: UnixTimestamp,
    signature: FarcasterKeyGatewayAddKeySignature,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    FarcasterKeyGatewayContractError | BlockchainCommonErrors
  > {
    // Based on the docs, only keyType and metadataType of 1 are supported at the moment
    // https://docs.farcaster.xyz/reference/contracts/reference/key-gateway#addfor

    return this.assureSigner("addFor").andThen(() => {
      return this.writeToContract(
        "addFor",
        [
          fidOwnerAddress,
          1, // 1 is the only key type for now
          keyToAdd, // the key to be registered - doesn't have to be same key as mainUser, could be a newly generated key
          1, // 1 is the only key type for now
          encodedMetadata,
          deadline,
          signature,
        ],
        overrides,
      );
    });
  }

  // Returns the signature params for 'Add' signature to be signed on Farcaster app by the user via signTypedData() (refer to getAddSignature())
  // The encodedMetadata can be obtained from getSignedKeyRequestSignatureAndEncodedMetadata() which is first signed by the EW
  public getAddSignatureParams(
    ownerAddress: EVMAccountAddress,
    keyToAdd: ED25519PublicKey,
    encodedMetadata: FarcasterEncodedSignedKeyRequestMetadata,
    deadline: UnixTimestamp,
  ): ResultAsync<
  FarcasterKeyGatewayAddKeySignatureParams,
  FarcasterKeyGatewayContractError | BlockchainCommonErrors
  > {
    return this.nonces(ownerAddress).map((latestNonce) => {
        const addKeyMessage = new FarcasterKeyGatewayAddKeyMessage (
            ownerAddress,
            1,
            keyToAdd,
            1,
            encodedMetadata,
            latestNonce,
            deadline,
        )

        return new FarcasterKeyGatewayAddKeySignatureParams(
            new FarcasterKeyGatewayEIP712Domain(),
            this.removeReadonlyFromReadonlyTypes(
                KEY_GATEWAY_EIP_712_TYPES.types,
            ) as FarcasterKeyGatewayEIP712AddTypes,
            addKeyMessage,
        )

        });
  }

  public getAddSignature(
    ownerAddress: EVMAccountAddress,
    keyToAdd: ED25519PublicKey,
    encodedMetadata: FarcasterEncodedSignedKeyRequestMetadata,
    deadline: UnixTimestamp,
  ): ResultAsync<
    FarcasterKeyGatewayAddKeySignature,
    FarcasterKeyGatewayContractError | BlockchainCommonErrors
  > {
    return this.assureSigner("getAddSignature").andThen((signer) => {
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
          signer.signTypedData(
            KEY_GATEWAY_EIP_712_TYPES.domain,
            this.removeReadonlyFromReadonlyTypes(
              KEY_GATEWAY_EIP_712_TYPES.types,
            ),
            addKeyMessage,
          ) as Promise<FarcasterKeyGatewayAddKeySignature>,
          (e) => {
            return e as FarcasterKeyGatewayContractError;
          },
        );
      });
    });
  }

  public getSignedKeyRequestSignatureAndEncodedMetadata(
    ownerFid: FarcasterUserId,
    ownerEVMAddress: EVMAccountAddress,
    keyToAdd: ED25519PublicKey,
    deadline: UnixTimestamp,
  ): ResultAsync<
    SignedKeyRequest,
    FarcasterKeyGatewayContractError | BlockchainCommonErrors
  > {
    return this.assureSigner(
      "getSignedKeyRequestSignatureAndEncodedMetadata",
    ).andThen(() => {
      return this.getSignedKeyRequestSignature(
        ownerFid,
        keyToAdd,
        deadline,
      ).andThen((metadataSignature) => {
        const metadataStruct = {
          requestFid: ownerFid,
          requestSigner: ownerEVMAddress,
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

        if (metadataStructType.components == null) {
          return errAsync(
            new UnexpectedNetworkError(
              "fail to encode",
              "getSignedKeyRequestSignatureAndEncodedMetadata",
            ),
          );
        }

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
    keyToAdd: ED25519PublicKey, // key to be tied to account
    deadline: UnixTimestamp,
  ): ResultAsync<
    FarcasterSignedKeyRequestSignature,
    FarcasterKeyGatewayContractError | BlockchainCommonErrors
  > {
    return this.assureSigner("getSignedKeyRequestSignature").andThen(
      (signer) => {
        //    https://docs.farcaster.xyz/reference/contracts/reference/signed-key-request-validator#signedkeyrequestmetadata-struct
        //    Needs to be a EIP712 signature

        const metadataMessage = {
          requestFid: ownerFid,
          key: keyToAdd,
          deadline: deadline,
        };

        return ResultAsync.fromPromise(
          signer.signTypedData(
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
      },
    );
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
