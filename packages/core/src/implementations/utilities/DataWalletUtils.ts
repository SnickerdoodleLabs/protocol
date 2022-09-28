import {
  ICryptoUtils,
  ICryptoUtilsType,
} from "@snickerdoodlelabs/common-utils";
import {
  EVMPrivateKey,
  Signature,
  AESKey,
  HexString,
  AccountAddress,
  ExternallyOwnedAccount,
  EChain,
  chainConfig,
  ChainId,
  EChainTechnology,
  SolanaAccountAddress,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";

import { IDataWalletUtils } from "@core/interfaces/utilities/index.js";

@injectable()
export class DataWalletUtils implements IDataWalletUtils {
  public constructor(
    @inject(ICryptoUtilsType) protected cryptoUtils: ICryptoUtils,
  ) {}

  public createDataWalletKey(): ResultAsync<EVMPrivateKey, never> {
    return this.cryptoUtils.createEthereumPrivateKey();
  }

  public deriveEncryptionKeyFromSignature(
    accountAddress: AccountAddress,
    signature: Signature,
  ): ResultAsync<AESKey, never> {
    // The only hard thing here is the salt. I am just using a constant value for now.
    // TODO: Figure out if there is a better salt we can use
    return this.cryptoUtils.deriveAESKeyFromSignature(
      signature,
      HexString(accountAddress),
    );
  }

  public getDerivedEVMAccountFromSignature(
    accountAddress: AccountAddress,
    signature: Signature,
  ): ResultAsync<ExternallyOwnedAccount, never> {
    return this.cryptoUtils
      .deriveEVMPrivateKeyFromSignature(signature, HexString(accountAddress))
      .map((derivedEVMKey) => {
        const derivedEVMAccountAddress =
          this.cryptoUtils.getEthereumAccountAddressFromPrivateKey(
            derivedEVMKey,
          );
        return new ExternallyOwnedAccount(
          derivedEVMAccountAddress,
          derivedEVMKey,
        );
      });
  }

  public verifySignature(
    chain: EChain,
    accountAddress: AccountAddress,
    signature: Signature,
    message: string,
  ): ResultAsync<boolean, never> {
    const chainInfo = chainConfig.get(ChainId(chain));

    if (chainInfo == null) {
      throw new Error();
    }

    // The signature has to be verified based on the chain technology
    if (chainInfo.chainTechnology == EChainTechnology.EVM) {
      return this.cryptoUtils
        .verifyEVMSignature(message, signature)
        .map((verifiedAccountAddress) => {
          return verifiedAccountAddress == accountAddress;
        });
    }
    if (chainInfo.chainTechnology == EChainTechnology.Solana) {
      return this.cryptoUtils.verifySolanaSignature(
        message,
        signature,
        accountAddress as SolanaAccountAddress,
      );
    }

    // No match for the chain technology!
    throw new Error(`Unknown chainTechnology ${chainInfo.chainTechnology}`);
  }
}
