import {
    EVMContractAddress,
    IDynamicRewardParameter,
    IpfsCID,
    IQuestionnaireDeliveryItems,
    Signature,
  } from "@snickerdoodlelabs/objects";
  
  export interface IDeliverQuestionnaireParams {
    consentContractId: EVMContractAddress;
    tokenId: string;
    queryCID: IpfsCID;
    questionnaires: IQuestionnaireDeliveryItems;
    rewardParameters: IDynamicRewardParameter[];
    signature: Signature;
  }