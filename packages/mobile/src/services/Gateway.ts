import { SnickerdoodleCore } from "@snickerdoodlelabs/core";
import {
  AccountAddress,
  BigNumberString,
  BlockchainProviderError,
  ChainId,
  CrumbsContractError,
  DataPermissions,
  DataWalletAddress,
  DomainName,
  EChain,
  EInvitationStatus,
  EVMContractAddress,
  IConfigOverrides,
  InvalidSignatureError,
  Invitation,
  IpfsCID,
  ISnickerdoodleCore,
  ISnickerdoodleCoreType,
  LanguageCode,
  LinkedAccount,
  PersistenceError,
  Signature,
  TokenId,
  UninitializedError,
  UnsupportedLanguageError,
  URLString,
} from "@snickerdoodlelabs/objects";
import { Container } from "inversify";
import { ResultAsync } from "neverthrow";
import { MobileStorageUtils } from "./implementations/utils/MobileStorageUtils";
import { MemoryVolatileStorage } from "@snickerdoodlelabs/persistence";
import { mobileCoreModule } from "./Gateway.module";
import { coreConfig } from "./interfaces/objects/Config";

export class MobileCore {
  protected iocContainer: Container;
  protected core: ISnickerdoodleCore;
  constructor() {
    this.iocContainer = new Container();
    this.iocContainer.load(...[mobileCoreModule]);

    this.core = new SnickerdoodleCore(
      coreConfig,
      new MobileStorageUtils(),
      new MemoryVolatileStorage(),
      undefined,
    );
    this.iocContainer.bind(ISnickerdoodleCoreType).toConstantValue(this.core);
  }

  public unlock(
    accountAddress: AccountAddress,
    signature: Signature,
    languageCode: LanguageCode,
    chain: EChain,
  ) {
    console.log("accountAddress", accountAddress);
    console.log("signature", signature);
    console.log("languageCode", languageCode);
    console.log("chain", chain);
    this.core.unlock(accountAddress, signature, languageCode, chain);
  }

  public getDataWalletForAccount(
    accountAddress: AccountAddress,
    signature: Signature,
    languageCode: LanguageCode,
    chain: EChain,
  ): ResultAsync<
    DataWalletAddress | null,
    | PersistenceError
    | UninitializedError
    | BlockchainProviderError
    | CrumbsContractError
    | InvalidSignatureError
    | UnsupportedLanguageError
  > {
    return this.core.getDataWalletForAccount(
      accountAddress,
      signature,
      languageCode,
      chain,
    );
  }

  public getAccounts(): ResultAsync<LinkedAccount[], PersistenceError> {
    return this.core.getAccounts();
  }
  public isDataWalletAddressInitialized() {
    return this.core.isDataWalletAddressInitialized();
  }
  public getAccountBalances() {
    return this.core.getAccountBalances();
  }
  public getAccountNFTs() {
    return this.core.getAccountNFTs();
  }
  public checkInvitationStatus(
    consentAddress: EVMContractAddress,
    signature?: Signature,
    tokenId?: BigNumberString,
  ): ResultAsync<EInvitationStatus, Error> {
    const invitation = new Invitation(
      "" as DomainName,
      consentAddress,
      TokenId(BigInt(281474976710655)),
      signature ?? null,
    );
    return this.core.checkInvitationStatus(invitation);
  }
  public getConsentContractCID(consentAddress: EVMContractAddress) {
    return this.core.getConsentContractCID(consentAddress);
  }
  public getInvitationMetadataByCID(ipfsCID: IpfsCID) {
    return this.core.getInvitationMetadataByCID(ipfsCID);
  }
  public getUnlockMessage(): ResultAsync<string, UnsupportedLanguageError> {
    return this.core.getUnlockMessage("en" as LanguageCode);
  }

  public acceptInvitation(
    invitation: Invitation,
    dataPermissions: DataPermissions | null,
  ) {
    return this.core.acceptInvitation(invitation, dataPermissions);
  }
}
