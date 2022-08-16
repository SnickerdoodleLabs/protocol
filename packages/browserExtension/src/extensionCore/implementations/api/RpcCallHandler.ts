import {
  Age,
  Invitation,
  CountryCode,
  DomainName,
  EInvitationStatus,
  EmailAddressString,
  EVMAccountAddress,
  FamilyName,
  Gender,
  GivenName,
  IEVMBalance,
  IEVMNFT,
  LanguageCode,
  Signature,
  UnixTimestamp,
  PageInvitation,
  DataPermissions,
  UUID,
  InvitationDomain,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import {
  AsyncJsonRpcEngineNextCallback,
  JsonRpcRequest,
  PendingJsonRpcResponse,
} from "json-rpc-engine";
import { okAsync, ResultAsync } from "neverthrow";
import { Runtime } from "webextension-polyfill";

import { AsyncRpcResponseSender } from "@implementations/utilities";
import { IRpcCallHandler } from "@interfaces/api";
import {
  IAccountService,
  IAccountServiceType,
  IInvitationService,
  IInvitationServiceType,
  IPIIService,
  IPIIServiceType,
} from "@interfaces/business";
import { IContextProvider, IContextProviderType } from "@interfaces/utilities";
import { DEFAULT_RPC_SUCCESS_RESULT } from "@shared/constants/rpcCall";
import { EExternalActions, EInternalActions } from "@shared/enums";
import {
  IUnlockParams,
  IGetUnlockMessageParams,
  IAddAccountParams,
  ISetAgeParams,
  ISetGivenNameParams,
  ISetFamilyNameParams,
  ISetBirthdayParams,
  ISetGenderParams,
  ISetLocationParams,
  ISetEmailParams,
  IGetInvitationWithDomainParams,
  IMetatransactionSignatureRequestCallbackParams,
  IAcceptInvitationParams,
  IRejectInvitationParams,
} from "@shared/interfaces/actions";
import {
  SnickerDoodleCoreError,
  ExtensionCookieError,
  ExtensionMetatransactionError,
} from "@shared/objects/errors";
import { ExtensionUtils } from "@shared/utils/ExtensionUtils";

@injectable()
export class RpcCallHandler implements IRpcCallHandler {
  constructor(
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
    @inject(IAccountServiceType) protected accountService: IAccountService,
    @inject(IPIIServiceType) protected piiService: IPIIService,
    @inject(IInvitationServiceType)
    protected invitationService: IInvitationService,
  ) {}

  public async handleRpcCall(
    req: JsonRpcRequest<unknown>,
    res: PendingJsonRpcResponse<unknown>,
    next: AsyncJsonRpcEngineNextCallback,
    sender: Runtime.MessageSender | undefined,
  ) {
    const { method, params } = req;

    switch (method) {
      case EExternalActions.UNLOCK: {
        const { accountAddress, signature, languageCode } =
          params as IUnlockParams;
        return new AsyncRpcResponseSender(
          this.unlock(accountAddress, signature, languageCode),
          res,
        ).call();
      }
      case EExternalActions.ADD_ACCOUNT: {
        const { accountAddress, signature, languageCode } =
          params as IAddAccountParams;
        return new AsyncRpcResponseSender(
          this.addAccount(accountAddress, signature, languageCode),
          res,
        ).call();
      }
      case EExternalActions.GET_UNLOCK_MESSAGE: {
        const { languageCode } = params as IGetUnlockMessageParams;
        return new AsyncRpcResponseSender(
          this.getUnlockMessage(languageCode),
          res,
        ).call();
      }
      case EExternalActions.GET_ACCOUNTS:
      case EInternalActions.GET_ACCOUNTS: {
        return new AsyncRpcResponseSender(this.getAccounts(), res).call();
      }
      case EExternalActions.GET_ACCOUNT_BALANCES:
      case EInternalActions.GET_ACCOUNT_BALANCES: {
        return new AsyncRpcResponseSender(
          this.getAccountBalances(),
          res,
        ).call();
      }
      case EExternalActions.GET_ACCOUNT_NFTS:
      case EInternalActions.GET_ACCOUNT_NFTS: {
        return new AsyncRpcResponseSender(this.getAccountNFTs(), res).call();
      }
      case EExternalActions.SET_AGE: {
        const { age } = params as ISetAgeParams;
        return new AsyncRpcResponseSender(this.setAge(age), res).call();
      }
      case EExternalActions.SET_GIVEN_NAME: {
        const { givenName } = params as ISetGivenNameParams;
        return new AsyncRpcResponseSender(
          this.setGivenName(givenName),
          res,
        ).call();
      }
      case EExternalActions.SET_EMAIL: {
        const { email } = params as ISetEmailParams;
        return new AsyncRpcResponseSender(this.setEmail(email), res).call();
      }
      case EExternalActions.SET_FAMILY_NAME: {
        const { familyName } = params as ISetFamilyNameParams;
        return new AsyncRpcResponseSender(
          this.setFamilyName(familyName),
          res,
        ).call();
      }
      case EExternalActions.SET_BIRTHDAY: {
        const { birthday } = params as ISetBirthdayParams;
        return new AsyncRpcResponseSender(
          this.setBirthday(birthday),
          res,
        ).call();
      }
      case EExternalActions.SET_GENDER: {
        const { gender } = params as ISetGenderParams;
        return new AsyncRpcResponseSender(this.setGender(gender), res).call();
      }
      case EExternalActions.SET_LOCATION: {
        const { location } = params as ISetLocationParams;
        return new AsyncRpcResponseSender(
          this.setLocation(location),
          res,
        ).call();
      }
      case EExternalActions.GET_AGE: {
        return new AsyncRpcResponseSender(this.getAge(), res).call();
      }
      case EExternalActions.GET_GIVEN_NAME: {
        return new AsyncRpcResponseSender(this.getGivenName(), res).call();
      }
      case EExternalActions.GET_EMAIL: {
        return new AsyncRpcResponseSender(this.getEmail(), res).call();
      }
      case EExternalActions.GET_FAMILY_NAME: {
        return new AsyncRpcResponseSender(this.getFamilyName(), res).call();
      }
      case EExternalActions.GET_BIRTHDAY: {
        return new AsyncRpcResponseSender(this.getBirthday(), res).call();
      }
      case EExternalActions.GET_GENDER: {
        return new AsyncRpcResponseSender(this.getGender(), res).call();
      }
      case EExternalActions.GET_LOCATION: {
        return new AsyncRpcResponseSender(this.getLocation(), res).call();
      }
      // TODO move it to correct place
      case EExternalActions.METATRANSACTION_SIGNATURE_REQUEST_CALLBACK: {
        const { nonce, id, metatransactionSignature } =
          params as IMetatransactionSignatureRequestCallbackParams;
        const metatransactionSignatureRequest =
          this.contextProvider.getMetatransactionSignatureRequestById(id);
        if (!metatransactionSignatureRequest) {
          return (res.error = new ExtensionMetatransactionError(
            `Metatransaction could not found with key: ${id}`,
          ));
        }
        metatransactionSignatureRequest.callback(
          metatransactionSignature,
          nonce,
        );
        // TODO add to history if needed
        this.contextProvider.removePendingMetatransactionSignatureRequest(id);
        return (res.result = DEFAULT_RPC_SUCCESS_RESULT);
      }
      case EExternalActions.GET_COHORT_INVITATION_WITH_DOMAIN: {
        const { domain } = params as IGetInvitationWithDomainParams;
        return new AsyncRpcResponseSender(
          this.getInvitationsByDomain(domain),
          res,
        ).call();
      }
      case EExternalActions.ACCEPT_INVITATION: {
        const { dataPermissions, id } = params as IAcceptInvitationParams;
        return new AsyncRpcResponseSender(
          this.acceptInvitation(dataPermissions, id),
          res,
        ).call();
      }
      case EExternalActions.REJECT_INVITATION: {
        const { id } = params as IRejectInvitationParams;
        return new AsyncRpcResponseSender(
          this.rejectInvitation(id),
          res,
        ).call();
      }
      case EExternalActions.CLOSE_TAB: {
        sender?.tab?.id && ExtensionUtils.closeTab(sender.tab.id);
        return (res.result = DEFAULT_RPC_SUCCESS_RESULT);
      }
      case EExternalActions.GET_STATE:
        return (res.result = this.contextProvider.getExterenalState());

      case EInternalActions.GET_STATE:
        return (res.result = this.contextProvider.getInternalState());
      case EExternalActions.IS_DATA_WALLET_ADDRESS_INITIALIZED: {
        return new AsyncRpcResponseSender(
          this.accountService.isDataWalletAddressInitialized(),
          res,
        ).call();
      }
      default:
        return next();
    }
  }

  private getInvitationsByDomain(domain: DomainName): ResultAsync<
    | (InvitationDomain & {
        id: UUID;
      })
    | undefined,
    SnickerDoodleCoreError
  > {
    return this.invitationService
      .getInvitationByDomain(domain)
      .andThen((pageInvitations) => {
        console.log("pageInvitations", pageInvitations);
        const pageInvitation = pageInvitations.find(
          (value) => value.domainDetails.domain === domain,
        );
        if (pageInvitation) {
          return this.invitationService
            .checkInvitationStatus(pageInvitation.invitation)
            .andThen((invitationStatus) => {
              console.log("invitationStatus", invitationStatus);
              if (invitationStatus === EInvitationStatus.New) {
                const invitationUUID = this.contextProvider.addInvitation(
                  pageInvitation.invitation,
                );
                return okAsync(
                  Object.assign(pageInvitation.domainDetails, {
                    id: invitationUUID,
                  }),
                );
              } else {
                return okAsync(undefined);
              }
            });
        } else {
          return okAsync(undefined);
        }
      });

    /*  return this.invitationService
      .getInvitationByDomain(domain)
      .map((pageInvitations: PageInvitation[]) => {
        const pageInvitation = pageInvitations.find(
          (value) => value.domainDetails.domain === domain,
        );
        if (pageInvitation) {
          return this.invitationService
            .checkInvitationStatus(pageInvitation.invitation)
            .map((status) => {
              if (status === EInvitationStatus.New) {
                const invitationUUID = this.contextProvider.addInvitation(
                  pageInvitation.invitation,
                );
                return Object.assign(pageInvitation.domainDetails, {
                  id: invitationUUID,
                });
              } else {
                return undefined;
              }
            });
        } else {
          return undefined;
        }
      }); */
  }
  private acceptInvitation(
    dataPermissions: DataPermissions | null,
    id: UUID,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    const invitation = this.contextProvider.getInvitation(id) as Invitation;
    return this.invitationService.acceptInvitation(
      invitation,
      dataPermissions,
    );
  }
  private rejectInvitation(
    id: UUID,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    const invitation = this.contextProvider.getInvitation(id) as Invitation;
    return this.invitationService.rejectInvitation(invitation);
  }

  private unlock(
    account: EVMAccountAddress,
    signature: Signature,
    languageCode: LanguageCode,
  ): ResultAsync<void, SnickerDoodleCoreError | ExtensionCookieError> {
    return this.accountService.unlock(account, signature, languageCode);
  }
  private addAccount(
    account: EVMAccountAddress,
    signature: Signature,
    languageCode: LanguageCode,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.accountService.addAccount(account, signature, languageCode);
  }
  private getUnlockMessage(
    languageCode: LanguageCode,
  ): ResultAsync<string, SnickerDoodleCoreError> {
    return this.accountService.getUnlockMessage(languageCode);
  }
  private getAccounts(): ResultAsync<
    EVMAccountAddress[],
    SnickerDoodleCoreError
  > {
    return this.accountService.getAccounts();
  }
  private getAccountBalances(): ResultAsync<
    IEVMBalance[],
    SnickerDoodleCoreError
  > {
    return this.accountService.getAccountBalances();
  }
  private getAccountNFTs(): ResultAsync<IEVMNFT[], SnickerDoodleCoreError> {
    return this.accountService.getAccountNFTs();
  }
  private setAge(age: Age): ResultAsync<void, SnickerDoodleCoreError> {
    return this.piiService.setAge(age);
  }
  private getAge(): ResultAsync<Age | null, SnickerDoodleCoreError> {
    return this.piiService.getAge();
  }
  private setGivenName(
    name: GivenName,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.piiService.setGivenName(name);
  }
  private getGivenName(): ResultAsync<
    GivenName | null,
    SnickerDoodleCoreError
  > {
    return this.piiService.getGivenName();
  }
  private setFamilyName(
    name: FamilyName,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.piiService.setFamilyName(name);
  }
  private getFamilyName(): ResultAsync<
    FamilyName | null,
    SnickerDoodleCoreError
  > {
    return this.piiService.getFamilyName();
  }
  private setBirthday(
    birthday: UnixTimestamp,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.piiService.setBirthday(birthday);
  }
  private getBirthday(): ResultAsync<
    UnixTimestamp | null,
    SnickerDoodleCoreError
  > {
    return this.piiService.getBirthday();
  }
  private setGender(gender: Gender): ResultAsync<void, SnickerDoodleCoreError> {
    return this.piiService.setGender(gender);
  }
  private getGender(): ResultAsync<Gender | null, SnickerDoodleCoreError> {
    return this.piiService.getGender();
  }
  private setEmail(
    email: EmailAddressString,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.piiService.setEmail(email);
  }
  private getEmail(): ResultAsync<
    EmailAddressString | null,
    SnickerDoodleCoreError
  > {
    return this.piiService.getEmail();
  }
  private setLocation(
    location: CountryCode,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.piiService.setLocation(location);
  }
  private getLocation(): ResultAsync<
    CountryCode | null,
    SnickerDoodleCoreError
  > {
    return this.piiService.getLocation();
  }
}
