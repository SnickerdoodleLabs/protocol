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
  EVMAccountAddress,
  EVMContractAddress,
  PasswordString,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { base58 } from "ethers/lib/utils.js";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import {
  IConfigProvider,
  IConfigProviderType,
  IDataWalletUtils,
} from "@core/interfaces/utilities/index.js";

@injectable()
export class DataWalletUtils implements IDataWalletUtils {
  public constructor(
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
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
      this.accountAddressToHex(accountAddress),
    );
  }

  public deriveEncryptionKeyFromPassword(
    password: PasswordString,
  ): ResultAsync<AESKey, never> {
    // The hard thing here is the salt.
    return ResultUtils.combine([
      this.cryptoUtils.hashStringSHA256(password),
      this.configProvider.getConfig(),
    ])
      .andThen(([hashedPassword, config]) => {
        // SHA256 is Base64 encoded. We'll combine that with the contract factory address,
        // hash it again, convert to a hexstring, and use that as the salt.
        return this.cryptoUtils.hashStringSHA256(
          hashedPassword +
            config.controlChainInformation.consentFactoryContractAddress,
        );
      })
      .andThen((hashedPassword2) => {
        const buffer = Buffer.from(hashedPassword2, "base64");
        const salt = HexString(buffer.toString("hex"));
        console.log(salt);
        return this.cryptoUtils.deriveAESKeyFromString(password, salt);
      });
  }

  public getDerivedEVMAccountFromSignature(
    accountAddress: AccountAddress,
    signature: Signature,
  ): ResultAsync<ExternallyOwnedAccount, never> {
    return this.cryptoUtils
      .deriveEVMPrivateKeyFromSignature(
        signature,
        this.accountAddressToHex(accountAddress),
      )
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

  public getDerivedEVMAccountFromPassword(
    password: PasswordString,
  ): ResultAsync<ExternallyOwnedAccount, never> {
    // The hard thing here is the salt.
    return ResultUtils.combine([
      this.cryptoUtils.hashStringSHA256(password),
      this.configProvider.getConfig(),
    ])
      .andThen(([hashedPassword, config]) => {
        // SHA256 is Base64 encoded. We'll combine that with the contract factory address,
        // hash it again, convert to a hexstring, and use that as the salt.
        return this.cryptoUtils.hashStringSHA256(
          hashedPassword +
            config.controlChainInformation.consentFactoryContractAddress,
        );
      })
      .andThen((hashedPassword2) => {
        const buffer = Buffer.from(hashedPassword2, "base64");
        const salt = HexString(buffer.toString("hex"));
        console.log(salt);
        return this.cryptoUtils.deriveEVMPrivateKeyFromString(password, salt);
      })
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
          return (
            verifiedAccountAddress.toLowerCase() == accountAddress.toLowerCase()
          );
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

  public deriveOptInPrivateKey(
    consentContractAddress: EVMContractAddress,
    dataWalletKey: EVMPrivateKey,
  ): ResultAsync<EVMPrivateKey, never> {
    return this.cryptoUtils
      .signMessage(consentContractAddress, dataWalletKey)
      .andThen((signature) => {
        return this.cryptoUtils.deriveEVMPrivateKeyFromSignature(
          signature,
          HexString(consentContractAddress),
        );
      });
  }

  public deriveOptInAccountAddress(
    consentContractAddress: EVMContractAddress,
    dataWalletKey: EVMPrivateKey,
  ): ResultAsync<EVMAccountAddress, never> {
    return this.deriveOptInPrivateKey(
      consentContractAddress,
      dataWalletKey,
    ).map((newPrivateKey) => {
      return this.cryptoUtils.getEthereumAccountAddressFromPrivateKey(
        newPrivateKey,
      );
    });
  }

  protected accountAddressToHex(accountAddress: AccountAddress): HexString {
    if (ethers.utils.isHexString(accountAddress)) {
      return HexString(accountAddress);
    }

    // Doesn't decode as base58, maybe it's just missing the 0x
    const prefixedHex = `0x${accountAddress}`;
    if (ethers.utils.isHexString(prefixedHex)) {
      return HexString(prefixedHex);
    }
    // If it's not a hex string, it should be a base58 encoded account address
    // Decode to an array
    const arr = base58.decode(accountAddress);
    const buffer = Buffer.from(arr);
    return HexString(`0x${buffer.toString("hex")}`);
  }
}
