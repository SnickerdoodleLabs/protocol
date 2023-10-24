import {
  DomainName,
  PageInvitation,
  URLString,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IInvitationService {
  handleURL(url: URLString): ResultAsync<void, never>;
  getInvitationByDomain(
    domain: DomainName,
    path: string,
  ): ResultAsync<PageInvitation | null, Error>;
}

export const IInvitationServiceType = Symbol.for("IInvitationService");
