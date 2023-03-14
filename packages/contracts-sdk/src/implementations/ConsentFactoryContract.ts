import { IConsentFactoryContract } from "@contracts-sdk/interfaces/IConsentFactoryContract";
import {
  ConsentRoles,
  ListingSlot,
  Listing,
  WrappedTransactionResponse,
} from "@contracts-sdk/interfaces/objects";
import { ContractsAbis } from "@contracts-sdk/interfaces/objects/abi";
import {
  BaseURI,
  ConsentFactoryContractError,
  ConsentName,
  EVMAccountAddress,
  EVMContractAddress,
  IBlockchainError,
  IpfsCID,
} from "@snickerdoodlelabs/objects";
import { ethers, BigNumber } from "ethers";
import { injectable } from "inversify";
import { okAsync, Result, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

@injectable()
export class ConsentFactoryContract implements IConsentFactoryContract {
  protected contract: ethers.Contract;
  constructor(
    protected providerOrSigner:
      | ethers.providers.Provider
      | ethers.providers.JsonRpcSigner
      | ethers.Wallet,
    consentFactoryAddress: EVMContractAddress,
  ) {
    this.contract = new ethers.Contract(
      consentFactoryAddress,
      ContractsAbis.ConsentFactoryAbi.abi,
      providerOrSigner,
    );
  }

  public getContractAddress(): EVMContractAddress {
    return EVMContractAddress(this.contract?.address || "");
  }

  // Function to help user create consent
  // After creating consent, call getUserDeployedConsentsCount to get total number of deployed consents
  public createConsent(
    ownerAddress: EVMAccountAddress,
    baseUri: BaseURI,
    name: ConsentName,
  ): ResultAsync<EVMContractAddress, ConsentFactoryContractError> {
    return ResultAsync.fromPromise(
      this.contract.createConsent(
        ownerAddress,
        baseUri,
        name,
      ) as Promise<ethers.providers.TransactionResponse>,
      (e) => {
        return new ConsentFactoryContractError(
          "Unable to call createConsent()",
          (e as IBlockchainError).reason,
          e,
        );
      },
    )
      .andThen((tx) => {
        return ResultAsync.fromPromise(tx.wait(), (e) => {
          return new ConsentFactoryContractError(
            "Wait for optIn() failed",
            "Unknown",
            e,
          );
        });
      })
      .andThen((receipt) => {
        // Get the hash of the event
        const event = "ConsentDeployed(address,address)";
        const eventHash = ethers.utils.keccak256(
          ethers.utils.toUtf8Bytes(event),
        );

        // Filter out for the ConsentDeployed event from the receipt's logs
        // returns an array
        const consentDeployedLog = receipt.logs.filter(
          (_log) => _log.topics[0] == eventHash,
        );

        // access the data and topics from the filtered log
        const data = consentDeployedLog[0].data;
        const topics = consentDeployedLog[0].topics;

        // Declare a new interface
        const Interface = ethers.utils.Interface;
        const iface = new Interface([
          "event ConsentDeployed(address indexed owner, address indexed consentAddress)",
        ]);

        // Decode the log from the given data and topic
        const decodedLog = iface.decodeEventLog(
          "ConsentDeployed",
          data,
          topics,
        );

        const deployedConsentAddress = decodedLog.consentAddress;

        return okAsync(deployedConsentAddress as EVMContractAddress);
      });
  }

  // Gets the count of user's deployed Consents
  public getUserDeployedConsentsCount(
    ownerAddress: EVMAccountAddress,
  ): ResultAsync<number, ConsentFactoryContractError> {
    return ResultAsync.fromPromise(
      this.contract.getUserDeployedConsentsCount(
        ownerAddress,
      ) as Promise<BigNumber>,
      (e) => {
        return new ConsentFactoryContractError(
          "Unable to call getUserDeployedConsentsCount()",
          (e as IBlockchainError).reason,
          e,
        );
      },
    ).map((count) => {
      return count.toNumber();
    });
  }

  // Gets the array of user deployed Consents by index count
  // Index values can be anywhere between the count obtained from getUserDeployedConsentsCount
  // eg. If user has [0x123, 0xabc, 0x456] Consent contracts, query with startingIndex 0 and endingIndex 2 to get full list
  public getUserDeployedConsentsByIndex(
    ownerAddress: EVMAccountAddress,
    startingIndex: number,
    endingIndex: number,
  ): ResultAsync<EVMContractAddress[], ConsentFactoryContractError> {
    return ResultAsync.fromPromise(
      this.contract.getUserDeployedConsentsByIndex(
        ownerAddress,
        startingIndex,
        endingIndex,
      ) as Promise<EVMContractAddress[]>,
      (e) => {
        return new ConsentFactoryContractError(
          "Unable to call getUserDeployedConsentsByIndex()",
          (e as IBlockchainError).reason,
          e,
        );
      },
    );
  }

  // get the latest deployed consent address by owner account address
  public getUserDeployedConsents(
    ownerAddress: EVMAccountAddress,
  ): ResultAsync<EVMContractAddress[], ConsentFactoryContractError> {
    return this.getUserDeployedConsentsCount(ownerAddress).andThen((count) => {
      return this.getUserDeployedConsentsByIndex(ownerAddress, 0, count);
    });
  }

  // Gets the count of Consent addresses user has specific roles for
  public getUserRoleAddressesCount(
    ownerAddress: EVMAccountAddress,
    role: ConsentRoles,
  ): ResultAsync<number, ConsentFactoryContractError> {
    return ResultAsync.fromPromise(
      this.contract.getUserConsentAddressesCount(
        ownerAddress,
        role,
      ) as Promise<BigNumber>,
      (e) => {
        return new ConsentFactoryContractError(
          "Unable to call getUserRoleAddressesCount()",
          (e as IBlockchainError).reason,
          e,
        );
      },
    ).map((count) => {
      return count.toNumber();
    });
  }

  // Gets the array of Consent addresses user has specific roles for
  // Index values can be anywhere between the count obtained from getUserRoleAddressesCount
  // eg. If user has [0x123, 0xabc, 0x456] Consent contracts, query with startingIndex 0 and endingIndex 2 to get full list
  public getUserRoleAddressesCountByIndex(
    ownerAddress: EVMAccountAddress,
    role: ConsentRoles,
    startingIndex: number,
    endingIndex: number,
  ): ResultAsync<EVMContractAddress[], ConsentFactoryContractError> {
    return ResultAsync.fromPromise(
      this.contract.getUserRoleAddressesCountByIndex(
        ownerAddress,
        role,
        startingIndex,
        endingIndex,
      ) as Promise<EVMContractAddress[]>,
      (e) => {
        return new ConsentFactoryContractError(
          "Unable to call filters.getUserRoleAddressesCountByIndex()",
          (e as IBlockchainError).reason,
          e,
        );
      },
    );
  }

  public getDeployedConsents(): ResultAsync<
    EVMContractAddress[],
    ConsentFactoryContractError
  > {
    const eventFilter = this.contract.filters.ConsentDeployed();
    return ResultAsync.fromPromise(
      this.contract.queryFilter(eventFilter),
      (e) => {
        return new ConsentFactoryContractError(
          "Unable to call contract.queryFilter() for ConsentDeployed event",
          (e as IBlockchainError).reason,
          e,
        );
      },
    ).map((events) => {
      const consents: EVMContractAddress[] = [];
      events.forEach((event) => {
        if (event?.args?.consentAddress) {
          consents.push(EVMContractAddress(event.args.consentAddress));
        }
      });
      return consents;
    });
  }

  // Marketplace functions
  public getMaxTagsPerListing(): ResultAsync<
    number,
    ConsentFactoryContractError
  > {
    return ResultAsync.fromPromise(
      this.contract.maxTagsPerListing() as Promise<BigNumber>,
      (e) => {
        return new ConsentFactoryContractError(
          "Unable to call getMaxTagsPerListing()",
          (e as IBlockchainError).reason,
          e,
        );
      },
    ).map((num) => {
      return num.toNumber();
    });
  }

  public getNumberOfListings(
    tag: string,
  ): ResultAsync<number, ConsentFactoryContractError> {
    const key = ethers.utils.keccak256(ethers.utils.toUtf8String(tag));
    return ResultAsync.fromPromise(
      this.contract.listingTotals(key) as Promise<BigNumber>,
      (e) => {
        return new ConsentFactoryContractError(
          "Unable to call getNumberOfListings()",
          (e as IBlockchainError).reason,
          e,
        );
      },
    ).map((num) => {
      return num.toNumber();
    });
  }

  public getListingDuration(): ResultAsync<
    number,
    ConsentFactoryContractError
  > {
    return ResultAsync.fromPromise(
      this.contract.getListingDuration() as Promise<BigNumber>,
      (e) => {
        return new ConsentFactoryContractError(
          "Unable to call getListingDuration()",
          (e as IBlockchainError).reason,
          e,
        );
      },
    ).map((num) => {
      return num.toNumber();
    });
  }

  public setListingDuration(
    listingDuration: number,
  ): ResultAsync<WrappedTransactionResponse, ConsentFactoryContractError> {
    return ResultAsync.fromPromise(
      this.contract.setListingDuration(
        listingDuration,
      ) as Promise<WrappedTransactionResponse>,
      (e) => {
        return new ConsentFactoryContractError(
          "Unable to call setListingDuration()",
          (e as IBlockchainError).reason,
          e,
        );
      },
    );
  }

  public setMaxTagsPerListing(
    maxTagsPerListing: number,
  ): ResultAsync<WrappedTransactionResponse, ConsentFactoryContractError> {
    return ResultAsync.fromPromise(
      this.contract.setMaxTagsPerListing(
        maxTagsPerListing,
      ) as Promise<WrappedTransactionResponse>,
      (e) => {
        return new ConsentFactoryContractError(
          "Unable to call setListingDuration()",
          (e as IBlockchainError).reason,
          e,
        );
      },
    );
  }

  public initializeTag(
    tag: string,
    newHead: ListingSlot,
  ): ResultAsync<WrappedTransactionResponse, ConsentFactoryContractError> {
    return ResultAsync.fromPromise(
      this.contract.initializeTag(
        tag,
        newHead,
      ) as Promise<WrappedTransactionResponse>,
      (e) => {
        return new ConsentFactoryContractError(
          "Unable to call initializeTag()",
          (e as IBlockchainError).reason,
          e,
        );
      },
    );
  }

  public insertUpstream(
    tag: string,
    newSlot: ListingSlot,
    existingSlot: ListingSlot,
  ): ResultAsync<WrappedTransactionResponse, ConsentFactoryContractError> {
    return ResultAsync.fromPromise(
      this.contract.insertUpstream(
        tag,
        newSlot,
        existingSlot,
      ) as Promise<ethers.providers.TransactionResponse>,
      (e) => {
        return new ConsentFactoryContractError(
          "Unable to call insertUpstream()",
          (e as IBlockchainError).reason,
          e,
        );
      },
    ).map((tx) => {
      return new WrappedTransactionResponse(tx);
    });
  }

  public insertDownstream(
    tag: string,
    existingSlot: ListingSlot,
    newSlot: ListingSlot,
  ): ResultAsync<WrappedTransactionResponse, ConsentFactoryContractError> {
    return ResultAsync.fromPromise(
      this.contract.insertUpstream(
        tag,
        existingSlot,
        newSlot,
      ) as Promise<ethers.providers.TransactionResponse>,
      (e) => {
        return new ConsentFactoryContractError(
          "Unable to call insertDownstream()",
          (e as IBlockchainError).reason,
          e,
        );
      },
    ).map((tx) => {
      return new WrappedTransactionResponse(tx);
    });
  }

  public replaceExpiredListing(
    tag: string,
    slot: ListingSlot,
  ): ResultAsync<WrappedTransactionResponse, ConsentFactoryContractError> {
    return ResultAsync.fromPromise(
      this.contract.replaceExpiredListing(
        tag,
        slot,
      ) as Promise<ethers.providers.TransactionResponse>,
      (e) => {
        return new ConsentFactoryContractError(
          "Unable to call insertDownstream()",
          (e as IBlockchainError).reason,
          e,
        );
      },
    ).map((tx) => {
      return new WrappedTransactionResponse(tx);
    });
  }

  public removeListing(
    tag: string,
    removedSlot: ListingSlot,
  ): ResultAsync<WrappedTransactionResponse, ConsentFactoryContractError> {
    return ResultAsync.fromPromise(
      this.contract.replaceExpiredListing(
        tag,
        removedSlot,
      ) as Promise<ethers.providers.TransactionResponse>,
      (e) => {
        return new ConsentFactoryContractError(
          "Unable to call removeListing()",
          (e as IBlockchainError).reason,
          e,
        );
      },
    ).map((tx) => {
      return new WrappedTransactionResponse(tx);
    });
  }

  public adminRemoveListing(
    tag: string,
    removedSlot: ListingSlot,
  ): ResultAsync<WrappedTransactionResponse, ConsentFactoryContractError> {
    return ResultAsync.fromPromise(
      this.contract.adminRemoveListing(
        tag,
        removedSlot,
      ) as Promise<ethers.providers.TransactionResponse>,
      (e) => {
        return new ConsentFactoryContractError(
          "Unable to call adminRemoveListing()",
          (e as IBlockchainError).reason,
          e,
        );
      },
    ).map((tx) => {
      return new WrappedTransactionResponse(tx);
    });
  }

  public getListingDetail(
    tag: string,
    slot: ListingSlot,
  ): ResultAsync<Listing, ConsentFactoryContractError> {
    return ResultAsync.fromPromise(
      this.contract.getListing(tag, slot) as Promise<Listing>,
      (e) => {
        return new ConsentFactoryContractError(
          "Unable to call getListing()",
          (e as IBlockchainError).reason,
          e,
        );
      },
    );
  }

  public getListingsForward(
    tag: string,
    startingSlot: ListingSlot,
    numberOfSlots: ListingSlot,
  ): ResultAsync<Listing[], ConsentFactoryContractError> {
    return ResultAsync.fromPromise(
      this.contract.getListingsForward(
        tag,
        startingSlot,
        numberOfSlots,
      ) as Promise<[string[], Listing[]]>,
      (e) => {
        return new ConsentFactoryContractError(
          "Unable to call getListingsForward()",
          (e as IBlockchainError).reason,
          e,
        );
      },
    ).map(([cids, listings]) => {
      return listings.map((listing, index) => {
        return new Listing(
          listing.previous,
          listing.next,
          listing.consentContract,
          listing.timeExpiring,
          IpfsCID(cids[index]),
        );
      });
    });
  }

  public getListingsBackward(
    tag: string,
    startingSlot: ListingSlot,
    numberOfSlots: number,
    filterActive: boolean,
  ): ResultAsync<Listing[], ConsentFactoryContractError> {
    return ResultAsync.fromPromise(
      this.contract.getListingsForward(
        tag,
        startingSlot,
        numberOfSlots,
        filterActive,
      ) as Promise<[string[], Listing[]]>,
      (e) => {
        return new ConsentFactoryContractError(
          "Unable to call getListingsForward()",
          (e as IBlockchainError).reason,
          e,
        );
      },
    ).map(([cids, listings]) => {
      return listings.map((listing, index) => {
        return new Listing(
          listing.previous,
          listing.next,
          listing.consentContract,
          listing.timeExpiring,
          IpfsCID(cids[index]),
        );
      });
    });
  }

  public getTagTotal(
    tag: string,
  ): ResultAsync<number, ConsentFactoryContractError> {
    return ResultAsync.fromPromise(
      this.contract.getTagTotal(tag) as Promise<BigNumber>,
      (e) => {
        return new ConsentFactoryContractError(
          "Unable to call getTagTotal()",
          (e as IBlockchainError).reason,
          e,
        );
      },
    ).map((count) => {
      return count.toNumber();
    });
  }
}
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
