import {
  BaseURI,
  BigNumberString,
  ConsentFactoryContractError,
  ConsentName,
  EVMAccountAddress,
  EVMContractAddress,
  IpfsCID,
  MarketplaceListing,
  MarketplaceTag,
  BlockchainCommonErrors,
  TransactionResponseError,
  UnixTimestamp,
  DomainName,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { injectable } from "inversify";
import { ResultAsync, errAsync, okAsync } from "neverthrow";

import { BaseContract } from "@contracts-sdk/implementations/BaseContract.js";
import { IEthersContractError } from "@contracts-sdk/implementations/BlockchainErrorMapper.js";
import { IConsentFactoryContract } from "@contracts-sdk/interfaces/IConsentFactoryContract.js";
import {
  ContractOverrides,
  WrappedTransactionResponse,
  ContractsAbis,
} from "@contracts-sdk/interfaces/index.js";

@injectable()
export class ConsentFactoryContract
  extends BaseContract<ConsentFactoryContractError>
  implements IConsentFactoryContract
{
  constructor(
    protected providerOrSigner: ethers.Provider | ethers.Signer,
    protected contractAddress: EVMContractAddress,
  ) {
    super(
      providerOrSigner,
      contractAddress,
      ContractsAbis.ConsentFactoryAbi.abi,
    );
  }

  public getContractAddress(): EVMContractAddress {
    return this.contractAddress;
  }

  //#region Consent
  //#region Contract
  public createConsent(
    ownerAddress: EVMAccountAddress,
    baseUri: BaseURI,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentFactoryContractError
  > {
    return this.writeToContract(
      "createConsent",
      [ownerAddress, baseUri],
      overrides,
    );
  }

  public setListingDuration(
    listingDuration: number,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentFactoryContractError
  > {
    return this.writeToContract(
      "setListingDuration",
      [listingDuration],
      overrides,
    );
  }

  public setMaxTagsPerListing(
    maxTagsPerListing: number,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentFactoryContractError
  > {
    return this.writeToContract(
      "setMaxTagsPerListing",
      [maxTagsPerListing],
      overrides,
    );
  }

  public registerStakingToken(
    stakingToken: EVMContractAddress,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentFactoryContractError
  > {
    return this.writeToContract(
      "registerStakingToken",
      [stakingToken],
      overrides,
    );
  }

  public adminRemoveListings(
    tag: MarketplaceTag,
    stakingToken: EVMContractAddress,
    removedSlot: BigNumberString[],
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentFactoryContractError
  > {
    return this.writeToContract(
      "adminRemoveListing",
      [tag, stakingToken, removedSlot],
      overrides,
    );
  }

  public blockContentObject(
    stakingToken: EVMContractAddress,
    contentAddress: EVMContractAddress,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentFactoryContractError
  > {
    return this.writeToContract(
      "blockContentObject",
      [stakingToken, contentAddress],
      overrides,
    );
  }

  public unblockContentObject(
    stakingToken: EVMContractAddress,
    contentAddress: EVMContractAddress,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentFactoryContractError
  > {
    return this.writeToContract(
      "unblockContentObject",
      [stakingToken, contentAddress],
      overrides,
    );
  }
  //#endregion Contract

  public estimateGasToCreateConsent(
    ownerAddress: EVMAccountAddress,
    baseUri: BaseURI,
    name: ConsentName,
  ): ResultAsync<bigint, ConsentFactoryContractError | BlockchainCommonErrors> {
    return ResultAsync.fromPromise(
      this.contract.estimateGas["createConsent"](
        ownerAddress,
        baseUri,
        name,
      ) as Promise<bigint>,
      (e) => {
        return this.generateError(e, `Failed to estimate gas with error: ${e}`);
      },
    ).map((estimatedGas) => {
      // TODO: confirm buffer value
      // Increase estimated gas buffer by 10%
      return (estimatedGas * 110n) / 100n;
    });
  }

  public getDeployedConsents(): ResultAsync<
    EVMContractAddress[],
    ConsentFactoryContractError | BlockchainCommonErrors
  > {
    const eventFilter = this.contract.filters.ConsentContractDeployed();
    return ResultAsync.fromPromise(
      this.contract.queryFilter(eventFilter),
      (e) => {
        return this.generateError(
          e,
          "Unable to call contract.queryFilter() for ConsentContractDeployed event",
        );
      },
    ).map((events) => {
      const consents: EVMContractAddress[] = [];
      events.forEach((event) => {
        if (event instanceof ethers.EventLog) {
          if (event.args.consentAddress != null) {
            consents.push(EVMContractAddress(event.args.consentAddress));
          }
        }
      });
      return consents;
    });
  }

  public getListingsByTag(
    tag: MarketplaceTag,
    stakingToken: EVMContractAddress,
    removeExpired: boolean,
  ): ResultAsync<
    MarketplaceListing[],
    ConsentFactoryContractError | BlockchainCommonErrors
  > {
    // We get the total number of slots by calling getTagTotal()
    // And if we query the 2^256 - 1 slot by calling getListingDetail(), its previous member variable will point to the highest ranked listing for that tag
    return this.getTagTotal(tag, stakingToken).andThen((tagTotal) => {
      // The max slot
      const highestRankListingSlot = BigNumberString(
        ethers.MaxUint256.toString(),
      );

      // If there are no listings for this tags, return empty array
      if (tagTotal == 0) {
        return okAsync([]);
      }

      // Fetch from the highest to lowest listings
      return this.getListingsForward(
        tag,
        stakingToken,
        highestRankListingSlot,
        // getListingsForward now includes the max uint256 value in order to obtain its .next that points to the slot of the highest rank listing
        tagTotal + 1, // Add 1 to account for first slot being the uint256 listing (eg. if there is only 1 listing, it needs 2 slots for uint256 => highestRankingSlot)
        removeExpired,
      );
    });
  }

  public getAddressOfConsentCreated(
    txRes: WrappedTransactionResponse,
  ): ResultAsync<EVMContractAddress, TransactionResponseError> {
    return txRes.wait().andThen((receipt) => {
      // Get the hash of the event
      const event = "ConsentContractDeployed(address,address)";
      const eventHash = ethers.keccak256(ethers.toUtf8Bytes(event));

      // Filter out for the ConsentContractDeployed event from the receipt's logs
      // returns an array
      const consentDeployedLog = receipt.logs.filter(
        (_log) => _log.topics[0] == eventHash,
      );

      // If there are no logs, return an error
      if (consentDeployedLog.length == 0) {
        return errAsync(
          new TransactionResponseError(
            "No ConsentContractDeployed event found in the transaction receipt",
          ),
        );
      }

      // access the data and topics from the filtered log
      const data = consentDeployedLog[0].data;
      const topics = consentDeployedLog[0].topics;

      // Declare a new interface
      const iface = new ethers.Interface([
        "event ConsentContractDeployed(address indexed owner, address indexed consentAddress)",
      ]);

      // Decode the log from the given data and topic
      const decodedLog = iface.decodeEventLog(
        "ConsentContractDeployed",
        data,
        topics,
      );

      const deployedConsentAddress: EVMContractAddress =
        decodedLog.consentAddress;

      return okAsync(deployedConsentAddress);
    });
  }
  //#endregion Consent

  //#region Content
  public getGovernanceToken(): ResultAsync<
    EVMContractAddress,
    ConsentFactoryContractError | BlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      this.contract.getGovernanceToken() as Promise<EVMContractAddress>,
      (e) => {
        return this.generateError(e, "Unable to call getGovernanceToken()");
      },
    );
  }

  public isStakingToken(
    stakingToken: EVMContractAddress,
  ): ResultAsync<
    boolean,
    ConsentFactoryContractError | BlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      this.contract.isStakingToken(stakingToken) as Promise<boolean>,
      (e) => {
        return this.generateError(e, "Unable to call isStakingToken()");
      },
    );
  }

  public listingDuration(): ResultAsync<
    number,
    ConsentFactoryContractError | BlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      this.contract.listingDuration() as Promise<bigint>,
      (e) => {
        return this.generateError(e, "Unable to call listingDuration()");
      },
    ).map((duration) => {
      return Number(duration);
    });
  }

  public maxTagsPerListing(): ResultAsync<
    number,
    ConsentFactoryContractError | BlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      this.contract.maxTagsPerListing() as Promise<bigint>,
      (e) => {
        return this.generateError(e, "Unable to call maxTagsPerListing()");
      },
    ).map((num) => {
      return Number(num);
    });
  }

  public getTagTotal(
    tag: MarketplaceTag,
    stakedToken: EVMContractAddress,
  ): ResultAsync<number, ConsentFactoryContractError | BlockchainCommonErrors> {
    return ResultAsync.fromPromise(
      this.contract.getTagTotal(tag, stakedToken) as Promise<bigint>,
      (e) => {
        return this.generateError(e, "Unable to call getTagTotal()");
      },
    ).map((count) => {
      return Number(count);
    });
  }

  public getListingsForward(
    tag: MarketplaceTag,
    stakingToken: EVMContractAddress,
    startingSlot: BigNumberString,
    numberOfSlots: number,
    removeExpired: boolean,
  ): ResultAsync<
    MarketplaceListing[],
    ConsentFactoryContractError | BlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      this.contract.getListingsForward(
        tag,
        stakingToken,
        startingSlot,
        numberOfSlots,
        removeExpired,
      ) as Promise<[string[], IListingStruct[]]>,
      (e) => {
        return this.generateError(e, "Unable to call getListingsForward()");
      },
    ).map(([cids, listings]) => {
      // Setup an array for marketplace listings that includes slots
      const marketplaceListings: MarketplaceListing[] = [];

      // If the there is only one listing, slot is the startingSlot that is being queried
      if (listings.length == 1) {
        return [
          new MarketplaceListing(
            startingSlot,
            BigNumberString(listings[0].previous.toString()),
            BigNumberString(listings[0].next.toString()),
            listings[0].contentObject,
            UnixTimestamp(Number(listings[0].timeExpiring.toString())),
            IpfsCID(cids[0]),
            BigNumberString(listings[0].stake.toString()),
            tag,
          ),
        ];
      }

      for (let i = 0; i < listings.length; i++) {
        // IListingStruct that mirrors the contract's ListingStruct does not have 'slot' property
        // Initiate a MarketplaceListing with IListingStruct's info
        const marketplaceListing = new MarketplaceListing(
          BigNumberString("0"), // initiate with a 0 slot, it will be populated below
          BigNumberString(listings[i].previous.toString()),
          BigNumberString(listings[i].next.toString()),
          listings[i].contentObject,
          UnixTimestamp(Number(listings[i].timeExpiring)),
          IpfsCID(cids[i]),
          BigNumberString(listings[i].stake.toString()),
          tag,
        );

        // First listing gets its slot from the second listing's previous value
        if (i == 0) {
          // Handle case where the startingSlot happens to be position before 0
          if (listings[i + 1].previous == BigInt("0")) {
            marketplaceListing.slot = BigNumberString(startingSlot.toString());
          } else {
            marketplaceListing.slot = BigNumberString(
              listings[i + 1].previous.toString(),
            );
          }

          marketplaceListings.push(marketplaceListing);

          continue;
        }

        // Subsequent listings get their slots from the previous listing's next value
        marketplaceListing.slot = BigNumberString(
          listings[i - 1].next.toString(),
        );
        marketplaceListings.push(marketplaceListing);
      }

      // Remove those that have .previous of 0, keep those with next 0 as the last position item will have .next of 0
      return marketplaceListings.filter(
        (listing) => listing.previous != BigNumberString("0"),
      );
    });
  }

  public getListingsBackward(
    tag: MarketplaceTag,
    stakingToken: EVMContractAddress,
    startingSlot: BigNumberString,
    numberOfSlots: number,
    removeExpired: boolean,
  ): ResultAsync<
    MarketplaceListing[],
    ConsentFactoryContractError | BlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      this.contract.getListingsBackward(
        tag,
        stakingToken,
        startingSlot,
        numberOfSlots,
        removeExpired,
      ) as Promise<[string[], IListingStruct[]]>,
      (e) => {
        return this.generateError(e, "Unable to call getListingsBackward()");
      },
    ).map(([cids, listings]) => {
      const marketplaceListingsBackwards: MarketplaceListing[] = [];

      // If the there is only one listing, slot is the startingSlot that is being queried
      if (listings.length == 1) {
        return [
          new MarketplaceListing(
            BigNumberString("0"),
            BigNumberString(listings[0].previous.toString()),
            BigNumberString(listings[0].next.toString()),
            listings[0].contentObject,
            UnixTimestamp(Number(listings[0].timeExpiring)),
            IpfsCID(cids[0]),
            BigNumberString(listings[0].stake.toString()),
            tag,
          ),
        ];
      }

      for (let i = 0; i < listings.length; i++) {
        // IListingStruct that mirrors the contract's ListingStruct does not have 'slot' property
        // Initiate a MarketplaceListing with IListingStruct's info
        const marketplaceListing = new MarketplaceListing(
          BigNumberString("0"),
          BigNumberString(listings[i].previous.toString()),
          BigNumberString(listings[i].next.toString()),
          listings[i].contentObject,
          UnixTimestamp(Number(listings[i].timeExpiring)),
          IpfsCID(cids[i]),
          BigNumberString(listings[i].stake.toString()),
          tag,
        );

        // First listing gets its slot from the second listing's next value
        if (i == 0) {
          // Handle case where the startingSlot is one position before uint256
          if (listings[i + 1].next == BigInt(0)) {
            marketplaceListing.slot = BigNumberString(startingSlot.toString());
          } else {
            marketplaceListing.slot = BigNumberString(
              listings[i + 1].next.toString(),
            );
          }

          marketplaceListingsBackwards.push(marketplaceListing);

          continue;
        }

        // Subsequent listings get their slots from the previous listing's next value
        marketplaceListing.slot = BigNumberString(
          listings[i - 1].previous.toString(),
        );
        marketplaceListingsBackwards.push(marketplaceListing);
      }

      return marketplaceListingsBackwards.filter(
        (listing) => listing.previous != "0",
      );
    });
  }

  public computeFee(
    slot: BigNumberString,
  ): ResultAsync<
    BigNumberString,
    ConsentFactoryContractError | BlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      this.contract.computeFee(slot) as Promise<bigint>,
      (e) => {
        return this.generateError(e, "Unable to call computeFee()");
      },
    ).map((fee) => {
      return BigNumberString(fee.toString());
    });
  }

  // External function meant to be called by anyone to boot an expired listing
  public removeExpiredListings(
    tag: MarketplaceTag,
    stakingToken: EVMContractAddress,
    slots: BigNumberString[],
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    ConsentFactoryContractError | BlockchainCommonErrors
  > {
    return this.writeToContract(
      "removeExpiredListings",
      [tag, stakingToken, slots],
      overrides,
    );
  }
  //#endregion Content

  // #region Domains- ERC-7529
  public addDomain(
    domain: DomainName,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentFactoryContractError
  > {
    return this.writeToContract("addDomain", [domain], overrides);
  }

  public removeDomain(
    domain: DomainName,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentFactoryContractError
  > {
    return this.writeToContract("removeDomain", [domain], overrides);
  }

  public checkDomain(
    domain: DomainName,
  ): ResultAsync<
    boolean,
    ConsentFactoryContractError | BlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      // returns array of domains
      this.contract.checkDomain(domain) as Promise<boolean>,
      (e) => {
        return this.generateError(e, "Unable to call checkDomain()");
      },
    );
  }
  // #endregion Domains- ERC-7529

  protected generateContractSpecificError(
    msg: string,
    e: IEthersContractError,
    transaction: ethers.Transaction | null,
  ): ConsentFactoryContractError {
    return new ConsentFactoryContractError(msg, e, transaction);
  }
}
interface IListingStruct {
  previous: bigint;
  next: bigint;
  contentObject: EVMContractAddress;
  stake: bigint;
  timeExpiring: bigint;
}

// I listingStruct { at the place where we're using it, and don't have to export here

// Alternative option is to get the deployed Consent addresses through filtering event ConsentContractDeployed() event

/* // TODO: Replace Promise<any> with correct types returned from ConsentContractDeployed() and queryFilter()
  public getConsentsDeployedByOwner(
    ownerAddress: EVMAccountAddress,
  ): ResultAsync<EVMContractAddress[], ConsentFactoryContractError> {
    return ResultAsync.fromPromise(
      this.contract.filters.ConsentContractDeployed(ownerAddress) as Promise<any>,
      (e) => {
        return new ConsentFactoryContractError(
          "Unable to call filters.ConsentContractDeployed()",
          (e as IBlockchainError).reason,
          e,
        );
      },
    )
      .andThen((_logs) => {
        return ResultAsync.fromPromise(
          this.contract.queryFilter(_logs) as Promise<any>,
          (e) => {
            return new ConsentFactoryContractError(
              "Unable to call filters.ConsentContractDeployed()",
              (e as IBlockchainError).reason,
              e,
            );
          },
        );
      })
      .map((logs) => {
        return logs.map((log) => log.args.consentAddress);
      });
  }
} */
