import { Eco } from "@material-ui/icons";
import {
  Age,
  BigNumberString,
  CountryCode,
  DomainName,
  EmailAddressString,
  FamilyName,
  Gender,
  GivenName,
  LanguageCode,
  Signature,
  UnixTimestamp,
  UUID,
  EVMContractAddress,
  URLString,
  IpfsCID,
  EChain,
  EWalletDataType,
  AccountAddress,
  ChainId,
  TokenAddress,
} from "@snickerdoodlelabs/objects";

import { ECoreActions } from "@synamint-extension-sdk/shared";

export abstract class CoreActionParams {
  public constructor(public method: ECoreActions) {}
}

export class UnlockParams extends CoreActionParams {
  public constructor(
    public accountAddress: AccountAddress,
    public signature: Signature,
    public chain: EChain,
    public languageCode: LanguageCode,
  ) {
    super(ECoreActions.UNLOCK);
  }
}

export class AddAccountParams extends CoreActionParams {
  public constructor(
    public accountAddress: AccountAddress,
    public signature: Signature,
    public chain: EChain,
    public languageCode: LanguageCode,
  ) {
    super(ECoreActions.ADD_ACCOUNT);
  }
}

export class UnlinkAccountParams extends CoreActionParams {
  public constructor(
    public accountAddress: AccountAddress,
    public signature: Signature,
    public chain: EChain,
    public languageCode: LanguageCode,
  ) {
    super(ECoreActions.UNLINK_ACCOUNT);
  }
}

export class GetUnlockMessageParams extends CoreActionParams {
  public constructor(public languageCode: LanguageCode) {
    super(ECoreActions.GET_UNLOCK_MESSAGE);
  }
}

export class SetGivenNameParams extends CoreActionParams {
  public constructor(public givenName: GivenName) {
    super(ECoreActions.SET_GIVEN_NAME);
  }
}

export class SetFamilyNameParams extends CoreActionParams {
  public constructor(public familyName: FamilyName) {
    super(ECoreActions.SET_FAMILY_NAME);
  }
}

export class SetBirthdayParams extends CoreActionParams {
  public constructor(public birthday: UnixTimestamp) {
    super(ECoreActions.SET_BIRTHDAY);
  }
}

export class SetGenderParams extends CoreActionParams {
  public constructor(public gender: Gender) {
    super(ECoreActions.SET_GENDER);
  }
}

export class SetEmailParams extends CoreActionParams {
  public constructor(public email: EmailAddressString) {
    super(ECoreActions.SET_EMAIL);
  }
}

export class SetLocationParams extends CoreActionParams {
  public constructor(public location: CountryCode) {
    super(ECoreActions.SET_LOCATION);
  }
}

export class SetApplyDefaultPermissionsParams extends CoreActionParams {
  public constructor(public option: boolean) {
    super(ECoreActions.SET_APPLY_DEFAULT_PERMISSIONS_OPTION);
  }
}

export class GetInvitationWithDomainParams extends CoreActionParams {
  public constructor(public domain: DomainName, public path: string) {
    super(ECoreActions.GET_COHORT_INVITATION_WITH_DOMAIN);
  }
}

export class AcceptInvitationByUUIDParams extends CoreActionParams {
  public constructor(public dataTypes: EWalletDataType[], public id: UUID) {
    super(ECoreActions.ACCEPT_INVITATION_BY_UUID);
  }
}
export class AcceptInvitationParams extends CoreActionParams {
  public constructor(
    public dataTypes: EWalletDataType[],
    public consentContractAddress: EVMContractAddress,
    public tokenId?: BigNumberString,
    public businessSignature?: Signature,
  ) {
    super(ECoreActions.ACCEPT_INVITATION);
  }
}

export class GetAgreementPermissionsParams extends CoreActionParams {
  public constructor(public consentContractAddress: EVMContractAddress) {
    super(ECoreActions.GET_AGREEMENT_PERMISSIONS);
  }
}

export class SetDefaultPermissionsWithDataTypesParams extends CoreActionParams {
  public constructor(public dataTypes: EWalletDataType[]) {
    super(ECoreActions.SET_DEFAULT_PERMISSIONS);
  }
}
export class RejectInvitationParams extends CoreActionParams {
  public constructor(public id: UUID) {
    super(ECoreActions.REJECT_INVITATION);
  }
}

export class LeaveCohortParams extends CoreActionParams {
  public constructor(public consentContractAddress: EVMContractAddress) {
    super(ECoreActions.LEAVE_COHORT);
  }
}

export class GetInvitationMetadataByCIDParams extends CoreActionParams {
  public constructor(public ipfsCID: IpfsCID) {
    super(ECoreActions.GET_INVITATION_METADATA_BY_CID);
  }
}

export class CheckURLParams extends CoreActionParams {
  public constructor(public domain: DomainName) {
    super(ECoreActions.CHECK_URL);
  }
}

export class ScamFilterSettingsParams extends CoreActionParams {
  public constructor(
    public isScamFilterActive: boolean,
    public showMessageEveryTime: boolean,
  ) {
    super(ECoreActions.SET_SCAM_FILTER_SETTINGS);
  }
}

export class GetConsentContractCIDParams extends CoreActionParams {
  public constructor(public consentAddress: EVMContractAddress) {
    super(ECoreActions.GET_CONTRACT_CID);
  }
}

export class CheckInvitationStatusParams extends CoreActionParams {
  public constructor(
    public consentAddress: EVMContractAddress,
    public signature?: Signature | undefined,
    public tokenId?: BigNumberString | undefined,
  ) {
    super(ECoreActions.CHECK_INVITATION_STATUS);
  }
}

