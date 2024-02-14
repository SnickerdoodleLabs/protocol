import {
    ObjectUtils,
  } from "@snickerdoodlelabs/common-utils";
  import {
    BlockNumber,
    DataPermissions,
    EQueryProcessingStatus,
    ERewardType,
    EVMContractAddress,
    EVMPrivateKey,
    EarnedReward,
    IDynamicRewardParameter,
    IpfsCID,
    ESolidityAbiParameterType,
    QueryStatus,
    SDQLQuery,
    SDQLString,
    TokenId,
    UnixTimestamp,
    IQueryDeliveryItems,
  } from "@snickerdoodlelabs/objects";
  import {
    avalanche1SchemaStr,
  } from "@snickerdoodlelabs/query-parser";
  import "reflect-metadata";
  import * as td from "testdouble";
  
  import {
    IQuestionnaireRepository,
  } from "@core/interfaces/data/index.js";
import { QuestionnaireService } from "@core/implementations/business/QuestionnaireService";
import { IQueryParsingEngine } from "@core/interfaces/business/utilities";
import { IContextProvider } from "@core/interfaces/utilities";
  
  const now = UnixTimestamp(12345);
  const then = UnixTimestamp(2345);
  const consentContractAddress = EVMContractAddress("Phoebe");
  const queryCID1 = IpfsCID("Beep");
  const queryCID2 = IpfsCID("Boop");
  
  const queryDeliveryItems: IQueryDeliveryItems = {
    insights: {},
    ads: {},
  } as IQueryDeliveryItems; // TODO fill out with data
  
  const rewardParameter = {
    recipientAddress: {
      type: ESolidityAbiParameterType.address,
      value: "Phoebe",
    },
    compensationKey: {
      type: ESolidityAbiParameterType.string,
      value: "c1",
    },
  } as IDynamicRewardParameter;
  
  const rewardParameters = [rewardParameter];
  
  const earnedReward = new EarnedReward(
    queryCID1,
    "rewardName",
    null,
    "description",
    ERewardType.Direct,
  );
  
  
  class QuestionnaireServiceMocks {
    public questionnaireRepo: IQuestionnaireRepository;
    public queryParsingEngine: IQueryParsingEngine;
    public contextProvider: IContextProvider;
  
    public constructor() {
      this.questionnaireRepo = td.object<IQuestionnaireRepository>();
      this.queryParsingEngine = td.object<IQueryParsingEngine>();
      this.contextProvider = td.object<IContextProvider>();
    }
    
    public factory(): QuestionnaireService {
      return new QuestionnaireService(
        this.questionnaireRepo,
        this.queryParsingEngine,
        this.contextProvider,
      );
    }
  }
  
  