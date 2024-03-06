import {
  DomainName,
  EVMContractAddress,
  IpfsCID,
  NewQuestionnaireAnswer,
  PageInvitation,
  PagedResponse,
  PagingRequest,
  Questionnaire,
  QuestionnaireWithAnswers,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";
import { SnickerDoodleCoreError } from "../objects/errors/SnickerDoodleCoreError";

export interface IQuestionnaireService {
  getQuestionnaires(
    pagingRequest: PagingRequest,
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<PagedResponse<Questionnaire>, SnickerDoodleCoreError>;

  getQuestionnairesForConsentContract(
    pagingRequest: PagingRequest,
    consentContractAddress: EVMContractAddress,
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<PagedResponse<Questionnaire>, SnickerDoodleCoreError>;

  getAnsweredQuestionnaires(
    pagingRequest: PagingRequest,
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<
    PagedResponse<QuestionnaireWithAnswers>,
    SnickerDoodleCoreError
  >;

  answerQuestionnaire(
    questionnaireId: IpfsCID,
    answers: NewQuestionnaireAnswer[],
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<void, SnickerDoodleCoreError>;

  getAllQuestionnaires(
    pagingRequest: PagingRequest,
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<
    PagedResponse<Questionnaire | QuestionnaireWithAnswers>,
    SnickerDoodleCoreError
  >;

  getConsentContractsByQuestionnaireCID(
    ipfsCID: IpfsCID,
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<EVMContractAddress[], SnickerDoodleCoreError>;

  getRecommendedConsentContracts(
    questionnaireId: IpfsCID,
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<EVMContractAddress[], SnickerDoodleCoreError>;
}

export const IQuestionnaireServiceType = Symbol.for("IQuestionnaireService");