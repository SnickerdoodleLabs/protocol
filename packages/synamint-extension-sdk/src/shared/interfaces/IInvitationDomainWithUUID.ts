import {
  DomainName,
  EVMContractAddress,
  URLString,
  UUID,
} from "@snickerdoodlelabs/objects";

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
