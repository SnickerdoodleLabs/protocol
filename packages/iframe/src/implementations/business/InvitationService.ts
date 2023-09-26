import { IInvitationService } from "@core-iframe/interfaces/business";
import { EInvitationSourceType } from "@core-iframe/interfaces/objects";
import {
  ICoreProvider,
  ICoreProviderType,
  IIFrameContextProvider,
  IIFrameContextProviderType,
} from "@core-iframe/interfaces/utilities/index";
import { ICryptoUtils, ICryptoUtilsType } from "@snickerdoodlelabs/node-utils";
import {
  BigNumberString,
  DomainName,
  EInvitationStatus,
  EVMContractAddress,
  Invitation,
  PageInvitation,
  Signature,
  TokenId,
  URLString,
} from "@snickerdoodlelabs/objects";
import { injectable, inject } from "inversify";
import { ResultAsync, okAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import { Subscription } from "rxjs";
import { parse } from "tldts";
@injectable()
export class InvitationService implements IInvitationService {
  private consentCheckSubscription: Subscription;
  constructor(
    @inject(IIFrameContextProviderType)
    protected contextProvider: IIFrameContextProvider,
    @inject(ICoreProviderType) protected coreProvider: ICoreProvider,
    @inject(ICryptoUtilsType) protected cryptoUtils: ICryptoUtils,
  ) {
    // can be moved to api layer
    this.consentCheckSubscription = this.contextProvider
      .getEvents()
      .onConsentAddressFound.subscribe((consentAddress) => {
        this._handleConsentAddress(consentAddress);
      });
  }

  private _handleConsentAddress(consentAddress: EVMContractAddress) {
    this.consentCheckSubscription.unsubscribe();
    return this.coreProvider
      .getCore()
      .andThen((core) => {
        const invitation = new Invitation(consentAddress, null, null, null);
        return core.invitation
          .checkInvitationStatus(invitation)
          .andThen((status) => {
            if (status === EInvitationStatus.New) {
              return core
                .getConsentContractCID(consentAddress)
                .andThen((cid) => {
                  return core.invitation
                    .getInvitationMetadataByCID(cid)
                    .andThen((invitationData) => {
                      this.contextProvider
                        .getEvents()
                        .onInvitationDisplayRequested.next({
                          data: {
                            invitation: invitation,
                            metadata: invitationData,
                          },
                          type: EInvitationSourceType.CONSENT_ADDRESS,
                        });
                      return okAsync(undefined);
                    });
                });
            }
            return okAsync(undefined);
          });
      })
      .mapErr((err) => {});
  }

  public handleURL(url: URLString): ResultAsync<void, never> {
    const urlObj = new URL(url);
    const queryParams = new URLSearchParams(urlObj.search);
    const path = urlObj.pathname;
    const urlInfo = parse(url);
    const domain = urlInfo.domain;
    const domainPath = `${urlInfo.hostname}${path.replace(/\/$/, "")}`;
    const domainName = DomainName(`snickerdoodle-protocol.${domain}`);
    const config = this.contextProvider.getConfig();
    const events = this.contextProvider.getEvents();
    // check if we have a consent address
    // if we do, check for deeplink
    if (config.showDeeplinkInvitations && queryParams.has("consentAddress")) {
      const consentAddress = EVMContractAddress(
        queryParams.get("consentAddress")!,
      );
      const tokenId = queryParams.get("tokenId");
      const signature = queryParams.get("signature");
      ResultUtils.combine([
        this.coreProvider.getCore(),
        this._getTokenId(tokenId ? BigNumberString(tokenId) : undefined),
      ])
        .andThen(([core, tokenId]) => {
          const invitation = new Invitation(
            consentAddress,
            tokenId,
            null,
            signature ? Signature(signature) : null,
          );
          return core.invitation
            .checkInvitationStatus(invitation)
            .andThen((invitationStatus) => {
              console.log("Invitation status", invitationStatus);
              if (invitationStatus === EInvitationStatus.New) {
                return core
                  .getConsentContractCID(consentAddress)
                  .andThen((cid) => {
                    return core.invitation
                      .getInvitationMetadataByCID(cid)
                      .andThen((invitationData) => {
                        events.onInvitationDisplayRequested.next({
                          data: {
                            invitation: invitation,
                            metadata: invitationData,
                          },
                          type: EInvitationSourceType.DEEPLINK,
                        });
                        return okAsync(undefined);
                      });
                  });
              }
              return okAsync(undefined);
            });
        })
        .mapErr((err) => {});
    }
    if (config.checkDomainInvitations) {
      this.getInvitationByDomain(domainName, domainPath).andThen(
        (pageInvitaiton) => {
          if (pageInvitaiton) {
            return this.coreProvider
              .getCore()
              .andThen((core) => {
                return core.invitation
                  .checkInvitationStatus(pageInvitaiton.invitation)
                  .andThen((invitationStatus) => {
                    if (invitationStatus === EInvitationStatus.New) {
                      events.onInvitationDisplayRequested.next({
                        data: {
                          invitation: pageInvitaiton.invitation,
                          metadata: pageInvitaiton.domainDetails,
                        },
                        type: EInvitationSourceType.DOMAIN,
                      });
                      return okAsync(undefined);
                    }
                    return okAsync(undefined);
                  });
              })
              .mapErr((err) => {});
          }
          return okAsync(undefined);
        },
      );
    }
    return okAsync(undefined);
  }

  public getInvitationByDomain(
    domain: DomainName,
    path: string,
  ): ResultAsync<PageInvitation | null, Error> {
    return this.coreProvider.getCore().andThen((core) => {
      return core.invitation
        .getInvitationsByDomain(domain)
        .andThen((pageInvitations) => {
          const pageInvitation = pageInvitations.find((value) => {
            const incomingUrl = value.url.replace(/^https?:\/\//, "");
            const incomingUrlInfo = parse(incomingUrl);
            if (!incomingUrlInfo.subdomain && parse(path).subdomain) {
              return `${"www"}.${incomingUrl.replace(/\/$/, "")}` === path;
            }
            return incomingUrl.replace(/\/$/, "") === path;
          });
          if (pageInvitation) {
            return okAsync(pageInvitation);
          } else {
            return okAsync(null);
          }
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
