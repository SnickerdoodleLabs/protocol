import * as fs from "fs";

import {
  ICommitmentWrapper,
  IMembershipWrapper,
} from "@snickerdoodlelabs/circuits-sdk";
import { ObjectUtils } from "@snickerdoodlelabs/common-utils";
import { IDeliverInsightsParams } from "@snickerdoodlelabs/insight-platform-api";
import { CryptoUtils } from "@snickerdoodlelabs/node-utils";
import {
  ConsentContractError,
  ConsentFactoryContractError,
  DomainName,
  EVMAccountAddress,
  EVMContractAddress,
  IpfsCID,
  ISDQLQueryObject,
  ISO8601DateString,
  SDQLString,
  Signature,
  URLString,
  ERewardType,
  EarnedReward,
  SHA256Hash,
  AdSignature,
  InvalidSignatureError,
  ZKProof,
  Commitment,
  BigNumberString,
  JSONString,
  NullifierBNS,
} from "@snickerdoodlelabs/objects";
import cors from "cors";
import express from "express";
import { ResultAsync, errAsync, okAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { questionnaire } from "@test-harness/queries/index.js";
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
    protected membershipWrapper: IMembershipWrapper,
    protected commitmentWrapper: ICommitmentWrapper,
  ) {
    process.on("exit", () => {
      this.logStream.close();
    });

    this.app = express();
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    const corsOptions = {
      origin: "*",
      methods: ["POST", "GET", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    };
    this.app.use(cors(corsOptions));

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

    this.app.post("/insights", (req, res) => {
      console.log("Received Insight Response");

      console.log("Insights : ", req.body.insights);
      //console.log("Ads : ", req.body["insights"]["ads"]);

      const consentContractId = EVMContractAddress(req.body.consentContractId);
      const queryCID = IpfsCID(req.body.queryCID);
      const signalNullifier = NullifierBNS(
        BigInt(req.body.signalNullifier).toString(),
      );
      const insights = JSONString(req.body.insights);
      const rewardParameters = JSONString(req.body.rewardParameters);
      const anonymitySetStart = Number(req.body.anonymitySetStart);
      const anonymitySetSize = Number(req.body.anonymitySetSize);
      const proof = ZKProof(req.body.proof);

      const provableData = {
        consentContractId: consentContractId,
        queryCID: queryCID,
        insights: insights,
        rewardParameters: rewardParameters,
        signalNullifier: signalNullifier,
        anonymitySetStart: anonymitySetStart,
        anonymitySetSize: anonymitySetSize,
      } as Omit<IDeliverInsightsParams, "proof">;

      this.logStream.write(JSON.stringify(req.body));
      // Need to recover the anonymity set
      const consentContract =
        this.blockchain.consentContracts.get(consentContractId);
      if (consentContract == null) {
        return errAsync(
          new Error(`Consent contract ${consentContractId} does not exist`),
        );
      }

      return consentContract
        .fetchAnonymitySet(
          BigNumberString(BigInt(anonymitySetStart).toString()),
          BigNumberString(
            BigInt(anonymitySetStart + anonymitySetSize).toString(),
          ),
        )
        .andThen((anonymitySet) => {
          return this.membershipWrapper.verify(
            ObjectUtils.serialize(provableData),
            anonymitySet,
            queryCID,
            signalNullifier,
            proof,
          );
        })
        .andThen((verified) => {
          if (!verified) {
            return errAsync(new Error("Invalid proof provided for response!"));
          }
          console.log("Verified proof of response!");

          const earnedRewards: EarnedReward[] = [];
          earnedRewards[0] = new EarnedReward(
            queryCID,
            "Sugar to your coffee",
            IpfsCID("QmbWqxBEKC3P8tqsKc98xmWN33432RLMiMPL8wBuTGsMnR"),
            "dummy desc",
            ERewardType.Direct,
          );
          res.send(earnedRewards);
          return okAsync(undefined);
        })
        .mapErr((e) => {
          console.error(e);
          res.send(e);
        });
    });

    this.app.post("/optin", (req, res) => {
      // Gather all the parameters
      const consentContractId = EVMContractAddress(req.body.consentContractId);
      const commitment = Commitment(BigInt(req.body.commitment));
      const proof = ZKProof(req.body.proof);

      const provableData = {
        consentContractId: consentContractId,
        commitment: commitment,
      };

      this.commitmentWrapper
        .verify(ObjectUtils.serialize(provableData), commitment, proof)
        .andThen((verified) => {
          if (!verified) {
            const errMessage = `Invalid proof provided for opt in. Provided proof for commitment ${commitment} for consent contract ${consentContractId} does not verify`;
            console.error(errMessage);
            return errAsync(new Error(errMessage));
          }

          console.log(
            `Verified proof of commitment for consent contract ${consentContractId}!`,
          );

          const consentContract =
            this.blockchain.consentContracts.get(consentContractId);

          if (consentContract == null) {
            return errAsync(
              new Error(`Consent contract ${consentContractId} does not exist`),
            );
          }

          // Now we need to actually execute the opt-in
          return consentContract.optIn(commitment);
        })
        .andThen((tx) => {
          return ResultAsync.fromPromise(tx.wait(), (e) => {
            return e as Error;
          });
        })
        .map((receipt) => {
          console.log("Opt In receipt", receipt);
          res.send({ success: true });
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
    queryJson.timestamp = ISO8601DateString(new Date().toISOString());
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

  public uploadQuestionnaire(): ResultAsync<IpfsCID, Error> {
    return this.ipfs
      .postToIPFS(questionnaire)
      .map((cid) => {
        console.log("cid: " + cid);
        return cid;
      })
      .mapErr((e) => {
        console.error(e);
        return e;
      });
  }

  public createCampaign(
    domains: DomainName[],
  ): ResultAsync<
    EVMContractAddress,
    ConsentFactoryContractError | ConsentContractError | Error
  > {
    console.log("Posting Audience Metadata to IPFS");
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
          .createConsentContract(domains[0], cid)
          .andThen((contractAddress) => {
            const consentContract =
              this.blockchain.getConsentContract(contractAddress);

            console.log(
              `Created consent contract address ${contractAddress} for business account address ${this.blockchain.businessAccount.accountAddress}, owned by ${this.blockchain.serverAccount.accountAddress}`,
            );
            this.consentContracts.push(contractAddress);

            // Add a few URLs
            // We need to do this
            return ResultUtils.executeSerially(
              domains.map((domain) => () => {
                console.log(
                  `Adding domain ${domain} to consent contract ${contractAddress}`,
                );
                return consentContract.addDomain(domain);
              }),
            ).map(() => {
              console.log(
                `Added domains to consent contract address ${contractAddress}`,
              );
              return contractAddress;
            });
          });
      });
  }

  public verifyAdSignature(
    contentHash: SHA256Hash,
    adSignature: AdSignature,
  ): ResultAsync<void, InvalidSignatureError> {
    return this.cryptoUtils
      .verifyEVMSignature(contentHash, adSignature.signature as Signature)
      .andThen((optInAddressFromSignature) => {
        if (
          !this.compareEVMAddresses(
            optInAddressFromSignature,
            adSignature.consentContractAddress,
          )
        ) {
          return errAsync(
            new InvalidSignatureError(
              `Given signature seems to be signed by ${optInAddressFromSignature} ` +
                `instead of ${adSignature.consentContractAddress}`,
            ),
          );
        }
        return okAsync(undefined);
      });
  }

  private compareEVMAddresses(
    accAddr: EVMAccountAddress,
    contrAddr: EVMContractAddress,
  ): boolean {
    return (
      accAddr.toString().toLowerCase() == contrAddr.toString().toLowerCase()
    );
  }
}
