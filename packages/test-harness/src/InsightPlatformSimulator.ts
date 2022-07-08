import { CryptoUtils, ICryptoUtils } from "@snickerdoodlelabs/common-utils";
import {
  ConsentContract,
  CrumbsContract,
} from "@snickerdoodlelabs/contracts-sdk";
import {
  AESEncryptedString,
  chainConfig,
  ChainId,
  ControlChainInformation,
  DataWalletAddress,
  EncryptedString,
  EVMAccountAddress,
  EVMContractAddress,
  ICrumbContent,
  InitializationVector,
  LanguageCode,
  Signature,
} from "@snickerdoodlelabs/objects";
import {
  snickerdoodleSigningDomain,
  addCrumbTypes,
} from "@snickerdoodlelabs/signature-verification";
import { ethers } from "ethers";
import express from "express";
import { ResultAsync, okAsync, errAsync } from "neverthrow";

import { localChainAccounts } from "./LocalChainAccounts.js";

const defaultConsentContractAddress = EVMContractAddress("");

export class InsightPlatformSimulator {
  protected app: express.Express;
  protected port = 3000;
  protected cryptoUtils = new CryptoUtils();

  protected signer: ethers.Wallet;
  protected provider: ethers.providers.JsonRpcProvider;
  protected consentContract: ConsentContract;
  protected crumbsContract: CrumbsContract;

  public constructor() {
    // Initialize a connection to the local blockchain
    this.provider = new ethers.providers.JsonRpcProvider(
      "http://localhost:8545",
      31337,
    );
    // We'll use account 0
    this.signer = new ethers.Wallet(
      localChainAccounts[0].privateKey,
      this.provider,
    );

    const doodleChain = chainConfig.get(
      ChainId(31337),
    ) as ControlChainInformation;
    this.consentContract = new ConsentContract(
      this.signer,
      defaultConsentContractAddress,
    );
    this.crumbsContract = new CrumbsContract(
      this.signer,
      doodleChain.crumbsContractAddress,
    );

    this.app = express();

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    this.app.get("/", (req, res) => {
      res.send("Hello World!");
    });

    this.app.post("/crumb/:accountAddress", (req, res) => {
      // Gather all the parameters
      const accountAddress = EVMAccountAddress(req.params.accountAddress);
      const dataWalletAddress = DataWalletAddress(req.body.dataWallet);
      const encrypted = new AESEncryptedString(
        EncryptedString(req.body.data),
        InitializationVector(req.body.initializationVector),
      );
      const languageCode = LanguageCode(req.body.languageCode);
      const signature = Signature(req.body.signature);

      const value = {
        accountAddress: accountAddress,
        data: encrypted.data,
        initializationVector: encrypted.initializationVector,
        languageCode: languageCode,
      } as Record<string, unknown>;

      // Verify the signature
      this.cryptoUtils
        .verifyTypedData(
          snickerdoodleSigningDomain,
          addCrumbTypes,
          value,
          signature,
        )
        .andThen((verificationAddress) => {
          if (verificationAddress != EVMAccountAddress(dataWalletAddress)) {
            console.error("Invalid signature");
            return errAsync(new Error("Invalid signature!"));
          }

          console.log("Verified signature!");

          // Add the crumb to the contract
          return this.crumbsContract.getCrumb(accountAddress);
        })
        .andThen((tokenUri) => {
          console.log("Got token uri from crumb", tokenUri);
          // tokenUri is either null or a json blob.
          if (tokenUri == null) {
            // No crumb at all, add it!
            //return this.crumbsContract.
            return okAsync(undefined);
          }
          // Existing crumb, we need to update it
          const content = JSON.parse(tokenUri) as ICrumbContent;

          content[languageCode] = {
            d: encrypted.data,
            iv: encrypted.initializationVector,
          };

          // TODO: Update crumb

          return okAsync(undefined);
        })
        .map(() => {
          // We are supposed to return the token ID of the crumb
          res.send("asdfasdf");
        });
    });

    this.app.listen(this.port, () => {
      console.log(`Insight Platform Simulator listening on port ${this.port}`);
    });
  }

  public postQuery(): ResultAsync<void, never> {
    return okAsync(undefined);
  }
}
