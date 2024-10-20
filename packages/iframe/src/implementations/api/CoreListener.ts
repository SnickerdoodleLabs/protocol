import {
  ILogUtils,
  ILogUtilsType,
  ITimeUtils,
  ITimeUtilsType,
} from "@snickerdoodlelabs/common-utils";
import { ICryptoUtils, ICryptoUtilsType } from "@snickerdoodlelabs/node-utils";
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
  ECloudStorageType,
  BlockNumber,
  RefreshToken,
  URLString,
  IWebIntegrationConfigOverrides,
  TransactionFilter,
  LinkedAccount,
  JSONString,
  NewQuestionnaireAnswer,
  EQueryProcessingStatus,
  IDynamicRewardParameter,
  IQueryPermissions,
} from "@snickerdoodlelabs/objects";
import {
  IIFrameCallData,
  ChildProxy,
  IStorageUtilsType,
  IStorageUtils,
} from "@snickerdoodlelabs/utils";
import { ethers } from "ethers";
import { injectable, inject } from "inversify";
import { okAsync } from "neverthrow";
import Postmate from "postmate";

import { ICoreListener } from "@core-iframe/interfaces/api/index";
import {
  IAccountService,
  IAccountServiceType,
  IInvitationService,
  IInvitationServiceType,
} from "@core-iframe/interfaces/business/index";
import {
  IConfigProvider,
  IConfigProviderType,
  ICoreProvider,
  ICoreProviderType,
  IIFrameContextProvider,
  IIFrameContextProviderType,
} from "@core-iframe/interfaces/utilities/index";

@injectable()
export class CoreListener extends ChildProxy implements ICoreListener {
  constructor(
    @inject(IAccountServiceType) protected accountService: IAccountService,
    @inject(IInvitationServiceType)
    protected invitationService: IInvitationService,
    @inject(IStorageUtilsType) protected storageUtils: IStorageUtils,
    @inject(ICoreProviderType) protected coreProvider: ICoreProvider,
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
    @inject(ITimeUtilsType) protected timeUtils: ITimeUtils,
    @inject(ICryptoUtilsType) protected cryptoUtils: ICryptoUtils,
    @inject(IIFrameContextProviderType)
    protected contextProvider: IIFrameContextProvider,
  ) {
    super();
  }

