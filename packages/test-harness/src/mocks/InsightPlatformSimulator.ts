import * as fs from "fs";

import {
  GetSignedUrlConfig,
  Storage,
  Bucket,
  GetSignedUrlResponse,
  GetFilesResponse,
  File,
  GetFilesCallback,
} from "@google-cloud/storage";
import { CryptoUtils } from "@snickerdoodlelabs/common-utils";
import { IMinimalForwarderRequest } from "@snickerdoodlelabs/contracts-sdk";
import {
  BigNumberString,
  ConsentContractError,
  ConsentFactoryContractError,
  ConsentName,
  DomainName,
  EVMAccountAddress,
  EVMContractAddress,
  HexString,
  IpfsCID,
  ISDQLQueryObject,
  ISO8601DateString,
  SDQLString,
  Signature,
  TokenId,
  URLString,
  ERewardType,
  ChainId,
  EarnedReward,
  MinimalForwarderContractError,
  EligibleReward,
} from "@snickerdoodlelabs/objects";
import {
  snickerdoodleSigningDomain,
  executeMetatransactionTypes,
  insightDeliveryTypes,
  insightPreviewTypes,
  cloudBackupTypes,
} from "@snickerdoodlelabs/signature-verification";
import { BigNumber } from "ethers";
import express from "express";
import { ResultAsync, errAsync, okAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { BlockchainStuff } from "@test-harness/utilities/BlockchainStuff.js";
import { IPFSClient } from "@test-harness/utilities/IPFSClient.js";

export class InsightPlatformSimulator {
  protected app: express.Express;
  // ports 3000 to 3005 may conflict with insight-platform gateway services
  protected port = 3006;
  protected cryptoUtils = new CryptoUtils();

  protected consentContracts = new Array<EVMContractAddress>();
  protected logStream = fs.createWriteStream(
    "data/insight/" + new Date().toISOString().substring(0, 10),
    { flags: "a" },
  );

  public constructor(
    protected blockchain: BlockchainStuff,
    protected ipfs: IPFSClient,
  ) {
    process.on("exit", () => {
      this.logStream.close();
    });

    this.app = express();

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    this.app.get("/", (req, res) => {
      res.send("Hello World!");
    });

    // Fakes Cloudflare DNS response
    this.app.get("/dns", (req, res) => {
      res.send({
        Answer: this.consentContracts.map((contractAddress) => {
          return {
            data: `"${contractAddress}"`,
          };
        }),
      });
    });

    /* Rewards Preview API - get Eligible Rewards*/
    this.app.post("/insights/responses/preview", (req, res) => {
      console.log("Sending prompt rewards preview to the Insights Platform");
      console.log("Req is this: ", req.body);

      const consentContractId = EVMContractAddress(req.body.consentContractId);
      const tokenId = TokenId(BigInt(req.body.tokenId));
      const queryCID = IpfsCID(req.body.queryCID);
      const queries = JSON.stringify(req.body.queries);
      const signature = Signature(req.body.signature);

      const value = {
        consentContractId,
        queryCID,
        tokenId,
        queries,
      };

      const eligibleRewards: EligibleReward[] = [];
      eligibleRewards[0] = new EligibleReward(
        "c1",
        "Sugar to your coffee",
        IpfsCID("QmbWqxBEKC3P8tqsKc98xmWN33432RLMiMPL8wBuTGsMnR"),
        "10% discount code for Starbucks",
        ChainId(1),
        "{ parameters: [Array], data: [Object] }", 
        ERewardType.Direct,
      );
      eligibleRewards[1] = new EligibleReward(
        "c2",
        "The CryptoPunk Draw",
        IpfsCID("33tq432RLMiMsKc98mbKC3P8NuTGsMnRxWqxBEmWPL8wBQ"),
        "participate in the draw to win a CryptoPunk NFT",
        ChainId(1),
        "{ parameters: [Array], data: [Object] }", 
        ERewardType.Direct,
      );
      eligibleRewards[2] = new EligibleReward(
        "c3",
        "CrazyApesClub NFT distro",
        IpfsCID("GsMnRxWqxMsKc98mbKC3PBEmWNuTPL8wBQ33tq432RLMi8"),
        "a free CrazyApesClub NFT",
        ChainId(1),
        "{ parameters: [Array], data: [Object] }",
        ERewardType.Direct,
      );

      this.logStream.write(JSON.stringify(req.body));

      return this.cryptoUtils
        .verifyTypedData(
          snickerdoodleSigningDomain,
          insightPreviewTypes,
          value,
          signature,
        )
        .andThen((verificationAddress) => {
          console.log(
            `Preview requested from ${verificationAddress} for token ${tokenId} on contract ${consentContractId}`,
          );

          // Go to the blockchain and make sure this token exists and is owned by this address
          const contract =
            this.blockchain.getConsentContract(consentContractId);

          return contract.getConsentToken(tokenId).andThen((consentToken) => {
            if (consentToken == null) {
              const err = new Error(`No consent token found for id ${tokenId}`);
              console.error(err);
              return errAsync(err);
            }

            if (consentToken.ownerAddress != verificationAddress) {
              const err = new Error(
                `Consent token ${tokenId} is not owned by the verification address ${verificationAddress}`,
              );
              console.error(err);
              return errAsync(err);
            }

            return okAsync(undefined);
          });
        })
        .map(() => {
          res.send(eligibleRewards);
        })
        .mapErr((e) => {
          console.error(e);
          res.send(e);
        });
    });

    this.app.post("/insights/responses", (req, res) => {
      console.log("Recieved Insight Response");
      console.log("Req is this: ", req.body);

      const consentContractId = EVMContractAddress(req.body.consentContractId);
      const queryCID = IpfsCID(req.body.queryCID);
      const tokenId = TokenId(BigInt(req.body.tokenId));
      const returns = JSON.stringify(req.body.returns);
      const rewardParameters = JSON.stringify(req.body.rewardParameters);
      const signature = Signature(req.body.signature);

      const value = {
        consentContractId,
        queryCID,
        tokenId,
        returns,
        rewardParameters,
      };

      this.logStream.write(JSON.stringify(req.body));
      return this.cryptoUtils
        .verifyTypedData(
          snickerdoodleSigningDomain,
          insightDeliveryTypes,
          value,
          signature,
        )
        .andThen((verificationAddress) => {
          const contract =
            this.blockchain.getConsentContract(consentContractId);

          return contract.getConsentToken(tokenId).andThen((consentToken) => {
            if (consentToken == null) {
              const err = new Error(`No consent token found for id ${tokenId}`);
              console.error(err);
              return errAsync(err);
            }

            if (consentToken.ownerAddress != verificationAddress) {
              const err = new Error(
                `Consent token ${tokenId} is not owned by the verification address ${verificationAddress}`,
              );
              console.error(err);
              return errAsync(err);
            }

            return okAsync(undefined);
          });
        })
        .map(() => {
          const earnedRewards: EarnedReward[] = [];
          earnedRewards[0] = new EarnedReward(
            queryCID, 
            "Sugar to your coffee",
            IpfsCID("QmbWqxBEKC3P8tqsKc98xmWN33432RLMiMPL8wBuTGsMnR"),
            "dummy desc",
            ERewardType.Direct
          );
          res.send(earnedRewards);
        })
        .mapErr((e) => {
          console.error(e);
          res.send(e);
        });
    });

    this.app.post("/getWalletBackups", (req, res) => {
      const signature = Signature(req.body.signature);
      const signingData = {
        fileName: req.body.fileName,
      };

      this.cryptoUtils
        .verifyTypedData(
          snickerdoodleSigningDomain,
          cloudBackupTypes,
          signingData,
          signature,
        )
        .map(async (verificationAddress) => {
          const storage = new Storage({
            keyFilename: "../persistence/src/credentials.json",
            projectId: "snickerdoodle-insight-stackdev",
          });
          const bucket = storage.bucket("ceramic-replacement-bucket");
          const name = req.body.fileName as string;

          await storage
            .bucket("ceramic-replacement-bucket")
            .getFiles({ prefix: name }, async function (err, files) {
              if (err) {
                console.error("err: ", err);
                res.send([]);
              } else {
                console.log("getWalletBackups files: ", files);
                res.send(files);
              }
            });
        });
    });

    this.app.post("/getSignedUrl", (req, res) => {
      const signature = Signature(req.body.signature);
      const signingData = {
        fileName: req.body.fileName,
      };
      this.cryptoUtils
        .verifyTypedData(
          snickerdoodleSigningDomain,
          cloudBackupTypes,
          signingData,
          signature,
        )
        .map(async (verificationAddress) => {
          console.log("SIMULATOR getSignedUrl: ", req.body.fileName);
          const storage = new Storage({
            keyFilename: "../persistence/src/credentials.json",
            projectId: "snickerdoodle-insight-stackdev",
          });
          const readOptions: GetSignedUrlConfig = {
            version: "v4",
            action: "read",
            expires: Date.now() + 15 * 60 * 1000, // 15 minutes
          };

          await storage
            .bucket("ceramic-replacement-bucket")
            .file(req.body.fileName)
            .getSignedUrl(readOptions, async function (err, writeUrl) {
              console.log("getSignedUrl url: ", writeUrl);
              if (err) {
                console.error("err: ", err);
                res.send(err);
              } else {
                res.send(writeUrl);
              }
            });
        });
    });

    this.app.post("/getRecentVersion", (req, res) => {
      const signature = Signature(req.body.signature);
      const signingData = {
        fileName: req.body.fileName,
      };
      this.cryptoUtils
        .verifyTypedData(
          snickerdoodleSigningDomain,
          cloudBackupTypes,
          signingData,
          signature,
        )
        .map(async (verificationAddress) => {
          console.log("getRecentVersion: ", req.body.fileName);
          const storage = new Storage({
            keyFilename: "../persistence/src/credentials.json",
            projectId: "snickerdoodle-insight-stackdev",
          });
          storage
            .bucket("ceramic-replacement-bucket")
            .getFiles({ prefix: req.body.fileName }, function (err, files) {
              console.log("Recent version files: ", files);
              if (err) {
                console.error("err: ", err);
                res.send("1");
              } else {
                if (files !== undefined) {
                  console.log("files: ", files);
                  if (files.length == 0) {
                    res.send("1");
                  }
                  if (files.length > 0) {
                    const inArray = files[files.length - 1];
                    // const inArray = allFiles[0];
                    console.log("inArray: ", inArray);

                    // inArray["metadata"]["name"];
                    const name = inArray["metadata"]["name"];
                    const versionString = name.split(/[/ ]+/).pop();
                    console.log("versionString: ", versionString);
                    const versionNumber = versionString.split("version");
                    console.log("versionNumber: ", versionNumber[1]);
                    console.log(parseInt(versionNumber[1]) + 1);
                    const version = (parseInt(versionNumber[1]) + 1).toString();
                    console.log("Inner Version 1: ", version);
                    res.send(version);
                  }
                }
              }
            });
        });
    });

    this.app.post("/getGoogleStorage", (req, res) => {
      const signature = Signature(req.body.signature);
      const signingData = {
        fileName: req.body.fileName,
      };
      this.cryptoUtils
        .verifyTypedData(
          snickerdoodleSigningDomain,
          cloudBackupTypes,
          signingData,
          signature,
        )
        .map(async (verificationAddress) => {
          const storage = new Storage({
            keyFilename: "../persistence/src/credentials.json",
            projectId: "snickerdoodle-insight-stackdev",
          });
          const bucket = storage.bucket("ceramic-replacement-bucket");
          bucket.file("");
          res.send(bucket);
        });
    });

    this.app.post("/clearAllBackups", (req, res) => {
      const signature = Signature(req.body.signature);
      const signingData = {
        fileName: req.body.fileName,
      };
      this.cryptoUtils
        .verifyTypedData(
          snickerdoodleSigningDomain,
          cloudBackupTypes,
          signingData,
          signature,
        )
        .map(async (verificationAddress) => {
          const storage = new Storage({
            keyFilename: "../persistence/src/credentials.json",
            projectId: "snickerdoodle-insight-stackdev",
          });
          storage.bucket("ceramic-replacement-bucket").deleteFiles();
          res.send(undefined);
        });
    });

    this.app.post("/getAuthorizedBackups", (req, res) => {
      const signature = Signature(req.body.signature);
      const signingData = {
        fileName: req.body.fileName,
      };
      this.cryptoUtils
        .verifyTypedData(
          snickerdoodleSigningDomain,
          cloudBackupTypes,
          signingData,
          signature,
        )
        .map(async (verificationAddress) => {
          const storage = new Storage({
            keyFilename: "../persistence/src/credentials.json",
            projectId: "snickerdoodle-insight-stackdev",
          });
          const readOptions: GetSignedUrlConfig = {
            version: "v4",
            action: "read",
            expires: Date.now() + 15 * 60 * 1000, // 15 minutes
          };

          const readUrl = await storage
            .bucket("ceramic-replacement-bucket")
            .file(req.body.fileName)
            .getSignedUrl(readOptions);

          const writeOptions: GetSignedUrlConfig = {
            version: "v4",
            action: "write",
            expires: Date.now() + 15 * 60 * 1000, // 15 minutes
          };
          await storage
            .bucket("ceramic-replacement-bucket")
            .file(req.body.fileName)
            .getSignedUrl(writeOptions, async function (err, writeUrl) {
              if (err) {
                console.error("err: ", err);
                res.send(err);
              } else {
                res.send([[readUrl[0]], [writeUrl]]);
              }
            });
        });
    });

    this.app.post("/metatransaction", (req, res) => {
      // Gather all the parameters
      const accountAddress = EVMAccountAddress(req.body.accountAddress);
      const contractAddress = EVMContractAddress(req.body.contractAddress);
      const nonce = BigNumberString(req.body.nonce);
      const value = BigNumberString(req.body.value);
      const gas = BigNumberString(req.body.gas);
      const data = HexString(req.body.data);
      const signature = Signature(req.body.requestSignature);
      const metatransactionSignature = Signature(
        req.body.metatransactionSignature,
      );

      const signingData = {
        accountAddress: accountAddress,
        contractAddress: contractAddress,
        nonce: nonce,
        value: value,
        gas: gas,
        data: data,
        metatransactionSignature: metatransactionSignature,
      } as Record<string, unknown>;

      // Verify the signature
      this.cryptoUtils
        .verifyTypedData(
          snickerdoodleSigningDomain,
          executeMetatransactionTypes,
          signingData,
          signature,
        )
        .andThen((verificationAddress) => {
          if (verificationAddress != accountAddress) {
            console.error(
              `Invalid signature. Metatransaction request is signed by ${verificationAddress} but is for account ${accountAddress}`,
            );
            return errAsync(new Error("Invalid signature!"));
          }

          console.log(
            `Verified signature for metatransaction for account ${verificationAddress}!`,
          );

          const forwarderRequest = {
            to: contractAddress, // Contract address for the metatransaction
            from: accountAddress, // EOA to run the transaction as
            value: BigNumber.from(value), // The amount of doodle token to pay. Should be 0.
            gas: BigNumber.from(gas), // The amount of gas to pay.
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
        .andThen((tx) => {
          return ResultAsync.fromPromise(tx.wait(), (e) => {
            return new MinimalForwarderContractError(
              "Wait for createCrumb() failed",
              "Unknown",
              e,
            );
          });
        })
        .map((receipt) => {
          console.log("Metatransaction receipt", receipt);
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

  public postQuery(
    consentContractAddress: EVMContractAddress,
    queryText: SDQLString,
  ): ResultAsync<void, Error | ConsentContractError> {
    // Posting a query involves two things- 1. putting the query content into IPFS, and 2.
    // calling requestForData on the consent contract

    // The queryText needs to have the timestamp inserted
    const queryJson = JSON.parse(queryText) as ISDQLQueryObject;
    // queryJson.timestamp = UnixTimestamp(
    //   Math.floor(new Date().getTime() / 1000),
    // );
    queryJson.timestamp = ISO8601DateString(new Date().toISOString());
    // queryJson.expiry = new Date().toISOString();
    // Convert query back to string
    queryText = SDQLString(JSON.stringify(queryJson));

    // Now we can post the query to IPFS
    return this.ipfs
      .postToIPFS(queryText)
      .andThen((cid) => {
        console.log(`Posted query content to ipfs CID ${cid}`);
        // Need to call requestForData
        const consentContract = this.blockchain.getConsentContract(
          consentContractAddress,
        );

        return consentContract.requestForData(cid);
      })
      .map(() => {
        console.log(
          `Sent request for data to consent contract ${consentContractAddress}`,
        );
      });
  }

  public createCampaign(
    domains: DomainName[],
  ): ResultAsync<
    EVMContractAddress,
    ConsentFactoryContractError | ConsentContractError | Error
  > {
    return this.ipfs
      .postToIPFS(
        JSON.stringify({
          title: `${domains[0]} title`,
          description: "description",
          image: URLString("http://example.com/image.png"),
          rewardName: "rewardName",
          nftClaimedImage: URLString("http://example.com/nftClaimedImage.png"),
        }),
      )
      .andThen((cid) => {
        // Need to create a consent contract
        return this.blockchain
          .createConsentContract(
            ConsentName(
              `Snackerdoodle Test Harness ${this.consentContracts.length + 1}`,
            ),
            domains[0],
            cid,
          )
          .andThen((contractAddress) => {
            const consentContract =
              this.blockchain.getConsentContract(contractAddress);

            console.log(
              `Created consent contract address ${contractAddress} for business account adddress ${this.blockchain.businessAccount.accountAddress}, owned by ${this.blockchain.serverAccount.accountAddress}`,
            );
            this.consentContracts.push(contractAddress);

            // Add a few URLs
            // We need to do this
            return ResultUtils.executeSerially(
              domains.map((domain) => () => consentContract.addDomain(domain)),
            ).map(() => {
              console.log(
                `Added domains to consent contract address ${contractAddress}`,
              );
              return contractAddress;
            });
          });
      });
  }
}
