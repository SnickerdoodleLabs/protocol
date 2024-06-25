import {
  SIGNED_KEY_REQUEST_VALIDATOR_EIP_712_TYPES,
  KEY_GATEWAY_EIP_712_TYPES,
} from "@farcaster/hub-nodejs";
import {
  EVMAccountAddress,
  EVMContractAddress,
  BlockchainCommonErrors,
  UnixTimestamp,
  FarcasterKeyGatewayContractError,
  FarcasterId,
  SignedKeyRequestSignature,
  EncodedSignedKeyRequestMetadata,
  SignedAddSignature,
} from "@snickerdoodlelabs/objects";
import { ParamType, TypedDataField, ethers } from "ethers";
import { injectable } from "inversify";
import { ResultAsync, okAsync } from "neverthrow";

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

@injectable()
export class FarcasterKeyGatewayContract
  extends BaseContract<FarcasterKeyGatewayContractError>
  implements IFarcasterKeyGatewayContract
{
  constructor(
    protected providerOrSigner: ethers.Provider | ethers.Signer,
    protected contractAddress: EVMContractAddress,
  ) {
    super(
      providerOrSigner,
      contractAddress,
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
    key: string,
    encodedMetadata: string, // obtained from getEncodedSignedKeyRequestMetadata()
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    FarcasterKeyGatewayContractError | BlockchainCommonErrors
  > {
    // Based on the docs, only keyType and metadataType of 1 is supported at the moment
    // https://docs.farcaster.xyz/reference/contracts/reference/key-gateway#add
    return this.writeToContract("add", [1, key, 1, encodedMetadata], overrides);
  }

  // Called by third party on behalf of an fid
  // Called by the owner's EW to sign a 'Register' signature
  // The signature and encodedMetadata for the 'Add' function must first be obtained using the wallet owning the fid via getSignedKeyRequestSignatureAndEncodedMetadata()
  public addFor(
    fidOwnerAddress: EVMAccountAddress,
    keyToAdd: string,
    encodedMetadata: string,
    deadline: UnixTimestamp,
    signature: SignedAddSignature,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    FarcasterKeyGatewayContractError | BlockchainCommonErrors
  > {
    // Based on the docs, only keyType and metadataType of 1 are supported at the moment
    // https://docs.farcaster.xyz/reference/contracts/reference/key-gateway#addfor
    const keyGatewayAddForParams = {
      keyType: 1, // 1 is the only key type for now
      key: keyToAdd, // the key to be registered - doesn't have to be same key as mainUser, could be a newly generated key
      metadataType: 1,
      metadata: encodedMetadata,
      sig: signature,
      deadline: deadline,
    };

    return this.writeToContract(
      "addFor",
      [
        fidOwnerAddress,
        keyGatewayAddForParams.keyType,
        keyGatewayAddForParams.key,
        keyGatewayAddForParams.metadataType,
        keyGatewayAddForParams.metadata,
        keyGatewayAddForParams.sig,
        keyGatewayAddForParams.deadline,
      ],
      overrides,
    );
  }

  public getAddSignature(
    ownerAddress: EVMAccountAddress,
    keyToAdd: EVMAccountAddress,
    encodedMetadata: EncodedSignedKeyRequestMetadata,
    deadline: UnixTimestamp,
  ): ResultAsync<
    SignedAddSignature,
    FarcasterKeyGatewayContractError | BlockchainCommonErrors
  > {
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

      const signer = this.providerOrSigner as ethers.Signer;

      return ResultAsync.fromPromise(
        signer.signTypedData(
          KEY_GATEWAY_EIP_712_TYPES.domain,
          this.removeReadonlyFromReadonlyTypes(KEY_GATEWAY_EIP_712_TYPES.types),
          addKeyMessage,
        ) as Promise<SignedAddSignature>,
        (e) => {
          return e as FarcasterKeyGatewayContractError;
        },
      );
    });
  }

  public getSignedKeyRequestSignatureAndEncodedMetadata(
    ownerFid: FarcasterId,
    keyToAdd: EVMAccountAddress, // key to be tied to account
    deadline: UnixTimestamp,
  ): ResultAsync<SignedKeyRequest, FarcasterKeyGatewayContractError> {
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
          SignedKeyRequestSignature(metadataSignature),
          EncodedSignedKeyRequestMetadata(encodedMetadataStruct),
        ),
      );
    });
  }

  // Returns SignedKeyRequestSignature
  public getSignedKeyRequestSignature(
    ownerFid: FarcasterId,
    keyToAdd: EVMAccountAddress, // key to be tied to account
    deadline: UnixTimestamp,
  ): ResultAsync<SignedKeyRequestSignature, FarcasterKeyGatewayContractError> {
    //    https://docs.farcaster.xyz/reference/contracts/reference/signed-key-request-validator#signedkeyrequestmetadata-struct
    //    Needs to be a EIP712 signature
    const metadataMessage = {
      requestFid: ownerFid,
      key: keyToAdd,
      deadline,
    };

    // Use the wallet of the sdk caller as the signer
    const signer = this.providerOrSigner as ethers.Signer;

    return ResultAsync.fromPromise(
      signer.signTypedData(
        SIGNED_KEY_REQUEST_VALIDATOR_EIP_712_TYPES.domain,
        this.removeReadonlyFromReadonlyTypes(
          SIGNED_KEY_REQUEST_VALIDATOR_EIP_712_TYPES.types,
        ),
        metadataMessage,
      ) as Promise<SignedKeyRequestSignature>,
      (e) => {
        return e as FarcasterKeyGatewayContractError;
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