  protected getModel(): Postmate.Model {
    // Fire up the Postmate model, and wrap up the core as the model
    return new Postmate.Model({
      /**
       * This method must occur before any of the others will work.
       * First thing the proxy does after the initial handshake is
       * pass over the config data.
       * @param data
       */
      setConfig: (data: IIFrameCallData<IWebIntegrationConfigOverrides>) => {
        this.returnForModel(() => {
          return this.contextProvider
            .setConfigOverrides(data.data)
            .andThen(() => {
              return this.coreProvider.setConfig(data.data);
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
              this.sourceDomain,
            );
          });
        }, data.callId);
      },

      addAccountWithExternalSignature: (
        data: IIFrameCallData<{
          accountAddress: AccountAddress;
          message: string;
          signature: Signature;
          chain: EChain;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            // We need to get a signature for this account
            return core.account.addAccountWithExternalSignature(
              data.data.accountAddress,
              data.data.message,
              data.data.signature,
              data.data.chain,
              this.sourceDomain,
            );
          });
        }, data.callId);
      },

      addAccountWithExternalTypedDataSignature: (
        data: IIFrameCallData<{
          accountAddress: AccountAddress;
          domain: ethers.TypedDataDomain;
          types: Record<string, Array<ethers.TypedDataField>>;
          value: Record<string, unknown>;
          signature: Signature;
          chain: EChain;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            // We need to get a signature for this account
            return core.account.addAccountWithExternalTypedDataSignature(
              data.data.accountAddress,
              data.data.domain,
              data.data.types,
              data.data.value,
              data.data.signature,
              data.data.chain,
              this.sourceDomain,
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
              this.sourceDomain,
            );
          });
        }, data.callId);
      },

      getAge: (data: IIFrameCallData<Record<string, never>>) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.getAge(this.sourceDomain);
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
            return core.setGivenName(data.data.givenName, this.sourceDomain);
          });
        }, data.callId);
      },

      getGivenName: (data: IIFrameCallData<Record<string, never>>) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.getGivenName(this.sourceDomain);
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
            return core.setFamilyName(data.data.familyName, this.sourceDomain);
          });
        }, data.callId);
      },

      getFamilyName: (data: IIFrameCallData<Record<string, never>>) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.getFamilyName(this.sourceDomain);
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
            return core.setBirthday(data.data.birthday, this.sourceDomain);
          });
        }, data.callId);
      },

      getBirthday: (data: IIFrameCallData<Record<string, never>>) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.getBirthday(this.sourceDomain);
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
            return core.setGender(data.data.gender, this.sourceDomain);
          });
        }, data.callId);
      },

      getGender: (data: IIFrameCallData<Record<string, never>>) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.getGender(this.sourceDomain);
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
            return core.setEmail(data.data.email, this.sourceDomain);
          });
        }, data.callId);
      },

      getEmail: (data: IIFrameCallData<Record<string, never>>) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.getEmail(this.sourceDomain);
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
            return core.setLocation(data.data.location, this.sourceDomain);
          });
        }, data.callId);
      },

      getLocation: (data: IIFrameCallData<Record<string, never>>) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.getLocation(this.sourceDomain);
          });
        }, data.callId);
      },

      getAccounts: (data: IIFrameCallData<Record<string, never>>) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            // TODO- make this provide the source domain after
            // we have an interface to grant permissions
            // return core.getAccounts(this.sourceDomain);
            return core.account.getAccounts(this.sourceDomain);
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
              this.sourceDomain,
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
            return core.getTokenMarketData(data.data.ids, this.sourceDomain);
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
              this.sourceDomain,
            );
          });
        }, data.callId);
      },

      getAccountBalances: (data: IIFrameCallData<Record<string, never>>) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.getAccountBalances(this.sourceDomain);
          });
        }, data.callId);
      },

      "nft.getNfts": (
        data: IIFrameCallData<{
          benchmark?: UnixTimestamp;
          chains?: EChain[];
          accounts?: LinkedAccount[];
        }>,
      ) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.nft.getNfts(
              data.data.benchmark,
              data.data.chains,
              data.data.accounts,
              this.sourceDomain,
            );
          });
        }, data.callId);
      },

      getTransactions: (
        data: IIFrameCallData<{
          filter?: TransactionFilter;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.getTransactions(data.data.filter, this.sourceDomain);
          });
        }, data.callId);
      },

      getTransactionValueByChain: (
        data: IIFrameCallData<Record<string, never>>,
      ) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.getTransactionValueByChain(this.sourceDomain);
          });
        }, data.callId);
      },

      getAcceptedInvitationsCID: (
        data: IIFrameCallData<Record<string, never>>,
      ) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.invitation.getAcceptedInvitationsCID(this.sourceDomain);
          });
        }, data.callId);
      },

      getAvailableInvitationsCID: (
        data: IIFrameCallData<Record<string, never>>,
      ) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.invitation.getAvailableInvitationsCID(
              this.sourceDomain,
            );
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

      getInvitationByDomain: (
        data: IIFrameCallData<{
          domain: DomainName;
          path: string;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.invitationService.getInvitationByDomain(
            data.data.domain,
            data.data.path,
          );
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
              this.sourceDomain,
            );
          });
        }, data.callId);
      },

      unlinkAccount: (
        data: IIFrameCallData<{
          accountAddress: AccountAddress;
          chain: EChain;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.account.unlinkAccount(
              data.data.accountAddress,
              data.data.chain,
              this.sourceDomain,
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
                data.data.consentAddress,
                data.data.tokenId != null
                  ? TokenId(BigInt(data.data.tokenId))
                  : TokenId(BigInt(0)),
                DomainName(""),
                data.data.signature ?? null,
              ),
              this.sourceDomain,
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
            return core.getEarnedRewards(this.sourceDomain);
          });
        }, data.callId);
      },

      getSiteVisits: (data: IIFrameCallData<Record<string, never>>) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.getSiteVisits(this.sourceDomain);
          });
        }, data.callId);
      },

      getSiteVisitsMap: (data: IIFrameCallData<Record<string, never>>) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.getSiteVisitsMap(this.sourceDomain);
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
              this.sourceDomain,
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
              this.sourceDomain,
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
              this.sourceDomain,
            );
          });
        }, data.callId);
      },

      getEarnedRewardsByContractAddress: (
        data: IIFrameCallData<{
          contractAddresses: EVMContractAddress[];
          timeoutMs?: number;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.marketplace.getEarnedRewardsByContractAddress(
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

      getQueryStatuses: (
        data: IIFrameCallData<{
          contractAddress?: EVMContractAddress;
          status?: EQueryProcessingStatus[];
          blockNumber?: BlockNumber;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.getQueryStatuses(
              data.data.contractAddress,
              data.data.status,
              data.data.blockNumber,
            );
          });
        }, data.callId);
      },

      getQueryStatusesByContractAddress: (
        data: IIFrameCallData<{
          contractAddress: EVMContractAddress;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.getQueryStatusesByContractAddress(
              data.data.contractAddress,
            );
          });
        }, data.callId);
      },

      approveQuery: (
        data: IIFrameCallData<{
          queryCID: IpfsCID;
          parameters: IDynamicRewardParameter[];
          queryPermissions: IQueryPermissions | null;
          _sourceDomain?: DomainName | undefined;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.approveQuery(
              data.data.queryCID,
              data.data.parameters,
              data.data.queryPermissions,
              this.sourceDomain,
            );
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
              this.sourceDomain,
            );
          });
        }, data.callId);
      },

      "discord.installationUrl": (
        data: IIFrameCallData<Record<string, never>>,
      ) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.discord.installationUrl(this.sourceDomain);
          });
        }, data.callId);
      },

      "discord.getUserProfiles": (
        data: IIFrameCallData<Record<string, never>>,
      ) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.discord.getUserProfiles(this.sourceDomain);
          });
        }, data.callId);
      },

      "discord.getGuildProfiles": (
        data: IIFrameCallData<Record<string, never>>,
      ) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.discord.getGuildProfiles(this.sourceDomain);
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
              this.sourceDomain,
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
              this.sourceDomain,
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
              this.sourceDomain,
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
            return core.metrics.getMetrics(this.sourceDomain);
          });
        }, data.callId);
      },

      "metrics.getNFTsHistory": (
        data: IIFrameCallData<Record<string, never>>,
      ) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.metrics.getNFTsHistory(this.sourceDomain);
          });
        }, data.callId);
      },

      "metrics.getPersistenceNFTs": (
        data: IIFrameCallData<Record<string, never>>,
      ) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.metrics.getPersistenceNFTs(this.sourceDomain);
          });
        }, data.callId);
      },

      "metrics.getNFTCache": (data: IIFrameCallData<Record<string, never>>) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.metrics.getNFTCache(this.sourceDomain);
          });
        }, data.callId);
      },

      "twitter.getOAuth1aRequestToken": (
        data: IIFrameCallData<Record<string, never>>,
      ) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.twitter.getOAuth1aRequestToken(this.sourceDomain);
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
              this.sourceDomain,
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
            return core.twitter.unlinkProfile(data.data.id, this.sourceDomain);
          });
        }, data.callId);
      },
      "twitter.getUserProfiles": (
        data: IIFrameCallData<Record<string, never>>,
      ) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.twitter.getUserProfiles(this.sourceDomain);
          });
        }, data.callId);
      },
      "storage.setAuthenticatedStorage": (
        data: IIFrameCallData<{
          storageType: ECloudStorageType;
          path: string;
          refreshToken: RefreshToken;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.storage.setAuthenticatedStorage(
              data.data.storageType,
              data.data.path,
              data.data.refreshToken,
              this.sourceDomain,
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
              this.sourceDomain,
            );
          });
        }, data.callId);
      },

      "storage.getDropboxAuth": (data: IIFrameCallData<object>) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.storage.getDropboxAuth(this.sourceDomain);
          });
        }, data.callId);
      },

      "storage.getCurrentCloudStorage": (data: IIFrameCallData<object>) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.storage.getCurrentCloudStorage(this.sourceDomain);
          });
        }, data.callId);
      },

      // #region questionnaire
      "questionnaire.getAllQuestionnaires": (
        data: IIFrameCallData<{
          pagingRequest: PagingRequest;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.questionnaire.getAllQuestionnaires(
              data.data.pagingRequest,
              this.sourceDomain,
            );
          });
        }, data.callId);
      },

      "questionnaire.getQuestionnaires": (
        data: IIFrameCallData<{
          pagingRequest: PagingRequest;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.questionnaire.getQuestionnaires(
              data.data.pagingRequest,
              this.sourceDomain,
            );
          });
        }, data.callId);
      },

      "questionnaire.answerQuestionnaire": (
        data: IIFrameCallData<{
          questionnaireId: IpfsCID;
          answers: NewQuestionnaireAnswer[];
        }>,
      ) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.questionnaire.answerQuestionnaire(
              data.data.questionnaireId,
              data.data.answers,
              this.sourceDomain,
            );
          });
        }, data.callId);
      },

      "questionnaire.getQuestionnairesForConsentContract": (
        data: IIFrameCallData<{
          pagingRequest: PagingRequest;
          consentContractAddress: EVMContractAddress;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.questionnaire.getQuestionnairesForConsentContract(
              data.data.pagingRequest,
              data.data.consentContractAddress,
              this.sourceDomain,
            );
          });
        }, data.callId);
      },

      "questionnaire.getConsentContractsByQuestionnaireCID": (
        data: IIFrameCallData<{
          questionnaireCID: IpfsCID;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.questionnaire.getConsentContractsByQuestionnaireCID(
              data.data.questionnaireCID,
              this.sourceDomain,
            );
          });
        }, data.callId);
      },

      "questionnaire.getRecommendedConsentContracts": (
        data: IIFrameCallData<{
          questionnaireCID: IpfsCID;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.questionnaire.getRecommendedConsentContracts(
              data.data.questionnaireCID,
              this.sourceDomain,
            );
          });
        }, data.callId);
      },

      "questionnaire.getByCIDs": (
        data: IIFrameCallData<{
          questionnaireCIDs: IpfsCID[];
        }>,
      ) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.questionnaire.getByCIDs(
              data.data.questionnaireCIDs,
              this.sourceDomain,
            );
          });
        }, data.callId);
      },

      "questionnaire.getVirtualQuestionnaires": (
        data: IIFrameCallData<{
          consentContractAddress: EVMContractAddress;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.questionnaire.getVirtualQuestionnaires(
              data.data.consentContractAddress,
              this.sourceDomain,
            );
          });
        }, data.callId);
      },

      // #region External localstorage calls

      setUIState: (data: IIFrameCallData<{ state: JSONString }>) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.setUIState(data.data.state);
          });
        }, data.callId);
      },

      getUIState: (data: IIFrameCallData<Record<string, never>>) => {
        this.returnForModel(() => {
          return this.coreProvider.getCore().andThen((core) => {
            return core.getUIState();
          });
        }, data.callId);
      },

      // #endregion

      // ivitations
      checkURLForInvitation: (data: IIFrameCallData<{ url: URLString }>) => {
        this.returnForModel(() => {
          return this.invitationService.handleURL(data.data.url);
        }, data.callId);
      },

      // dashboard view request
      requestDashboardView: (data: IIFrameCallData<Record<string, never>>) => {
        this.returnForModel(() => {
          return okAsync(
            this.contextProvider.getEvents().onDashboardViewRequested.next(),
          );
        }, data.callId);
      },

      requestOptIn: (
        data: IIFrameCallData<{ consentContractAddress?: EVMContractAddress }>,
      ) => {
        this.returnForModel(() => {
          this.contextProvider
            .getEvents()
            .onOptInRequested.next(data.data.consentContractAddress);
          return okAsync(undefined);
        }, data.callId);
      },
    });
  }

  protected onModelActivated(parent: Postmate.ChildAPI): void {
    console.log("Core IFrame Model Activated");
    // we have parent and parent has parentOrigin
    const sourceDomain = DomainName(parent.parentOrigin);
    this.configProvider.overrideSourceDomain(sourceDomain);

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
        events.onQueryPosted.subscribe((val) => {
          parent.emit("onQueryPosted", val);
        });
      });
    });
  }

  private get sourceDomain(): DomainName {
    return this.configProvider.getConfig().sourceDomain;
  }

  private _getTokenId(tokenId: BigNumberString | undefined) {
    if (tokenId) {
      return okAsync(TokenId(BigInt(tokenId)));
    }
    return this.cryptoUtils.getTokenId();
  }
}
