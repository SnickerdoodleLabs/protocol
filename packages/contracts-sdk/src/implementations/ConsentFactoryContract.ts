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
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { injectable } from "inversify";
import { ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { BaseContract } from "@contracts-sdk/implementations/BaseContract.js";
import { IEthersContractError } from "@contracts-sdk/implementations/BlockchainErrorMapper.js";
import { IConsentFactoryContract } from "@contracts-sdk/interfaces/IConsentFactoryContract.js";
import {
  EConsentRoles,
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

  public createConsent(
    ownerAddress: EVMAccountAddress,
    baseUri: BaseURI,
    name: ConsentName,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentFactoryContractError
  > {
    return this.writeToContract(
      "createConsent",
      [ownerAddress, baseUri, name],
      overrides,
    );
  }

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

  // Gets the count of user's deployed Consents
  public getUserDeployedConsentsCount(
    ownerAddress: EVMAccountAddress,
  ): ResultAsync<number, ConsentFactoryContractError | BlockchainCommonErrors> {
    return ResultAsync.fromPromise(
      this.contract.getUserDeployedConsentsCount(
        ownerAddress,
      ) as Promise<bigint>,
      (e) => {
        return this.generateError(
          e,
          "Unable to call getUserDeployedConsentsCount()",
        );
      },
    ).map((count) => {
      return Number(count);
    });
  }

  // Gets the array of user deployed Consents by index count
  // Index values can be anywhere between the count obtained from getUserDeployedConsentsCount
  // eg. If user has [0x123, 0xabc, 0x456] Consent contracts, query with startingIndex 0 and endingIndex 2 to get full list
  public getUserDeployedConsentsByIndex(
    ownerAddress: EVMAccountAddress,
    startingIndex: number,
    endingIndex: number,
  ): ResultAsync<
    EVMContractAddress[],
    ConsentFactoryContractError | BlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      this.contract.getUserDeployedConsentsByIndex(
        ownerAddress,
        startingIndex,
        endingIndex,
      ) as Promise<EVMContractAddress[]>,
      (e) => {
        return this.generateError(
          e,
          "Unable to call getUserDeployedConsentsByIndex()",
        );
      },
    );
  }

  // get the latest deployed consent address by owner account address
  public getUserDeployedConsents(
    ownerAddress: EVMAccountAddress,
  ): ResultAsync<
    EVMContractAddress[],
    ConsentFactoryContractError | BlockchainCommonErrors
  > {
    return this.getUserDeployedConsentsCount(ownerAddress).andThen((count) => {
      return this.getUserDeployedConsentsByIndex(ownerAddress, 0, count);
    });
  }

  // Gets the count of Consent addresses user has specific roles for
  public getUserRoleAddressesCount(
    ownerAddress: EVMAccountAddress,
    role: EConsentRoles,
  ): ResultAsync<number, ConsentFactoryContractError | BlockchainCommonErrors> {
    return ResultAsync.fromPromise(
      this.contract.getUserConsentAddressesCount(
        ownerAddress,
        role,
      ) as Promise<bigint>,
      (e) => {
        return this.generateError(
          e,
          "Unable to call getUserConsentAddressesCount()",
        );
      },
    ).map((count) => {
      return Number(count);
    });
  }

  // Gets the array of Consent addresses user has specific roles for
  // Index values can be anywhere between the count obtained from getUserRoleAddressesCount
  // eg. If user has [0x123, 0xabc, 0x456] Consent contracts, query with startingIndex 0 and endingIndex 2 to get full list
  public getUserRoleAddressesCountByIndex(
    ownerAddress: EVMAccountAddress,
    role: EConsentRoles,
    startingIndex: number,
    endingIndex: number,
  ): ResultAsync<
    EVMContractAddress[],
    ConsentFactoryContractError | BlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      this.contract.getUserRoleAddressesCountByIndex(
        ownerAddress,
        role,
        startingIndex,
        endingIndex,
      ) as Promise<EVMContractAddress[]>,
      (e) => {
        return this.generateError(
          e,
          "Unable to call getUserRoleAddressesCountByIndex()",
        );
      },
    );
  }

  public getDeployedConsents(): ResultAsync<
    EVMContractAddress[],
    ConsentFactoryContractError | BlockchainCommonErrors
  > {
    const eventFilter = this.contract.filters.ConsentDeployed();
    return ResultAsync.fromPromise(
      this.contract.queryFilter(eventFilter),
      (e) => {
        return this.generateError(
          e,
          "Unable to call contract.queryFilter() for ConsentDeployed event",
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

  // Marketplace functions
  public getMaxTagsPerListing(): ResultAsync<
    number,
    ConsentFactoryContractError | BlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      this.contract.maxTagsPerListing() as Promise<bigint>,
      (e) => {
        return this.generateError(e, "Unable to call getMaxTagsPerListing()");
      },
    ).map((num) => {
      return Number(num);
    });
  }

  public getListingDuration(): ResultAsync<
    number,
    ConsentFactoryContractError | BlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      this.contract.getListingDuration() as Promise<bigint>,
      (e) => {
        return this.generateError(e, "Unable to call getListingDuration()");
      },
    ).map((num) => {
      return Number(num);
    });
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

  public adminRemoveListing(
    tag: MarketplaceTag,
    removedSlot: BigNumberString,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentFactoryContractError
  > {
    return this.writeToContract(
      "setMaxTagsPerListing",
      [tag, removedSlot],
      overrides,
    );
  }

  public getListingDetail(
    tag: MarketplaceTag,
    slot: BigNumberString,
  ): ResultAsync<
    MarketplaceListing,
    ConsentFactoryContractError | BlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      this.contract.getListing(tag, slot) as Promise<IListingStruct>,
      (e) => {
        return this.generateError(e, "Unable to call getListing()");
      },
    ).map((listing) => {
      return new MarketplaceListing(
        BigNumberString(listing.previous.toString()),
        BigNumberString(listing.next.toString()),
        listing.consentContract,
        UnixTimestamp(Number(listing.timeExpiring)),
        IpfsCID(""), // TODO: Update contract to also return its CID for getListing (only does this with getListingsForward/backward atm)
        slot,
        tag,
      );
    });
  }

  public getListingsForward(
    tag: MarketplaceTag,
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
        startingSlot,
        numberOfSlots,
        removeExpired,
      ) as Promise<[string[], IListingStruct[]]>,
      (e) => {
        return this.generateError(e, "Unable to call getListingsForward()");
      },
    ).map(([cids, listings]) => {
      return listings
        .map((listing, index) => {
          return new MarketplaceListing(
            BigNumberString(listing.previous.toString()),
            BigNumberString(listing.next.toString()),
            listing.consentContract,
            UnixTimestamp(Number(listing.timeExpiring)),
            IpfsCID(cids[index]),
            listings[index + 1] != null && listing.next != 0n
              ? BigNumberString(listings[index + 1].previous.toString())
              : listings[index - 1] != null
              ? BigNumberString(listings[index - 1].next.toString())
              : startingSlot,
            tag,
          );
        })
        .filter((listing) => {
          // Filter out slots with previous and next zeros
          return listing.previous != "0" || listing.next != "0";
        });
    });
  }

  public getListingsBackward(
    tag: MarketplaceTag,
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
        startingSlot,
        numberOfSlots,
        removeExpired,
      ) as Promise<[string[], IListingStruct[]]>,
      (e) => {
        return this.generateError(e, "Unable to call getListingsForward()");
      },
    ).map(([cids, listings]) => {
      return listings
        .map((listing, index) => {
          return new MarketplaceListing(
            BigNumberString(listing.previous.toString()),
            BigNumberString(listing.next.toString()),
            listing.consentContract,
            UnixTimestamp(Number(listing.timeExpiring)),
            IpfsCID(cids[index]),
            listings[index + 1] != null && listing.previous != ethers.MaxUint256
              ? BigNumberString(listings[index + 1].next.toString())
              : listings[index - 1] != null
              ? BigNumberString(listings[index - 1].previous.toString())
              : startingSlot,
            tag,
          );
        })
        .filter((listing) => {
          // Filter out slots with previous and next zeros
          return listing.previous != "0" || listing.next != "0";
        });
    });
  }

  public getTagTotal(
    tag: MarketplaceTag,
  ): ResultAsync<number, ConsentFactoryContractError | BlockchainCommonErrors> {
    return ResultAsync.fromPromise(
      this.contract.getTagTotal(tag) as Promise<bigint>,
      (e) => {
        return this.generateError(e, "Unable to call getTagTotal()");
      },
    ).map((count) => {
      return Number(count);
    });
  }

  public getListingsByTag(
    tag: MarketplaceTag,
    removeExpired: boolean,
  ): ResultAsync<
    MarketplaceListing[],
    ConsentFactoryContractError | BlockchainCommonErrors
  > {
    // We get the total number of slots by calling getTagTotal()
    // And if we query the 2^256 - 1 slot by calling getListingDetail(), its previous member variable will point to the highest ranked listing for that tag
    return ResultUtils.combine([
      this.getTagTotal(tag),
      this.getListingDetail(tag, BigNumberString(ethers.MaxUint256.toString())),
    ]).andThen(([tagTotal, listingDetail]) => {
      // The max slot's next points to the highest slot
      const highestRankListingSlot = listingDetail.next;

      // Fetch from the highest to lowest listings
      return this.getListingsForward(
        tag,
        highestRankListingSlot,
        tagTotal,
        removeExpired,
      );
    });
  }

  public getAddressOfConsentCreated(
    txRes: WrappedTransactionResponse,
  ): ResultAsync<EVMContractAddress, TransactionResponseError> {
    return txRes.wait().map((receipt) => {
      // Get the hash of the event
      const event = "ConsentDeployed(address,address)";
      const eventHash = ethers.keccak256(ethers.toUtf8Bytes(event));

      // Filter out for the ConsentDeployed event from the receipt's logs
      // returns an array
      const consentDeployedLog = receipt.logs.filter(
        (_log) => _log.topics[0] == eventHash,
      );

      // access the data and topics from the filtered log
      const data = consentDeployedLog[0].data;
      const topics = consentDeployedLog[0].topics;

      // Declare a new interface
      const iface = new ethers.Interface([
        "event ConsentDeployed(address indexed owner, address indexed consentAddress)",
      ]);

      // Decode the log from the given data and topic
      const decodedLog = iface.decodeEventLog("ConsentDeployed", data, topics);

      const deployedConsentAddress: EVMContractAddress =
        decodedLog.consentAddress;

      return deployedConsentAddress;
    });
  }

  public getQuestionnaires(): ResultAsync<
    IpfsCID[],
    BlockchainCommonErrors | ConsentFactoryContractError
  > {
    throw new Error("Method not implemented.");
  }

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
  consentContract: EVMContractAddress;
  timeExpiring: bigint;
}

// I listingStruct { at the place where we're using it, and don't have to export here

// Alternative option is to get the deployed Consent addresses through filtering event ConsentDeployed() event

/* // TODO: Replace Promise<any> with correct types returned from ConsentDeployed() and queryFilter()
  public getConsentsDeployedByOwner(
    ownerAddress: EVMAccountAddress,
  ): ResultAsync<EVMContractAddress[], ConsentFactoryContractError> {
    return ResultAsync.fromPromise(
      this.contract.filters.ConsentDeployed(ownerAddress) as Promise<any>,
      (e) => {
        return new ConsentFactoryContractError(
          "Unable to call filters.ConsentDeployed()",
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
              "Unable to call filters.ConsentDeployed()",
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