export class GetTokenPriceParams extends CoreActionParams {
  public constructor(
    public chainId: ChainId,
    public address: TokenAddress | null,
    public timestamp?: UnixTimestamp,
  ) {
    super(ECoreActions.GET_TOKEN_PRICE);
  }
}

export class GetTokenMarketDataParams extends CoreActionParams {
  public constructor(public ids: string[]) {
    super(ECoreActions.GET_TOKEN_MARKET_DATA);
  }
}

export class GetTokenInfoParams extends CoreActionParams {
  public constructor(
    public chainId: ChainId,
    public contractAddress: TokenAddress | null,
  ) {
    super(ECoreActions.GET_TOKEN_INFO);
  }
}

export class GetMarketplaceListingsParams extends CoreActionParams {
  public constructor(public count?: number, public headAt?: number) {
    super(ECoreActions.GET_MARKETPLACE_LISTINGS);
  }
}

export class GetMarketplaceListingsTotalParams extends CoreActionParams {
  public constructor() {
    super(ECoreActions.GET_LISTING_TOTAL);
  }
}

export class GetSiteVisitsMapParams extends CoreActionParams {
  public constructor() {
    super(ECoreActions.GET_SITE_VISITS_MAP);
  }
}

export class GetSiteVisitsParams extends CoreActionParams {
  public constructor() {
    super(ECoreActions.GET_SITE_VISITS);
  }
}

export class GetEarnedRewardsParams extends CoreActionParams {
  public constructor() {
    super(ECoreActions.GET_EARNED_REWARDS);
  }
}

export class GetDataWalletAddressParams extends CoreActionParams {
  public constructor() {
    super(ECoreActions.GET_DATA_WALLET_ADDRESS);
  }
}

export class CloseTabParams extends CoreActionParams {
  public constructor() {
    super(ECoreActions.CLOSE_TAB);
  }
}

export class IsDataWalletAddressInitializedParams extends CoreActionParams {
  public constructor() {
    super(ECoreActions.IS_DATA_WALLET_ADDRESS_INITIALIZED);
  }
}

export class GetLocationParams extends CoreActionParams {
  public constructor() {
    super(ECoreActions.GET_LOCATION);
  }
}

export class GetGenderParams extends CoreActionParams {
  public constructor() {
    super(ECoreActions.GET_GENDER);
  }
}

export class GetEmailParams extends CoreActionParams {
  public constructor() {
    super(ECoreActions.GET_EMAIL);
  }
}

export class GetBirthdayParams extends CoreActionParams {
  public constructor() {
    super(ECoreActions.GET_BIRTHDAY);
  }
}

export class GetGivenNameParams extends CoreActionParams {
  public constructor() {
    super(ECoreActions.GET_GIVEN_NAME);
  }
}

export class GetFamilyNameParams extends CoreActionParams {
  public constructor() {
    super(ECoreActions.GET_FAMILY_NAME);
  }
}

export class GetAgeParams extends CoreActionParams {
  public constructor() {
    super(ECoreActions.GET_AGE);
  }
}

export class GetAccountNFTsParams extends CoreActionParams {
  public constructor() {
    super(ECoreActions.GET_ACCOUNT_NFTS);
  }
}

export class GetAccountBalancesParams extends CoreActionParams {
  public constructor() {
    super(ECoreActions.GET_ACCOUNT_BALANCES);
  }
}

export class GetAccountsParams extends CoreActionParams {
  public constructor() {
    super(ECoreActions.GET_ACCOUNTS);
  }
}

export class GetApplyDefaultPermissionsOptionParams extends CoreActionParams {
  public constructor() {
    super(ECoreActions.GET_APPLY_DEFAULT_PERMISSIONS_OPTION);
  }
}

export class GetAcceptedInvitationsCIDParams extends CoreActionParams {
  public constructor() {
    super(ECoreActions.GET_ACCEPTED_INVITATIONS_CID);
  }
}

export class GetScamFilterSettingsParams extends CoreActionParams {
  public constructor() {
    super(ECoreActions.GET_SCAM_FILTER_SETTINGS);
  }
}

export class SetDefaultPermissionsToAllParams extends CoreActionParams {
  public constructor() {
    super(ECoreActions.SET_DEFAULT_PERMISSIONS_TO_ALL);
  }
}

export class GetDefaultPermissionsParams extends CoreActionParams {
  public constructor() {
    super(ECoreActions.GET_DEFAULT_PERMISSIONS);
  }
}

export class GetAvailableInvitationsCIDParms extends CoreActionParams {
  public constructor() {
    super(ECoreActions.GET_AVAILABLE_INVITATIONS_CID);
  }
}

export class GetStateParams extends CoreActionParams {
  public constructor() {
    super(ECoreActions.GET_STATE);
  }
}

export class GetInternalStateParams extends CoreActionParams {
  public constructor() {
    super(ECoreActions.GET_INTERNAL_STATE);
  }
}

export class SetDefaultReceivingAddressParams extends CoreActionParams {
  public constructor(public receivingAddress: AccountAddress | null) {
    super(ECoreActions.SET_DEFAULT_RECEIVING_ACCOUNT);
  }
}

export class SetReceivingAddressParams extends CoreActionParams {
  public constructor(
    public contractAddress: EVMContractAddress,
    public receivingAddress: AccountAddress | null,
  ) {
    super(ECoreActions.SET_RECEIVING_ACCOUNT);
  }
}

export class GetReceivingAddressParams extends CoreActionParams {
  public constructor(public contractAddress?: EVMContractAddress) {
    super(ECoreActions.GET_RECEIVING_ACCOUNT);
  }
}

export interface IInvitationDomainWithUUID {
  consentAddress: EVMContractAddress;
  domain: DomainName;
  title: string;
  description: string;
  image: URLString;
  rewardName: string;
  nftClaimedImage: URLString;
  id: UUID;
}
