import { CryptoUtils, ICryptoUtils } from "@snickerdoodlelabs/common-utils";
import {
  AESEncryptedString,
  DataWalletAddress,
  EncryptedString,
  EVMAccountAddress,
  InitializationVector,
  LanguageCode,
  Signature,
} from "@snickerdoodlelabs/objects";
import {
  snickerdoodleSigningDomain,
  addCrumbTypes,
} from "@snickerdoodlelabs/signature-verification";
import express from "express";
import { ResultAsync, okAsync, errAsync } from "neverthrow";

export class InsightPlatformSimulator {
  protected app: express.Express;
  protected port = 3000;
  protected cryptoUtils = new CryptoUtils();

  public constructor() {
    this.app = express();

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    this.app.get("/", (req, res) => {
      res.send("Hello World!");
    });

    this.app.post("/crumb/:accountAddress", (req, res) => {
      // Gather all the parameters
      const accountAddress = req.params.accountAddress;
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
          return okAsync(undefined);
        })
        .map(() => {
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
