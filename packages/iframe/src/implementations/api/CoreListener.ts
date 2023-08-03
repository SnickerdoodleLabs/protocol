import { ICoreListener } from "@core-iframe/interfaces/api/index";
import {
  IAccountService,
  IAccountServiceType,
} from "@core-iframe/interfaces/business/index";
import {
  IConfigProvider,
  IConfigProviderType,
  ICoreProvider,
  ICoreProviderType,
} from "@core-iframe/interfaces/utilities/index";
import {
  ICryptoUtils,
  ICryptoUtilsType,
  ILogUtils,
  ILogUtilsType,
  ITimeUtils,
  ITimeUtilsType,
} from "@snickerdoodlelabs/common-utils";
import {
  AccountAddress,
  BigNumberString,
  ChainId,
  CountryCode,
  DataPermissions,
  DiscordID,
  DomainName,
  EChain,
  EDataWalletPermission,
  EVMContractAddress,
  EWalletDataType,
  EmailAddressString,
  FamilyName,
  Gender,
  GivenName,
  IConfigOverrides,
  Invitation,
  IpfsCID,
  LanguageCode,
  MarketplaceTag,
  OAuth1RequstToken,
  OAuthAuthorizationCode,
  OAuthVerifier,
  PagingRequest,
  Signature,
  SiteVisit,
  TokenAddress,
  TokenId,
  TwitterID,
  URLString,
  UnixTimestamp,
  ECloudStorageType,
  AccessToken,
} from "@snickerdoodlelabs/objects";
import {
  IIFrameCallData,
  ChildProxy,
  IStorageUtilsType,
  IStorageUtils,
} from "@snickerdoodlelabs/utils";
import { injectable, inject } from "inversify";
import { okAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import Postmate from "postmate";
import { parse } from "tldts";
@injectable()
export class CoreListener extends ChildProxy implements ICoreListener {
  // Get the source domain
  protected sourceDomain = DomainName(document.location.ancestorOrigins[0]);

  constructor(
    @inject(IAccountServiceType) protected accountService: IAccountService,
    @inject(IStorageUtilsType) protected storageUtils: IStorageUtils,
    @inject(ICoreProviderType) protected coreProvider: ICoreProvider,
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
    @inject(ITimeUtilsType) protected timeUtils: ITimeUtils,
    @inject(ICryptoUtilsType) protected cryptoUtils: ICryptoUtils,
  ) {
    super();
  }

  protected getModel(): Postmate.Model {
    const sourceDomain = this.configProvider.getConfig().sourceDomain;

    // Fire up the Postmate model, and wrap up the core as the model
    return new Postmate.Model({
      /**
       * This method must occur before any of the others will work.
       * First thing the proxy does after the initial handshake is
       * pass over the config data.
       * @param data
       */
      setConfig: (data: IIFrameCallData<IConfigOverrides>) => {
        this.returnForModel(() => {
          return this.coreProvider.setConfig(data.data);
        }, data.callId);
      },
      unlock: (
        data: IIFrameCallData<{
          accountAddress: AccountAddress;
          signature: Signature;
          languageCode: LanguageCode;
          chain: EChain;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.account
              .unlock(
                data.data.accountAddress,
                data.data.signature,
                data.data.languageCode,
                data.data.chain,
                sourceDomain,
              )
              .andThen(() => {
                // Store the unlock values in local storage
                console.log("Storing unlock values in local storage");
                return ResultUtils.combine([
                  this.storageUtils.write(
                    "storedAccountAddress",
                    data.data.accountAddress,
                  ),
                  this.storageUtils.write(
                    "storedSignature",
                    data.data.signature,
                  ),
                  this.storageUtils.write("storedChain", data.data.chain),
                  this.storageUtils.write(
                    "storedLanguageCode",
                    data.data.languageCode,
                  ),
                ])
                  .map(() => {})
                  .orElse((e) => {
                    console.error("Error storing unlock values", e);
                    return okAsync(undefined);
                  });
              })
              .andThen(() => {
                // We want to record the sourceDomain as a site visit
                return core.addSiteVisits([
                  new SiteVisit(
                    URLString(this.sourceDomain), // We can't get the full URL, but the domain will suffice
                    this.timeUtils.getUnixNow(), // Visit started now
                    UnixTimestamp(this.timeUtils.getUnixNow() + 10), // We're not going to wait, so just record the visit as for 10 seconds
                  ),
                ]);
              });
          });
        }, data.callId);
      },

      addAccount: (
        data: IIFrameCallData<{
          accountAddress: AccountAddress;
          signature: Signature;
          languageCode: LanguageCode;
          chain: EChain;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            // We need to get a signature for this account
            return core.account.addAccount(
              data.data.accountAddress,
              data.data.signature,
              data.data.languageCode,
              data.data.chain,
              sourceDomain,
            );
          });
        }, data.callId);
      },

      getLinkAccountMessage: (
        data: IIFrameCallData<{
          languageCode: LanguageCode;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.account.getLinkAccountMessage(
              data.data.languageCode,
              sourceDomain,
            );
          });
        }, data.callId);
      },

      getAge: (data: IIFrameCallData<Record<string, never>>) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.getAge(sourceDomain);
          });
        }, data.callId);
      },

      setGivenName: (
        data: IIFrameCallData<{
          givenName: GivenName;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.setGivenName(data.data.givenName, sourceDomain);
          });
        }, data.callId);
      },

      getGivenName: (data: IIFrameCallData<Record<string, never>>) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.getGivenName(sourceDomain);
          });
        }, data.callId);
      },

      setFamilyName: (
        data: IIFrameCallData<{
          familyName: FamilyName;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.setFamilyName(data.data.familyName, sourceDomain);
          });
        }, data.callId);
      },

      getFamilyName: (data: IIFrameCallData<Record<string, never>>) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.getFamilyName(sourceDomain);
          });
        }, data.callId);
      },

      setBirthday: (
        data: IIFrameCallData<{
          birthday: UnixTimestamp;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.setBirthday(data.data.birthday, sourceDomain);
          });
        }, data.callId);
      },

      getBirthday: (data: IIFrameCallData<Record<string, never>>) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.getBirthday(sourceDomain);
          });
        }, data.callId);
      },

      setGender: (
        data: IIFrameCallData<{
          gender: Gender;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.setGender(data.data.gender, sourceDomain);
          });
        }, data.callId);
      },

      getGender: (data: IIFrameCallData<Record<string, never>>) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.getGender(sourceDomain);
          });
        }, data.callId);
      },

      setEmail: (
        data: IIFrameCallData<{
          email: EmailAddressString;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.setEmail(data.data.email, sourceDomain);
          });
        }, data.callId);
      },

      getEmail: (data: IIFrameCallData<Record<string, never>>) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.getEmail(sourceDomain);
          });
        }, data.callId);
      },

      setLocation: (
        data: IIFrameCallData<{
          location: CountryCode;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.setLocation(data.data.location, sourceDomain);
          });
        }, data.callId);
      },

      getLocation: (data: IIFrameCallData<Record<string, never>>) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.getLocation(sourceDomain);
          });
        }, data.callId);
      },

      getAccounts: (data: IIFrameCallData<Record<string, never>>) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            // TODO- make this provide the source domain after
            // we have an interface to grant permissions
            // return core.getAccounts(sourceDomain);
            return core.getAccounts();
          });
        }, data.callId);
      },

      getTokenPrice: (
        data: IIFrameCallData<{
          chainId: ChainId;
          address: TokenAddress | null;
          timestamp: UnixTimestamp;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.getTokenPrice(
              data.data.chainId,
              data.data.address,
              data.data.timestamp,
              sourceDomain,
            );
          });
        }, data.callId);
      },

      getTokenMarketData: (
        data: IIFrameCallData<{
          ids: string[];
        }>,
      ) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.getTokenMarketData(data.data.ids, sourceDomain);
          });
        }, data.callId);
      },

      getTokenInfo: (
        data: IIFrameCallData<{
          chainId: ChainId;
          contractAddress: TokenAddress | null;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.getTokenInfo(
              data.data.chainId,
              data.data.contractAddress,
              sourceDomain,
            );
          });
        }, data.callId);
      },

      getAccountBalances: (data: IIFrameCallData<Record<string, never>>) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.getAccountBalances(sourceDomain);
          });
        }, data.callId);
      },

      getAccountNFTs: (data: IIFrameCallData<Record<string, never>>) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.getAccountNFTs(sourceDomain);
          });
        }, data.callId);
      },

      // closeTab: (data: IIFrameCallData<Record<string, never>>) => {
      //   this.returnForModel(() => {
      //     return core.closeTab(sourceDomain);
      //   }, data.callId);
      // },

      // getDataWalletAddress: (data: IIFrameCallData<Record<string, never>>) => {
      //   this.returnForModel(() => {
      //     return core.account.(sourceDomain);
      //   }, data.callId);
      // },

      getAcceptedInvitationsCID: (
        data: IIFrameCallData<Record<string, never>>,
      ) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.invitation.getAcceptedInvitationsCID(sourceDomain);
          });
        }, data.callId);
      },

      getAvailableInvitationsCID: (
        data: IIFrameCallData<Record<string, never>>,
      ) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.invitation.getAvailableInvitationsCID(sourceDomain);
          });
        }, data.callId);
      },

      getInvitationMetadataByCID: (
        data: IIFrameCallData<{
          ipfsCID: IpfsCID;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.invitation.getInvitationMetadataByCID(
              data.data.ipfsCID,
            );
          });
        }, data.callId);
      },

      getAgreementPermissions: (
        data: IIFrameCallData<{
          consentContractAddress: EVMContractAddress;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.invitation
              .getAgreementFlags(data.data.consentContractAddress, sourceDomain)
              .map((flags) => {
                return DataPermissions.getDataTypesFromFlags(flags);
              });
          });
        }, data.callId);
      },

      // getApplyDefaultPermissionsOption: (
      //   data: IIFrameCallData<Record<string, never>>,
      // ) => {
      //   this.returnForModel(() => {
      //     return core.get(
      //       sourceDomain,
      //     );
      //   }, data.callId);
      // },

      // setApplyDefaultPermissionsOption: (
      //   data: IIFrameCallData<Record<string, never>>,
      // ) => {
      //   this.returnForModel(() => {
      //     return core.get(
      //       sourceDomain,
      //     );
      //   }, data.callId);
      // },

      // getDefaultPermissions: (
      //   data: IIFrameCallData<Record<string, never>>,
      // ) => {
      //   this.returnForModel(() => {
      //     return core.get(
      //       sourceDomain,
      //     );
      //   }, data.callId);
      // },

      // setDefaultPermissions: (
      //   data: IIFrameCallData<Record<string, never>>,
      // ) => {
      //   this.returnForModel(() => {
      //     return core.get(
      //       sourceDomain,
      //     );
      //   }, data.callId);
      // },

      // getScamFilterSettings: (
      //   data: IIFrameCallData<Record<string, never>>,
      // ) => {
      //   this.returnForModel(() => {
      //     return core.get(
      //       sourceDomain,
      //     );
      //   }, data.callId);
      // },

      // setScamFilterSettings: (
      //   data: IIFrameCallData<Record<string, never>>,
      // ) => {
      //   this.returnForModel(() => {
      //     return core.get(
      //       sourceDomain,
      //     );
      //   }, data.callId);
      // },

      // setDefaultPermissionsToAll: (
      //   data: IIFrameCallData<Record<string, never>>,
      // ) => {
      //   this.returnForModel(() => {
      //     return core.get(
      //       sourceDomain,
      //     );
      //   }, data.callId);
      // },

      getInvitationByDomain: (
        data: IIFrameCallData<{
          domain: DomainName;
          path: string;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.invitation
              .getInvitationsByDomain(data.data.domain)
              .andThen((pageInvitations) => {
                const pageInvitation = pageInvitations.find((value) => {
                  const incomingUrl = value.url.replace(/^https?:\/\//, "");
                  const incomingUrlInfo = parse(incomingUrl);
                  if (
                    !incomingUrlInfo.subdomain &&
                    parse(data.data.path).subdomain
                  ) {
                    return (
                      `${"www"}.${incomingUrl.replace(/\/$/, "")}` ===
                      data.data.path
                    );
                  }
                  return incomingUrl.replace(/\/$/, "") === data.data.path;
                });
                if (pageInvitation) {
                  return okAsync(pageInvitation);
                } else {
                  return okAsync(null);
                }
              });
          });
        }, data.callId);
      },

      acceptInvitation: (
        data: IIFrameCallData<{
          dataTypes: EWalletDataType[] | null;
          consentContractAddress: EVMContractAddress;
          tokenId?: BigNumberString;
          businessSignature?: Signature;
        }>,
      ) => {
        this.returnForModel(() => {
          return this._getTokenId(data.data.tokenId).andThen((tokenId) => {
            return this.coreProvider.getCore().andThen((core) => {
              return core.invitation.acceptInvitation(
                new Invitation(
                  "" as DomainName,
                  data.data.consentContractAddress,
                  tokenId,
                  data.data.businessSignature ?? null,
                ),
                data.data.dataTypes
                  ? DataPermissions.createWithPermissions(data.data.dataTypes)
                  : null,
                sourceDomain,
              );
            });
          });
        }, data.callId);
      },

      rejectInvitation: (
        data: IIFrameCallData<{
          consentContractAddress: EVMContractAddress;
          tokenId?: BigNumberString;
          businessSignature?: Signature;
          rejectUntil?: UnixTimestamp,
        }>,
      ) => {
        this.returnForModel(() => {
          return this._getTokenId(data.data.tokenId).andThen((tokenId) => {
            return this.coreProvider.getCore().andThen((core) => {
              return core.invitation.rejectInvitation(
                new Invitation(
                  "" as DomainName,
                  data.data.consentContractAddress,
                  tokenId,
                  data.data.businessSignature ?? null,
                ),
                data.data.rejectUntil,
                sourceDomain,
              );
            });
          });
        }, data.callId);
      },

      leaveCohort: (
        data: IIFrameCallData<{
          consentContractAddress: EVMContractAddress;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.invitation.leaveCohort(
              data.data.consentContractAddress,
              sourceDomain,
            );
          });
        }, data.callId);
      },

      unlinkAccount: (
        data: IIFrameCallData<{
          accountAddress: AccountAddress;
          signature: Signature;
          languageCode: LanguageCode;
          chain: EChain;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.account.unlinkAccount(
              data.data.accountAddress,
              data.data.signature,
              data.data.languageCode,
              data.data.chain,
              sourceDomain,
            );
          });
        }, data.callId);
      },

      checkInvitationStatus: (
        data: IIFrameCallData<{
          consentAddress: EVMContractAddress;
          signature?: Signature;
          tokenId?: BigNumberString;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.invitation.checkInvitationStatus(
              new Invitation(
                DomainName(""),
                data.data.consentAddress,
                data.data.tokenId != null
                  ? TokenId(BigInt(data.data.tokenId))
                  : TokenId(BigInt(0)),
                data.data.signature ?? null,
              ),
              sourceDomain,
            );
          });
        }, data.callId);
      },

      getConsentContractCID: (
        data: IIFrameCallData<{
          consentAddress: EVMContractAddress;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.getConsentContractCID(data.data.consentAddress);
          });
        }, data.callId);
      },

      getEarnedRewards: (data: IIFrameCallData<Record<string, never>>) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.getEarnedRewards(sourceDomain);
          });
        }, data.callId);
      },

      getSiteVisits: (data: IIFrameCallData<Record<string, never>>) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.getSiteVisits(sourceDomain);
          });
        }, data.callId);
      },

      getSiteVisitsMap: (data: IIFrameCallData<Record<string, never>>) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.getSiteVisitsMap(sourceDomain);
          });
        }, data.callId);
      },

      getMarketplaceListingsByTag: (
        data: IIFrameCallData<{
          pagingReq: PagingRequest;
          tag: MarketplaceTag;
          filterActive?: boolean;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.marketplace.getMarketplaceListingsByTag(
              data.data.pagingReq,
              data.data.tag,
              data.data.filterActive ?? true,
            );
          });
        }, data.callId);
      },

      getListingsTotalByTag: (
        data: IIFrameCallData<{
          tag: MarketplaceTag;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.marketplace.getListingsTotalByTag(data.data.tag);
          });
        }, data.callId);
      },

      setDefaultReceivingAddress: (
        data: IIFrameCallData<{
          receivingAddress: AccountAddress | null;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.setDefaultReceivingAddress(
              data.data.receivingAddress,
              sourceDomain,
            );
          });
        }, data.callId);
      },

      setReceivingAddress: (
        data: IIFrameCallData<{
          contractAddress: EVMContractAddress;
          receivingAddress: AccountAddress | null;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.setReceivingAddress(
              data.data.contractAddress,
              data.data.receivingAddress,
              sourceDomain,
            );
          });
        }, data.callId);
      },

      getReceivingAddress: (
        data: IIFrameCallData<{
          contractAddress?: EVMContractAddress;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.getReceivingAddress(
              data.data.contractAddress,
              sourceDomain,
            );
          });
        }, data.callId);
      },

      getConsentCapacity: (
        data: IIFrameCallData<{
          contractAddress: EVMContractAddress;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.getConsentCapacity(data.data.contractAddress);
          });
        }, data.callId);
      },

      getPossibleRewards: (
        data: IIFrameCallData<{
          contractAddresses: EVMContractAddress[];
          timeoutMs?: number;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.marketplace.getPossibleRewards(
              data.data.contractAddresses,
              data.data.timeoutMs,
            );
          });
        }, data.callId);
      },

      getQueryStatusByQueryCID: (
        data: IIFrameCallData<{
          queryCID: IpfsCID;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.getQueryStatusByQueryCID(data.data.queryCID);
          });
        }, data.callId);
      },

      "discord.initializeUserWithAuthorizationCode": (
        data: IIFrameCallData<{
          code: OAuthAuthorizationCode;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.discord.initializeUserWithAuthorizationCode(
              data.data.code,
              sourceDomain,
            );
          });
        }, data.callId);
      },

      "discord.installationUrl": (
        data: IIFrameCallData<{
          redirectTabId?: number;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.discord.installationUrl(
              data.data.redirectTabId,
              sourceDomain,
            );
          });
        }, data.callId);
      },

      "discord.getUserProfiles": (
        data: IIFrameCallData<Record<string, never>>,
      ) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.discord.getUserProfiles(sourceDomain);
          });
        }, data.callId);
      },

      "discord.getGuildProfiles": (
        data: IIFrameCallData<Record<string, never>>,
      ) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.discord.getGuildProfiles(sourceDomain);
          });
        }, data.callId);
      },

      "discord.unlink": (
        data: IIFrameCallData<{
          discordProfileId: DiscordID;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.discord.unlink(
              data.data.discordProfileId,
              sourceDomain,
            );
          });
        }, data.callId);
      },

      "integration.requestPermissions": (
        data: IIFrameCallData<{
          permissions: EDataWalletPermission[];
        }>,
      ) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.integration.requestPermissions(
              data.data.permissions,
              sourceDomain,
            );
          });
        }, data.callId);
      },

      "integration.getPermissions": (
        data: IIFrameCallData<{
          domain: DomainName;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.integration.getPermissions(
              data.data.domain,
              sourceDomain,
            );
          });
        }, data.callId);
      },

      "integration.getTokenVerificationPublicKey": (
        data: IIFrameCallData<{
          domain: DomainName;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.integration.getTokenVerificationPublicKey(
              data.data.domain,
            );
          });
        }, data.callId);
      },

      "integration.getBearerToken": (
        data: IIFrameCallData<{
          nonce: string;
          domain: DomainName;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.integration.getBearerToken(
              data.data.nonce,
              data.data.domain,
            );
          });
        }, data.callId);
      },

      "metrics.getMetrics": (data: IIFrameCallData<Record<string, never>>) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.metrics.getMetrics(sourceDomain);
          });
        }, data.callId);
      },
      "metrics.getUnlocked": (data: IIFrameCallData<Record<string, never>>) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.metrics.getUnlocked(sourceDomain);
          });
        }, data.callId);
      },

      "twitter.getOAuth1aRequestToken": (
        data: IIFrameCallData<Record<string, never>>,
      ) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.twitter.getOAuth1aRequestToken(sourceDomain);
          });
        }, data.callId);
      },
      "twitter.initTwitterProfile": (
        data: IIFrameCallData<{
          requestToken: OAuth1RequstToken;
          oAuthVerifier: OAuthVerifier;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.twitter.initTwitterProfile(
              data.data.requestToken,
              data.data.oAuthVerifier,
              sourceDomain,
            );
          });
        }, data.callId);
      },
      "twitter.unlinkProfile": (
        data: IIFrameCallData<{
          id: TwitterID;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.twitter.unlinkProfile(data.data.id, sourceDomain);
          });
        }, data.callId);
      },
      "twitter.getUserProfiles": (
        data: IIFrameCallData<Record<string, never>>,
      ) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.twitter.getUserProfiles(sourceDomain);
          });
        }, data.callId);
      },
      "storage.setAuthenticatedStorage": (
        data: IIFrameCallData<{
          storageType: ECloudStorageType;
          path: string;
          accessToken: AccessToken;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.storage.setAuthenticatedStorage(
              data.data.storageType,
              data.data.path,
              data.data.accessToken,
              sourceDomain,
            );
          });
        }, data.callId);
      },

      "storage.authenticateDropbox": (
        data: IIFrameCallData<{
          code: string;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.storage.authenticateDropbox(
              data.data.code,
              sourceDomain,
            );
          });
        }, data.callId);
      },

      "storage.getDropboxAuth": (data: IIFrameCallData<{}>) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.storage.getDropboxAuth(sourceDomain);
          });
        }, data.callId);
      },

      "storage.getCurrentCloudStorage": (data: IIFrameCallData<{}>) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.storage.getCurrentCloudStorage(sourceDomain);
          });
        }, data.callId);
      },
    });
  }

  protected onModelActivated(parent: Postmate.ChildAPI): void {
    console.log("Core IFrame Model Activated");

    // We are going to relay the RXJS events
    this.coreProvider.getCore().map((core) => {
      core.getEvents().map((events) => {
        events.onInitialized.subscribe((val) => {
          parent.emit("onInitialized", val);
        });

        events.onQueryPosted.subscribe((val) => {
          parent.emit("onQueryPosted", val);
        });

        events.onQueryParametersRequired.subscribe((val) => {
          parent.emit("onQueryParametersRequired", val);
        });

        events.onAccountAdded.subscribe((val) => {
          parent.emit("onAccountAdded", val);
        });

        events.onPasswordAdded.subscribe((val) => {
          parent.emit("onPasswordAdded", val);
        });

        events.onAccountRemoved.subscribe((val) => {
          parent.emit("onAccountRemoved", val);
        });

        events.onPasswordRemoved.subscribe((val) => {
          parent.emit("onPasswordRemoved", val);
        });

        events.onCohortJoined.subscribe((val) => {
          parent.emit("onCohortJoined", val);
        });

        events.onCohortLeft.subscribe((val) => {
          parent.emit("onCohortLeft", val);
        });

        events.onDataPermissionsUpdated.subscribe((val) => {
          parent.emit("onDataPermissionsUpdated", val);
        });

        events.onTransaction.subscribe((val) => {
          parent.emit("onTransaction", val);
        });

        events.onMetatransactionSignatureRequested.subscribe((val) => {
          parent.emit("onMetatransactionSignatureRequested", val);
        });

        events.onTokenBalanceUpdate.subscribe((val) => {
          parent.emit("onTokenBalanceUpdate", val);
        });

        events.onNftBalanceUpdate.subscribe((val) => {
          parent.emit("onNftBalanceUpdate", val);
        });

        events.onBackupCreated.subscribe((val) => {
          parent.emit("onBackupCreated", val);
        });

        events.onBackupRestored.subscribe((val) => {
          parent.emit("onBackupRestored", val);
        });

        events.onEarnedRewardsAdded.subscribe((val) => {
          parent.emit("onEarnedRewardsAdded", val);
        });

        events.onPermissionsGranted.subscribe((val) => {
          parent.emit("onPermissionsGranted", val);
        });

        events.onPermissionsRequested.subscribe((val) => {
          parent.emit("onPermissionsRequested", val);
        });

        events.onPermissionsRevoked.subscribe((val) => {
          parent.emit("onPermissionsRevoked", val);
        });

        events.onSocialProfileLinked.subscribe((val) => {
          parent.emit("onSocialProfileLinked", val);
        });

        events.onSocialProfileUnlinked.subscribe((val) => {
          parent.emit("onSocialProfileUnlinked", val);
        });

        events.onBirthdayUpdated.subscribe((val) => {
          parent.emit("onBirthdayUpdated", val);
        });

        events.onGenderUpdated.subscribe((val) => {
          parent.emit("onGenderUpdated", val);
        });

        events.onLocationUpdated.subscribe((val) => {
          parent.emit("onLocationUpdated", val);
        });
      });
    });
  }

  private _getTokenId(tokenId: BigNumberString | undefined) {
    if (tokenId) {
      return okAsync(TokenId(BigInt(tokenId)));
    }
    return this.cryptoUtils.getTokenId();
  }
}
