import { ILogUtils, ILogUtilsType } from "@snickerdoodlelabs/common-utils";
import {
  AccountAddress,
  BigNumberString,
  ChainId,
  CountryCode,
  DiscordID,
  DomainName,
  EChain,
  EVMContractAddress,
  EWalletDataType,
  EmailAddressString,
  FamilyName,
  Gender,
  GivenName,
  ISnickerdoodleCore,
  ISnickerdoodleCoreType,
  Invitation,
  IpfsCID,
  LanguageCode,
  MarketplaceTag,
  OAuth1RequstToken,
  OAuthAuthorizationCode,
  OAuthVerifier,
  PagingRequest,
  Signature,
  TokenAddress,
  TokenId,
  TwitterID,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";
import { IIFrameCallData, ChildProxy } from "@snickerdoodlelabs/utils";
import { injectable, inject } from "inversify";
import Postmate from "postmate";

import { ICoreListener } from "../../interfaces/api/index";
import {
  ICoreUIService,
  ICoreUIServiceType,
} from "../../interfaces/business/index";

@injectable()
export class CoreListener extends ChildProxy implements ICoreListener {
  constructor(
    @inject(ISnickerdoodleCoreType) protected core: ISnickerdoodleCore,
    @inject(ICoreUIServiceType) protected coreUIService: ICoreUIService,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
    protected sourceDomain: DomainName,
  ) {
    super();
  }

  protected getModel(): Postmate.Model {
    console.log("getModel");
    // Fire up the Postmate model, and wrap up the core as the model
    return new Postmate.Model({
      unlock: (
        data: IIFrameCallData<{
          accountAddress: AccountAddress;
          signature: Signature;
          languageCode: LanguageCode;
          chain: EChain;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.core.account.unlock(
            data.data.accountAddress,
            data.data.signature,
            data.data.languageCode,
            data.data.chain,
            this.sourceDomain,
          );
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
          return this.core.account.addAccount(
            data.data.accountAddress,
            data.data.signature,
            data.data.languageCode,
            data.data.chain,
            this.sourceDomain,
          );
        }, data.callId);
      },

      getUnlockMessage: (
        data: IIFrameCallData<{
          languageCode: LanguageCode;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.core.account.getUnlockMessage(
            data.data.languageCode,
            this.sourceDomain,
          );
        }, data.callId);
      },

      getAge: (data: IIFrameCallData<Record<string, never>>) => {
        this.returnForModel(() => {
          return this.core.getAge(this.sourceDomain);
        }, data.callId);
      },

      setGivenName: (
        data: IIFrameCallData<{
          givenName: GivenName;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.core.setGivenName(data.data.givenName, this.sourceDomain);
        }, data.callId);
      },

      getGivenName: (data: IIFrameCallData<Record<string, never>>) => {
        this.returnForModel(() => {
          return this.core.getGivenName(this.sourceDomain);
        }, data.callId);
      },

      setFamilyName: (
        data: IIFrameCallData<{
          familyName: FamilyName;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.core.setFamilyName(
            data.data.familyName,
            this.sourceDomain,
          );
        }, data.callId);
      },

      getFamilyName: (data: IIFrameCallData<Record<string, never>>) => {
        this.returnForModel(() => {
          return this.core.getFamilyName(this.sourceDomain);
        }, data.callId);
      },

      setBirthday: (
        data: IIFrameCallData<{
          birthday: UnixTimestamp;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.core.setBirthday(data.data.birthday, this.sourceDomain);
        }, data.callId);
      },

      getBirthday: (data: IIFrameCallData<Record<string, never>>) => {
        this.returnForModel(() => {
          return this.core.getBirthday(this.sourceDomain);
        }, data.callId);
      },

      setGender: (
        data: IIFrameCallData<{
          gender: Gender;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.core.setGender(data.data.gender, this.sourceDomain);
        }, data.callId);
      },

      getGender: (data: IIFrameCallData<Record<string, never>>) => {
        this.returnForModel(() => {
          return this.core.getGender(this.sourceDomain);
        }, data.callId);
      },

      setEmail: (
        data: IIFrameCallData<{
          email: EmailAddressString;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.core.setEmail(data.data.email, this.sourceDomain);
        }, data.callId);
      },

      getEmail: (data: IIFrameCallData<Record<string, never>>) => {
        this.returnForModel(() => {
          return this.core.getEmail(this.sourceDomain);
        }, data.callId);
      },

      setLocation: (
        data: IIFrameCallData<{
          location: CountryCode;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.core.setLocation(data.data.location, this.sourceDomain);
        }, data.callId);
      },

      getLocation: (data: IIFrameCallData<Record<string, never>>) => {
        this.returnForModel(() => {
          return this.core.getLocation(this.sourceDomain);
        }, data.callId);
      },

      getAccounts: (data: IIFrameCallData<Record<string, never>>) => {
        this.returnForModel(() => {
          return this.core.getAccounts(this.sourceDomain);
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
          return this.core.getTokenPrice(
            data.data.chainId,
            data.data.address,
            data.data.timestamp,
            this.sourceDomain,
          );
        }, data.callId);
      },

      getTokenMarketData: (
        data: IIFrameCallData<{
          ids: string[];
        }>,
      ) => {
        this.returnForModel(() => {
          return this.core.getTokenMarketData(data.data.ids, this.sourceDomain);
        }, data.callId);
      },

      getTokenInfo: (
        data: IIFrameCallData<{
          chainId: ChainId;
          contractAddress: TokenAddress | null;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.core.getTokenInfo(
            data.data.chainId,
            data.data.contractAddress,
            this.sourceDomain,
          );
        }, data.callId);
      },

      getAccountBalances: (data: IIFrameCallData<Record<string, never>>) => {
        this.returnForModel(() => {
          return this.core.getAccountBalances(this.sourceDomain);
        }, data.callId);
      },

      getAccountNFTs: (data: IIFrameCallData<Record<string, never>>) => {
        this.returnForModel(() => {
          return this.core.getAccountNFTs(this.sourceDomain);
        }, data.callId);
      },

      // closeTab: (data: IIFrameCallData<Record<string, never>>) => {
      //   this.returnForModel(() => {
      //     return this.core.closeTab(this.sourceDomain);
      //   }, data.callId);
      // },

      // getDataWalletAddress: (data: IIFrameCallData<Record<string, never>>) => {
      //   this.returnForModel(() => {
      //     return this.core.account.(this.sourceDomain);
      //   }, data.callId);
      // },

      getAcceptedInvitationsCID: (
        data: IIFrameCallData<Record<string, never>>,
      ) => {
        this.returnForModel(() => {
          return this.core.invitation.getAcceptedInvitationsCID(
            this.sourceDomain,
          );
        }, data.callId);
      },

      getAvailableInvitationsCID: (
        data: IIFrameCallData<Record<string, never>>,
      ) => {
        this.returnForModel(() => {
          return this.core.invitation.getAvailableInvitationsCID(
            this.sourceDomain,
          );
        }, data.callId);
      },

      getInvitationMetadataByCID: (
        data: IIFrameCallData<{
          ipfsCID: IpfsCID;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.core.invitation.getInvitationMetadataByCID(
            data.data.ipfsCID,
          );
        }, data.callId);
      },

      // getAgreementPermissions: (
      //   data: IIFrameCallData<{
      //     ipfsCID: IpfsCID;
      //   }>,
      // ) => {
      //   this.returnForModel(() => {
      //     return this.core.invitation.getInvitationMetadataByCID(
      //       data.data.ipfsCID,
      //     );
      //   }, data.callId);
      // },

      // getApplyDefaultPermissionsOption: (
      //   data: IIFrameCallData<Record<string, never>>,
      // ) => {
      //   this.returnForModel(() => {
      //     return this.core.get(
      //       this.sourceDomain,
      //     );
      //   }, data.callId);
      // },

      // setApplyDefaultPermissionsOption: (
      //   data: IIFrameCallData<Record<string, never>>,
      // ) => {
      //   this.returnForModel(() => {
      //     return this.core.get(
      //       this.sourceDomain,
      //     );
      //   }, data.callId);
      // },

      // getDefaultPermissions: (
      //   data: IIFrameCallData<Record<string, never>>,
      // ) => {
      //   this.returnForModel(() => {
      //     return this.core.get(
      //       this.sourceDomain,
      //     );
      //   }, data.callId);
      // },

      // setDefaultPermissions: (
      //   data: IIFrameCallData<Record<string, never>>,
      // ) => {
      //   this.returnForModel(() => {
      //     return this.core.get(
      //       this.sourceDomain,
      //     );
      //   }, data.callId);
      // },

      // getScamFilterSettings: (
      //   data: IIFrameCallData<Record<string, never>>,
      // ) => {
      //   this.returnForModel(() => {
      //     return this.core.get(
      //       this.sourceDomain,
      //     );
      //   }, data.callId);
      // },

      // setScamFilterSettings: (
      //   data: IIFrameCallData<Record<string, never>>,
      // ) => {
      //   this.returnForModel(() => {
      //     return this.core.get(
      //       this.sourceDomain,
      //     );
      //   }, data.callId);
      // },

      // setDefaultPermissionsToAll: (
      //   data: IIFrameCallData<Record<string, never>>,
      // ) => {
      //   this.returnForModel(() => {
      //     return this.core.get(
      //       this.sourceDomain,
      //     );
      //   }, data.callId);
      // },

      // acceptInvitation: (
      //   data: IIFrameCallData<{
      //     dataTypes: EWalletDataType[] | null;
      //     consentContractAddress: EVMContractAddress;
      //     tokenId?: BigNumberString;
      //     businessSignature?: Signature;
      //   }>,
      // ) => {
      //   this.returnForModel(() => {
      //     return this.core.invitation.acceptInvitation(data.data.dataTypes,);
      //   }, data.callId);
      // },

      leaveCohort: (
        data: IIFrameCallData<{
          consentContractAddress: EVMContractAddress;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.core.invitation.leaveCohort(
            data.data.consentContractAddress,
            this.sourceDomain,
          );
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
          return this.core.account.unlinkAccount(
            data.data.accountAddress,
            data.data.signature,
            data.data.languageCode,
            data.data.chain,
            this.sourceDomain,
          );
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
          return this.core.invitation.checkInvitationStatus(
            new Invitation(
              DomainName(""),
              data.data.consentAddress,
              data.data.tokenId != null
                ? TokenId(BigInt(data.data.tokenId))
                : TokenId(BigInt(0)),
              data.data.signature ?? null,
            ),
            this.sourceDomain,
          );
        }, data.callId);
      },

      getConsentContractCID: (
        data: IIFrameCallData<{
          consentAddress: EVMContractAddress;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.core.getConsentContractCID(data.data.consentAddress);
        }, data.callId);
      },

      getEarnedRewards: (data: IIFrameCallData<Record<string, never>>) => {
        this.returnForModel(() => {
          return this.core.getEarnedRewards(this.sourceDomain);
        }, data.callId);
      },

      getSiteVisits: (data: IIFrameCallData<Record<string, never>>) => {
        this.returnForModel(() => {
          return this.core.getSiteVisits(this.sourceDomain);
        }, data.callId);
      },

      getSiteVisitsMap: (data: IIFrameCallData<Record<string, never>>) => {
        this.returnForModel(() => {
          return this.core.getSiteVisitsMap(this.sourceDomain);
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
          return this.core.marketplace.getMarketplaceListingsByTag(
            data.data.pagingReq,
            data.data.tag,
            data.data.filterActive ?? true,
          );
        }, data.callId);
      },

      getListingsTotalByTag: (
        data: IIFrameCallData<{
          tag: MarketplaceTag;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.core.marketplace.getListingsTotalByTag(data.data.tag);
        }, data.callId);
      },

      setDefaultReceivingAddress: (
        data: IIFrameCallData<{
          receivingAddress: AccountAddress | null;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.core.setDefaultReceivingAddress(
            data.data.receivingAddress,
            this.sourceDomain,
          );
        }, data.callId);
      },

      setReceivingAddress: (
        data: IIFrameCallData<{
          contractAddress: EVMContractAddress;
          receivingAddress: AccountAddress | null;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.core.setReceivingAddress(
            data.data.contractAddress,
            data.data.receivingAddress,
            this.sourceDomain,
          );
        }, data.callId);
      },

      getReceivingAddress: (
        data: IIFrameCallData<{
          contractAddress?: EVMContractAddress;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.core.getReceivingAddress(
            data.data.contractAddress,
            this.sourceDomain,
          );
        }, data.callId);
      },

      getConsentCapacity: (
        data: IIFrameCallData<{
          contractAddress: EVMContractAddress;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.core.getConsentCapacity(data.data.contractAddress);
        }, data.callId);
      },

      getPossibleRewards: (
        data: IIFrameCallData<{
          contractAddresses: EVMContractAddress[];
          timeoutMs?: number;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.core.marketplace.getPossibleRewards(
            data.data.contractAddresses,
            data.data.timeoutMs,
          );
        }, data.callId);
      },

      "discord.initializeUserWithAuthorizationCode": (
        data: IIFrameCallData<{
          code: OAuthAuthorizationCode;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.core.discord.initializeUserWithAuthorizationCode(
            data.data.code,
          );
        }, data.callId);
      },

      "discord.installationUrl": (
        data: IIFrameCallData<Record<string, never>>,
      ) => {
        this.returnForModel(() => {
          return this.core.discord.installationUrl();
        }, data.callId);
      },

      "discord.getUserProfiles": (
        data: IIFrameCallData<Record<string, never>>,
      ) => {
        this.returnForModel(() => {
          return this.core.discord.getUserProfiles();
        }, data.callId);
      },

      "discord.getGuildProfiles": (
        data: IIFrameCallData<Record<string, never>>,
      ) => {
        this.returnForModel(() => {
          return this.core.discord.getGuildProfiles();
        }, data.callId);
      },

      "discord.unlink": (
        data: IIFrameCallData<{
          discordProfileId: DiscordID;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.core.discord.unlink(data.data.discordProfileId);
        }, data.callId);
      },

      "twitter.getOAuth1aRequestToken": (
        data: IIFrameCallData<Record<string, never>>,
      ) => {
        this.returnForModel(() => {
          return this.core.twitter.getOAuth1aRequestToken();
        }, data.callId);
      },

      "twitter.initTwitterProfile": (
        data: IIFrameCallData<{
          requestToken: OAuth1RequstToken;
          oAuthVerifier: OAuthVerifier;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.core.twitter.initTwitterProfile(
            data.data.requestToken,
            data.data.oAuthVerifier,
          );
        }, data.callId);
      },

      "twitter.unlinkProfile": (
        data: IIFrameCallData<{
          id: TwitterID;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.core.twitter.unlinkProfile(data.data.id);
        }, data.callId);
      },

      "twitter.getUserProfiles": (
        data: IIFrameCallData<Record<string, never>>,
      ) => {
        this.returnForModel(() => {
          return this.core.twitter.getUserProfiles();
        }, data.callId);
      },
    });
  }

  protected onModelActivated(parent: Postmate.ChildAPI): void {
    console.log("Core IFrame Model Activated");
    // We are going to relay the RXJS events
    this.core.getEvents().map((events) => {
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
  }
}
