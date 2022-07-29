import {
  TypedDataDomain,
  TypedDataField,
} from "@ethersproject/abstract-signer";
import { CryptoUtils, ICryptoUtils } from "@snickerdoodlelabs/common-utils";
import { IMinimalForwarderRequest } from "@snickerdoodlelabs/contracts-sdk";
import {
  BigNumberString,
  ConsentContractError,
  ConsentFactoryContractError,
  ConsentName,
  DataWalletAddress,
  DomainName,
  EVMAccountAddress,
  EVMContractAddress,
  HexString,
  Signature,
} from "@snickerdoodlelabs/objects";
import {
  snickerdoodleSigningDomain,
  executeMetatransactionTypes,
} from "@snickerdoodlelabs/signature-verification";
import { BigNumber, ethers } from "ethers";
import express from "express";
import { ResultAsync, okAsync, errAsync } from "neverthrow";

import { BlockchainStuff } from "@test-harness/BlockchainStuff";
import { localChainAccounts } from "@test-harness/LocalChainAccounts";

export class InsightPlatformSimulator {
  protected app: express.Express;
  // ports 3000 to 3005 may conflict with insight-platform gateway services
  protected port = 3006;
  protected cryptoUtils = new CryptoUtils();

  protected consentContracts = new Array<EVMContractAddress>();

  public constructor(protected blockchain: BlockchainStuff) {
    this.app = express();

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    this.app.get("/", (req, res) => {
      res.send("Hello World!");
    });

    this.app.post("/metatransaction", (req, res) => {
      // Gather all the parameters
      const accountAddress = EVMAccountAddress(req.body.accountAddress);
      const dataWalletAddress = DataWalletAddress(req.body.dataWallet);
      const contractAddress = EVMContractAddress(req.body.contractAddress);
      const nonce = BigNumberString(req.body.nonce);
      const data = HexString(req.body.data);
      const signature = Signature(req.body.signature);
      const metatransactionSignature = Signature(
        req.body.metatransactionSignature,
      );

      const value = {
        dataWallet: dataWalletAddress,
        accountAddress: accountAddress,
        contractAddress: contractAddress,
        nonce: nonce,
        data: data,
        metatransactionSignature: metatransactionSignature,
      } as Record<string, unknown>;

      // Verify the signature
      this.cryptoUtils
        .verifyTypedData(
          snickerdoodleSigningDomain,
          executeMetatransactionTypes,
          value,
          signature,
        )
        .andThen((verificationAddress) => {
          if (verificationAddress != EVMAccountAddress(dataWalletAddress)) {
            console.error(
              `Invalid signature. Data Wallet Address: ${dataWalletAddress}, verified address: ${verificationAddress}`,
            );
            return errAsync(new Error("Invalid signature!"));
          }

          console.log(
            `Verified signature from data wallet ${verificationAddress}!`,
          );

          const forwarderRequest = {
            to: contractAddress, // Contract address for the metatransaction
            from: accountAddress, // EOA to run the transaction as
            value: BigNumber.from(0), // The amount of doodle token to pay. Should be 0.
            gas: BigNumber.from(1000000), // The amount of gas to pay.
            nonce: BigNumber.from(nonce), // Nonce for the EOA, recovered from the MinimalForwarder.getNonce()
            data: data, // The actual bytes of the request, encoded as a hex string
          } as IMinimalForwarderRequest;

          console.log("Metatransaction signature", metatransactionSignature);

          // Now we need to actually execute the metatransaction
          return this.blockchain.minimalForwarder.execute(
            forwarderRequest,
            metatransactionSignature,
          );
        })
        .map(() => {
          res.send("TokenId");
        })
        .mapErr((e) => {
          console.error(e);
          res.statusCode = 500;
          res.send(e.message);
        });
    });

    this.app.listen(this.port, () => {
      console.log(`Insight Platform Simulator listening on port ${this.port}`);
    });
  }

  public postQuery(): ResultAsync<void, never> {
    return okAsync(undefined);
  }

  public createCampaign(
    domain: DomainName,
  ): ResultAsync<
    EVMContractAddress,
    ConsentFactoryContractError | ConsentContractError
  > {
    // Need to create a consent contract
    return this.blockchain
      .createConsentContract(
        ConsentName(
          `Snackerdoodle Test Harness ${this.consentContracts.length + 1}`,
        ),
        domain,
      )
      .map((contractAddress) => {
        console.log(
          `Created consent contract address ${contractAddress} for business account adddress ${this.blockchain.businessAccount.accountAddress}`,
        );
        this.consentContracts.push(contractAddress);

        return contractAddress;
      });
  }
}
