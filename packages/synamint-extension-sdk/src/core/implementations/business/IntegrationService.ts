import {
  ISnickerdoodleCoreType,
  ISnickerdoodleCore,
  DomainName,
  EDataWalletPermission,
  JsonWebToken,
  PEMEncodedRSAPublicKey,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import { IIntegrationService } from "@synamint-extension-sdk/core/interfaces/business";
import {
  IErrorUtilsType,
  IErrorUtils,
} from "@synamint-extension-sdk/core/interfaces/utilities";
import { SnickerDoodleCoreError } from "@synamint-extension-sdk/shared";

@injectable()
export class IntegrationService implements IIntegrationService {
  constructor(
    @inject(ISnickerdoodleCoreType) protected core: ISnickerdoodleCore,
    @inject(IErrorUtilsType) protected errorUtils: IErrorUtils,
  ) {}

  public requestPermissions(
    permissions: EDataWalletPermission[],
    sourceDomain: DomainName,
  ): ResultAsync<EDataWalletPermission[], SnickerDoodleCoreError> {
    return this.core.integration
      .requestPermissions(permissions, sourceDomain)
      .mapErr((error) => {
        this.errorUtils.emit(error);
        return new SnickerDoodleCoreError((error as Error).message, error);
      });
  }

  public getPermissions(
    domain: DomainName,
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<EDataWalletPermission[], SnickerDoodleCoreError> {
    return this.core.integration
      .getPermissions(domain, sourceDomain)
      .mapErr((error) => {
        this.errorUtils.emit(error);
        return new SnickerDoodleCoreError((error as Error).message, error);
      });
  }

  public getTokenVerificationPublicKey(
    domain: DomainName,
  ): ResultAsync<PEMEncodedRSAPublicKey, SnickerDoodleCoreError> {
    return this.core.integration
      .getTokenVerificationPublicKey(domain)
      .mapErr((error) => {
        this.errorUtils.emit(error);
        return new SnickerDoodleCoreError((error as Error).message, error);
      });
  }

  public getBearerToken(
    nonce: string,
    domain: DomainName,
  ): ResultAsync<JsonWebToken, SnickerDoodleCoreError> {
    return this.core.integration
      .getBearerToken(nonce, domain)
      .mapErr((error) => {
        this.errorUtils.emit(error);
        return new SnickerDoodleCoreError((error as Error).message, error);
      });
  }
}
