import { WrappedTransactionResponseBuilder } from "@contracts-sdk/implementations/WrappedTransactionResponseBuilder";
import { IConsentFactoryContract } from "@contracts-sdk/interfaces/IConsentFactoryContract";
import {
  ConsentRoles,
  ContractOverrides,
  WrappedTransactionResponse,
} from "@contracts-sdk/interfaces/objects";
import { ContractsAbis } from "@contracts-sdk/interfaces/objects/abi";
import {
  BaseURI,
  BigNumberString,
  ConsentFactoryContractError,
  ConsentName,
  EVMAccountAddress,
  EVMContractAddress,
  IBlockchainError,
  IpfsCID,
  MarketplaceListing,
  MarketplaceTag,
  UnixTimestamp,
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

  public createConsent(
    ownerAddress: EVMAccountAddress,
    baseUri: BaseURI,
    name: ConsentName,
    overrides?: ContractOverrides,
  ): ResultAsync<WrappedTransactionResponse, ConsentFactoryContractError> {
    return this.writeToContract(
      "createConsent",
      [ownerAddress, baseUri, name],
      overrides,
    );
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
    overrides?: ContractOverrides,
  ): ResultAsync<WrappedTransactionResponse, ConsentFactoryContractError> {
    return this.writeToContract(
      "setListingDuration",
      [listingDuration],
      overrides,
    );
  }

  public setMaxTagsPerListing(
    maxTagsPerListing: number,
    overrides?: ContractOverrides,
  ): ResultAsync<WrappedTransactionResponse, ConsentFactoryContractError> {
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
  ): ResultAsync<WrappedTransactionResponse, ConsentFactoryContractError> {
    return this.writeToContract(
      "setMaxTagsPerListing",
      [tag, removedSlot],
      overrides,
    );
  }

  public getListingDetail(
    tag: MarketplaceTag,
    slot: BigNumberString,
  ): ResultAsync<MarketplaceListing, ConsentFactoryContractError> {
    return ResultAsync.fromPromise(
      this.contract.getListing(tag, slot) as Promise<IListingStruct>,
      (e) => {
        return new ConsentFactoryContractError(
          "Unable to call getListing()",
          (e as IBlockchainError).reason,
          e,
        );
      },
    ).map((listing) => {
      return new MarketplaceListing(
        BigNumberString(listing.previous.toString()),
        BigNumberString(listing.next.toString()),
        listing.consentContract,
        UnixTimestamp(listing.timeExpiring?.toNumber()),
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
    filterActive: boolean,
  ): ResultAsync<MarketplaceListing[], ConsentFactoryContractError> {
    return ResultAsync.fromPromise(
      this.contract.getListingsForward(
        tag,
        startingSlot,
        numberOfSlots,
        filterActive,
      ) as Promise<[string[], IListingStruct[]]>,
      (e) => {
        return new ConsentFactoryContractError(
          "Unable to call getListingsForward()",
          (e as IBlockchainError).reason,
          e,
        );
      },
    ).map(([cids, listings]) => {
      return listings
        .map((listing, index) => {
          return new MarketplaceListing(
            BigNumberString(listing.previous.toString()),
            BigNumberString(listing.next.toString()),
            listing.consentContract,
            UnixTimestamp(listing.timeExpiring.toNumber()),
            IpfsCID(cids[index]),
            listings[index + 1] != null && listing.next.isZero() === false
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
    filterActive: boolean,
  ): ResultAsync<MarketplaceListing[], ConsentFactoryContractError> {
    return ResultAsync.fromPromise(
      this.contract.getListingsForward(
        tag,
        startingSlot,
        numberOfSlots,
        filterActive,
      ) as Promise<[string[], IListingStruct[]]>,
      (e) => {
        return new ConsentFactoryContractError(
          "Unable to call getListingsForward()",
          (e as IBlockchainError).reason,
          e,
        );
      },
    ).map(([cids, listings]) => {
      return listings
        .map((listing, index) => {
          return new MarketplaceListing(
            BigNumberString(listing.previous.toString()),
            BigNumberString(listing.next.toString()),
            listing.consentContract,
            UnixTimestamp(listing.timeExpiring?.toNumber()),
            IpfsCID(cids[index]),
            listings[index + 1] != null &&
            listing.previous.eq(ethers.constants.MaxUint256) === false
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

  public getListingsByTag(
    tag: MarketplaceTag,
  ): ResultAsync<MarketplaceListing[], ConsentFactoryContractError> {
    // We get the total number of slots by calling getTagTotal()
    // And if we query the 2^256 - 1 slot by calling getListingDetail(), its previous member variable will point to the highest ranked listing for that tag
    return ResultUtils.combine([
      this.getTagTotal(tag),
      this.getListingDetail(
        tag,
        BigNumberString(ethers.constants.MaxUint256.toString()),
      ),
    ]).andThen(([tagTotal, listingDetail]) => {
      // The max slot's next points to the highest slot
      const highestRankListingSlot = listingDetail.next;

      // Fetch from the highest to lowest listings
      return this.getListingsForward(
        tag,
        highestRankListingSlot,
        tagTotal,
        true,
      );
    });
  }

  // Takes the Consent contract's function name and params, submits the transaction and returns a WrappedTransactionResponse
  protected writeToContract(
    functionName: string,
    functionParams: any[],
    overrides?: ContractOverrides,
  ): ResultAsync<WrappedTransactionResponse, ConsentFactoryContractError> {
    return ResultAsync.fromPromise(
      this.contract[functionName](...functionParams, {
        ...overrides,
      }) as Promise<ethers.providers.TransactionResponse>,
      (e) => {
        return new ConsentFactoryContractError(
          `Unable to call ${functionName}()`,
          (e as IBlockchainError).reason,
          e,
        );
      },
    ).map((tx) => {
      return this.toWrappedTransactionResponse(
        tx,
        functionName,
        functionParams,
      );
    });
  }

  protected toWrappedTransactionResponse(
    transactionResponse: ethers.providers.TransactionResponse,
    functionName: string,
    functionParams: any[],
  ): WrappedTransactionResponse {
    return WrappedTransactionResponseBuilder.buildWrappedTransactionResponse(
      transactionResponse,
      EVMContractAddress(this.contract.address),
      EVMAccountAddress((this.providerOrSigner as ethers.Wallet)?.address),
      functionName,
      functionParams,
      ContractsAbis.ConsentFactoryAbi.abi,
    );
  }
}
interface IListingStruct {
  previous: BigNumber;
  next: BigNumber;
  consentContract: EVMContractAddress;
  timeExpiring: BigNumber;
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
