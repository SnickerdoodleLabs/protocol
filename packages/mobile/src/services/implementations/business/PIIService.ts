import {
  AccountAddress,
  Signature,
  EChain,
  LanguageCode,
  LinkedAccount,
  TokenBalance,
  WalletNFT,
  DataWalletAddress,
  EarnedReward,
  EmailAddressString,
  Age,
  CountryCode,
  UnixTimestamp,
  FamilyName,
  GivenName,
  Gender,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";
import { IAccountService } from "../../interfaces/business/IAccountService";
import { IPIIService } from "../../interfaces/business/IPIIService";
import {
  IAccountRepository,
  IAccountRepositoryType,
} from "../../interfaces/data/IAccountRepository";
import {
  IPIIRepository,
  IPIIRepositoryType,
} from "../../interfaces/data/IPIIRepository";
import { SnickerDoodleCoreError } from "../../interfaces/objects/errors/SnickerDoodleCoreError";

@injectable()
export class PIIService implements IPIIService {
  constructor(
    @inject(IPIIRepositoryType)
    protected piiRepository: IPIIRepository,
  ) {}

  public getAge(): ResultAsync<Age | null, SnickerDoodleCoreError> {
    return this.piiRepository.getAge();
  }
  public setGivenName(
    name: GivenName,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.piiRepository.setGivenName(name);
  }
  public getGivenName(): ResultAsync<GivenName | null, SnickerDoodleCoreError> {
    return this.piiRepository.getGivenName();
  }
  public setFamilyName(
    name: FamilyName,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.piiRepository.setFamilyName(name);
  }
  public test() {
    return "42412";
  }
  public getFamilyName(): ResultAsync<
    FamilyName | null,
    SnickerDoodleCoreError
  > {
    return this.piiRepository.getFamilyName();
  }
  public setBirthday(
    birthday: UnixTimestamp,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.piiRepository.setBirthday(birthday);
  }
  public getBirthday(): ResultAsync<
    UnixTimestamp | null,
    SnickerDoodleCoreError
  > {
    return this.piiRepository.getBirthday();
  }
  public setGender(gender: Gender): ResultAsync<void, SnickerDoodleCoreError> {
    return this.piiRepository.setGender(gender);
  }
  public getGender(): ResultAsync<Gender | null, SnickerDoodleCoreError> {
    return this.piiRepository.getGender();
  }
  public setEmail(
    email: EmailAddressString,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.piiRepository.setEmail(email);
  }
  public getEmail(): ResultAsync<
    EmailAddressString | null,
    SnickerDoodleCoreError
  > {
    return this.piiRepository.getEmail();
  }
  public setLocation(
    location: CountryCode,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.piiRepository.setLocation(location);
  }
  public getLocation(): ResultAsync<
    CountryCode | null,
    SnickerDoodleCoreError
  > {
    return this.piiRepository.getLocation();
  }
}
