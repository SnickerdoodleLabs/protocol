
import td from "testdouble";
import { okAsync } from "neverthrow";
import { dataWalletAddress, dataWalletKey } from "@core-tests/mock/mocks";
import { IQueryParsingEngine } from "@core/interfaces/business/utilities";
import { IConsentContractRepository, IInsightPlatformRepository, ISDQLQueryRepository } from "@core/interfaces/data";
import { EVMAccountAddress, EVMContractAddress, IpfsCID, SDQLQuery, SDQLString } from "@snickerdoodlelabs/objects";
import { ContextProviderMock } from "@core-tests/mock/utilities";
import { IQueryService } from "@core/interfaces/business";
import { QueryService } from "@core/implementations/business";
import { IConfigProvider } from "@core/interfaces/utilities";
import { ICryptoUtils } from "@snickerdoodlelabs/common-utils";

const consentContractAddress = EVMContractAddress("Phoebe");
const queryId = IpfsCID("Beep");
const queryContent = SDQLString("Hello world!");
const sdqlQuery = new SDQLQuery(queryId, queryContent);


class QueryServiceMocks {
  public queryParsingEngine: IQueryParsingEngine;
  public sdqlQueryRepo: ISDQLQueryRepository;
  public insightPlatformRepo: IInsightPlatformRepository;
  public consentContractRepo: IConsentContractRepository;
  public contextProvider: ContextProviderMock;
  public configProvider: IConfigProvider;
  public cryptoUtils: ICryptoUtils;

  public constructor() {
    this.queryParsingEngine = td.object<IQueryParsingEngine>();
    this.sdqlQueryRepo = td.object<ISDQLQueryRepository>();
    this.insightPlatformRepo = td.object<IInsightPlatformRepository>();
    this.consentContractRepo = td.object<IConsentContractRepository>();
    this.contextProvider = new ContextProviderMock();

    td.when(this.sdqlQueryRepo.getByCID(queryId)).thenReturn(
      okAsync(sdqlQuery),
    );

    td.when(
      this.consentContractRepo.isAddressOptedIn(
        consentContractAddress,
        EVMAccountAddress(dataWalletAddress),
      ),
    ).thenReturn(okAsync(true));
  }

  public factory(): IQueryService {
    return new QueryService(
      this.queryParsingEngine,
      this.sdqlQueryRepo,
      this.insightPlatformRepo,
      this.consentContractRepo,
      // this.contextProvider
    );
  }
}