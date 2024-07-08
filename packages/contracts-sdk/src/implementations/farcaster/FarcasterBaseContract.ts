import { HubAsyncResult, NobleEd25519Signer } from "@farcaster/hub-nodejs";
import {
  EVMContractAddress,
  BlockchainCommonErrors,
  EChain,
  ChainId,
  getChainInfoByChain,
  UnexpectedNetworkError,
  EVMAccountAddress,
  SignerUnavailableError,
  ED25519PublicKey,
} from "@snickerdoodlelabs/objects";
import { Network, ethers } from "ethers";
import { injectable } from "inversify";
import { ResultAsync, errAsync, okAsync } from "neverthrow";

import { BaseContract } from "@contracts-sdk/implementations/BaseContract.js";
@injectable()
export abstract class FarcasterBaseContract<
  TContractSpecificError,
> extends BaseContract<TContractSpecificError> {
  constructor(
    protected providerOrSigner: ethers.Provider | ethers.Signer,
    protected contractAddress: EVMContractAddress,
    protected abi: ethers.InterfaceAbi,
  ) {
    super(providerOrSigner, contractAddress, abi);
  }

  public ensureOptimism(): ResultAsync<
    void,
    TContractSpecificError | BlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      this.providerOrSigner.provider?.getNetwork() as Promise<Network>,
      (e) => {
        return this.generateError(e, "Unable to call price()");
      },
    ).andThen((network) => {
      if (
        ChainId(Number(network.chainId)) !=
        getChainInfoByChain(EChain.Optimism).chainId
      ) {
        return errAsync(
          new UnexpectedNetworkError(
            "Provider or signer is not for Optimism Chain",
            "FarcasterContractBase: ensureOptimism()",
          ),
        );
      }
      return okAsync(undefined);
    });
  }

  public getNobleED25519Signer(
    ownerWallet: ethers.Wallet,
  ): ResultAsync<
    NobleEd25519Signer,
    TContractSpecificError | BlockchainCommonErrors
  > {
    return this.ensureHasSigner("getNobleED25519Signer")
      .andThen((ethersSigner) => {
        // Instance has a signer, get its address
        return ResultAsync.fromPromise(
          ethersSigner.getAddress() as Promise<EVMAccountAddress>,
          (e) => {
            return e as TContractSpecificError;
          },
        );
      })
      .andThen((signerAddress) => {
        // Ensure the signer's address matches the address of the wallet provided
        // Only the wallet is allowed to get its own signer
        if (ownerWallet.address != signerAddress) {
          return errAsync(
            new SignerUnavailableError(
              "Ethers Wallet provided does not match instance's signer",
            ),
          );
        }

        return okAsync(
          new NobleEd25519Signer(ethers.getBytes(ownerWallet.privateKey)),
        );
      });
  }

  public getNobleED25519SignerPublicKKey(
    ownerWallet: ethers.Wallet,
  ): ResultAsync<
    ED25519PublicKey,
    TContractSpecificError | BlockchainCommonErrors
  > {
    return this.getNobleED25519Signer(ownerWallet).andThen((edSigner) => {
      return ResultAsync.fromPromise(
        edSigner.getSignerKey() as HubAsyncResult<Uint8Array>,
        (e) => {
          return e as TContractSpecificError;
        },
      ).andThen((signerKey) => {
        if (signerKey.isOk()) {
          return okAsync(ED25519PublicKey(ethers.hexlify(signerKey.value)));
        }
        return errAsync(
          new SignerUnavailableError(
            "Unable to obtain NobleED25519Signer's public key",
          ),
        );
      });
    });
  }
}
