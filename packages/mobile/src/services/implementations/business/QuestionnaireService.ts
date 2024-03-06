import { injectable, inject } from "inversify";
import { IQuestionnaireService } from "../../interfaces/business/IQuestionnaireService";
import {
  DomainName,
  EVMContractAddress,
  IpfsCID,
  NewQuestionnaireAnswer,
  PagingRequest,
  Questionnaire,
  QuestionnaireWithAnswers,
  ISnickerdoodleCoreType,
  ISnickerdoodleCore,
  PagedResponse,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";
import {
  IErrorUtils,
  IErrorUtilsType,
} from "../../interfaces/utils/IErrorUtils";
import { SnickerDoodleCoreError } from "../../interfaces/objects/errors/SnickerDoodleCoreError";

@injectable()
export class QuestionnaireService implements IQuestionnaireService {
  constructor(
    @inject(ISnickerdoodleCoreType) private core: ISnickerdoodleCore,
    @inject(IErrorUtilsType) private errorUtils: IErrorUtils,
  ) {}

  public getQuestionnaires(
    pagingRequest: PagingRequest,
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<PagedResponse<Questionnaire>, SnickerDoodleCoreError> {
    return this.core.questionnaire
      .getQuestionnaires(pagingRequest, sourceDomain)
      .mapErr((error) => {
        this.errorUtils.emit(error);
        return new SnickerDoodleCoreError((error as Error).message);
      });
  }

  public getQuestionnairesForConsentContract(
    pagingRequest: PagingRequest,
    consentContractAddress: EVMContractAddress,
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<PagedResponse<Questionnaire>, SnickerDoodleCoreError> {
    return this.core.questionnaire
      .getQuestionnairesForConsentContract(
        pagingRequest,
        consentContractAddress,
        sourceDomain,
      )
      .mapErr((error) => {
        this.errorUtils.emit(error);
        return new SnickerDoodleCoreError((error as Error).message);
      });
  }

  public getAnsweredQuestionnaires(
    pagingRequest: PagingRequest,
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<
    PagedResponse<QuestionnaireWithAnswers>,
    SnickerDoodleCoreError
  > {
    return this.core.questionnaire
      .getAnsweredQuestionnaires(pagingRequest, sourceDomain)
      .mapErr((error) => {
        this.errorUtils.emit(error);
        return new SnickerDoodleCoreError((error as Error).message);
      });
  }

  public answerQuestionnaire(
    questionnaireId: IpfsCID,
    answers: NewQuestionnaireAnswer[],
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.core.questionnaire
      .answerQuestionnaire(questionnaireId, answers, sourceDomain)
      .mapErr((error) => {
        this.errorUtils.emit(error);
        return new SnickerDoodleCoreError((error as Error).message);
      });
  }

  public getAllQuestionnaires(
    pagingRequest: PagingRequest,
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<
    PagedResponse<Questionnaire | QuestionnaireWithAnswers>,
    SnickerDoodleCoreError
  > {
    return this.core.questionnaire
      .getAllQuestionnaires(pagingRequest, sourceDomain)
      .mapErr((error) => {
        this.errorUtils.emit(error);
        return new SnickerDoodleCoreError((error as Error).message);
      });
  }

  public getConsentContractsByQuestionnaireCID(
    ipfsCID: IpfsCID,
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<EVMContractAddress[], SnickerDoodleCoreError> {
    return this.core.questionnaire
      .getConsentContractsByQuestionnaireCID(ipfsCID, sourceDomain)
      .mapErr((error) => {
        this.errorUtils.emit(error);
        return new SnickerDoodleCoreError((error as Error).message);
      });
  }

  public getRecommendedConsentContracts(
    questionnaireId: IpfsCID,
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<EVMContractAddress[], SnickerDoodleCoreError> {
    return this.core.questionnaire
      .getRecommendedConsentContracts(questionnaireId, sourceDomain)
      .mapErr((error) => {
        this.errorUtils.emit(error);
        return new SnickerDoodleCoreError((error as Error).message);
      });
  }
}
