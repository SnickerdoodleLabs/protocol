import * as fs from "fs";

import { CryptoUtils } from "@snickerdoodlelabs/common-utils";
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
  IpfsCID,
  ISDQLQueryObject,
  ISO8601DateString,
  OptInInfo,
  SDQLString,
  Signature,
  TokenId,
  URLString,
  ERewardType,
  ChainId,
  ExpectedReward,
  EarnedReward,
} from "@snickerdoodlelabs/objects";
import {
  snickerdoodleSigningDomain,
  executeMetatransactionTypes,
  insightDeliveryTypes,
  insightPreviewTypes,
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

      const expectedRewards: ExpectedReward[] = [];
      expectedRewards[0] = new ExpectedReward(
        "undefined",
        "participate in the draw to win a CryptoPunk NFT",
        ChainId(1),
        "{ parameters: [Array], data: [Object] }",
        ERewardType.Direct,
      );
      expectedRewards[1] = new ExpectedReward(
        "undefined",
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
          res.send(expectedRewards);
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
            ERewardType.Direct,
          );
          res.send(earnedRewards);
        })
        .mapErr((e) => {
          console.error(e);
          res.send(e);
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
