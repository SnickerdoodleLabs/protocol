import { OptInInfo } from "@objects/businessObjects/OptInInfo.js";
import {
  VersionedObject,
  VersionedObjectMigrator,
} from "@objects/businessObjects/VersionedObject";
import {
  DomainName,
  EVMContractAddress,
  Signature,
  TokenId,
} from "@objects/primitives";

export class Invitation extends OptInInfo {
  public constructor(
    public domain: DomainName,
    public consentContractAddress: EVMContractAddress,
    public tokenId: TokenId,
    public businessSignature: Signature | null,
  ) {
    super(consentContractAddress, tokenId);
  }
}

export class InvitationForStorage extends VersionedObject {
  public static CURRENT_VERSION = 1;

  public constructor(
    public domain: DomainName,
    public consentContractAddress: EVMContractAddress,
    public tokenId: string,
    public businessSignature: Signature | null,
  ) {
    super();
  }

  public getVersion(): number {
    return InvitationForStorage.CURRENT_VERSION;
  }

  static toInvitation(src: InvitationForStorage): Invitation {
    return new Invitation(
      src.domain,
      src.consentContractAddress,
      TokenId(BigInt(src.tokenId)),
      src.businessSignature,
    );
  }

  static fromInvitation(src: Invitation): InvitationForStorage {
    return new InvitationForStorage(
      src.domain,
      src.consentContractAddress,
      src.tokenId.toString(),
      src.businessSignature,
    );
  }
}

export class InvitationMigrator extends VersionedObjectMigrator<InvitationForStorage> {
  public getCurrentVersion(): number {
    return InvitationForStorage.CURRENT_VERSION;
  }

  protected factory(data: Record<string, unknown>): InvitationForStorage {
    return new InvitationForStorage(
      data["domain"] as DomainName,
      data["consentContractAddress"] as EVMContractAddress,
      data["tokenId"] as string,
      data["businessSignature"] as Signature | null,
    );
  }

  protected getUpgradeFunctions(): Map<
    number,
    (data: Record<string, unknown>, version: number) => Record<string, unknown>
  > {
    return new Map();
  }
}
