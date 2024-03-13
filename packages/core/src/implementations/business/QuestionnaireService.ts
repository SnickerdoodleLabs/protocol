import {
  DomainName,
  Questionnaire,
  PersistenceError,
  EVMContractAddress,
  PagingRequest,
  PagedResponse,
  QuestionnaireWithAnswers,
  IpfsCID,
  NewQuestionnaireAnswer,
  InvalidParametersError,
  AjaxError,
  EQuestionnaireStatus,
  BlockchainCommonErrors,
  ConsentContractError,
  UninitializedError,
  ConsentFactoryContractError,
  EWalletDataType,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync, errAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { IQuestionnaireService } from "@core/interfaces/business/index.js";
import {
  IConsentContractRepository,
  IConsentContractRepositoryType,
  IInvitationRepository,
  IInvitationRepositoryType,
  IQuestionnaireRepository,
  IQuestionnaireRepositoryType,
} from "@core/interfaces/data/index.js";

@injectable()
export class QuestionnaireService implements IQuestionnaireService {
  public constructor(
    @inject(IQuestionnaireRepositoryType)
    protected questionnaireRepo: IQuestionnaireRepository,
    @inject(IConsentContractRepositoryType)
    protected consentContractRepository: IConsentContractRepository,
    @inject(IInvitationRepositoryType)
    protected invitationRepo: IInvitationRepository,
  ) {}

  public getQuestionnaires(
    pagingRequest: PagingRequest,
    _sourceDomain: DomainName | undefined,
  ): ResultAsync<
    PagedResponse<Questionnaire>,
    | UninitializedError
    | BlockchainCommonErrors
    | AjaxError
    | PersistenceError
    | ConsentFactoryContractError
  > {
    return this.consentContractRepository
      .getDefaultQuestionnaires()
      .andThen((defaultCids) => {
        const uniqueCidsArray = this.uniqueCids(defaultCids);
        return this.questionnaireRepo.add(uniqueCidsArray).andThen(() => {
          return this.questionnaireRepo.getPagedQuestionnairesByCIDs(
            uniqueCidsArray,
            pagingRequest,
            EQuestionnaireStatus.Available,
          );
        });
      })
      .map((pagedResponse) => pagedResponse as PagedResponse<Questionnaire>);
  }

  public getQuestionnairesForConsentContract(
    pagingRequest: PagingRequest,
    consentContractAddress: EVMContractAddress,
    _sourceDomain: DomainName | undefined,
  ): ResultAsync<
    PagedResponse<Questionnaire | QuestionnaireWithAnswers>,
    | UninitializedError
    | BlockchainCommonErrors
    | AjaxError
    | PersistenceError
    | ConsentContractError
  > {
    return this.consentContractRepository
      .getQuestionnaires(consentContractAddress)
      .andThen((cids) => {
        const uniqueCidsArray = this.uniqueCids(cids);
        return this.questionnaireRepo.add(uniqueCidsArray).andThen(() => {
          return this.questionnaireRepo.getPagedQuestionnairesByCIDs(
            uniqueCidsArray,
            pagingRequest,
          );
        });
      })
      .map((pagedResponse) => pagedResponse as PagedResponse<Questionnaire>);
  }

  public getAnsweredQuestionnaires(
    pagingRequest: PagingRequest,
    _sourceDomain: DomainName | undefined,
  ): ResultAsync<
    PagedResponse<QuestionnaireWithAnswers>,
    PersistenceError | AjaxError
  > {
    return this.questionnaireRepo.getAnswered(pagingRequest);
  }

  public getAllQuestionnaires(
    pagingRequest: PagingRequest,
    _sourceDomain: DomainName | undefined,
  ): ResultAsync<
    PagedResponse<Questionnaire | QuestionnaireWithAnswers>,
    | UninitializedError
    | BlockchainCommonErrors
    | AjaxError
    | PersistenceError
    | ConsentFactoryContractError
  > {
    return this.questionnaireRepo.getAll(pagingRequest);
  }

  public getConsentContractsByQuestionnaireCID(
    ipfsCID: IpfsCID,
    _sourceDomain: DomainName | undefined,
  ): ResultAsync<
    EVMContractAddress[],
    | PersistenceError
    | UninitializedError
    | ConsentFactoryContractError
    | BlockchainCommonErrors
    | ConsentContractError
    | AjaxError
  > {
    return this.invitationRepo
      .getAcceptedInvitations()
      .andThen((acceptedInvitations) => {
        return ResultUtils.combine(
          acceptedInvitations.map((optInInfo) => {
            return this.consentContractRepository
              .getQuestionnaires(optInInfo.consentContractAddress)
              .map((questionnaireCIDs) => {
                const uniqueCidsArray = this.uniqueCids(questionnaireCIDs);
                return {
                  consentContractAddress: optInInfo.consentContractAddress,
                  hasSpecifiedCid: Array.from(
                    uniqueCidsArray.values(),
                  ).includes(ipfsCID),
                };
              });
          }),
        ).map((results) => {
          const consentContractAddresses = new Set<EVMContractAddress>();
          results.forEach((result) => {
            if (result.hasSpecifiedCid) {
              consentContractAddresses.add(result.consentContractAddress);
            }
          });
          return Array.from(consentContractAddresses);
        });
      });
  }

  public answerQuestionnaire(
    questionnaireId: IpfsCID,
    answers: NewQuestionnaireAnswer[],
    _sourceDomain: DomainName | undefined,
  ): ResultAsync<void, PersistenceError | AjaxError | InvalidParametersError> {
    // Validate that the answers are for the same questionnaire
    for (const answer of answers) {
      if (answer.questionnaireId !== questionnaireId) {
        return errAsync(
          new InvalidParametersError(
            "All answers must be for the same questionnaire",
          ),
        );
      }
    }
    return this.questionnaireRepo.upsertAnswers(questionnaireId, answers);
    // Validate that the answers are valid for the questionnaire
    // TODO;
  }

  public getByCIDs(
    questionnaireCIDs: IpfsCID[],
  ): ResultAsync<
    (Questionnaire | QuestionnaireWithAnswers)[],
    PersistenceError | AjaxError
  > {
    return this.questionnaireRepo.getByCIDs(questionnaireCIDs);
  }

  public getRecommendedConsentContracts(
    questionnaire: IpfsCID,
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<EVMContractAddress[], PersistenceError> {
    // TODO: Big fat TODO here.
    // Basic idea, we need to go to the Consent Contract Factory and get the list of
    // consent contracts that have staked against the questionnaire.
    throw new Error("Method not implemented.");
  }

  public getVirtualQuestionnaires(
    consentContractAddress: EVMContractAddress,
    sourceDomain: DomainName | undefined,
  ): ResultAsync<
    EWalletDataType[],
    ConsentContractError | UninitializedError | BlockchainCommonErrors
  > {
    return this.consentContractRepository.getVirtualQuestionnaires(
      consentContractAddress,
    );
  }

  private uniqueCids(cids: IpfsCID[]): IpfsCID[] {
    const uniqueCidsSet = new Set<IpfsCID>(cids);
    return Array.from(uniqueCidsSet);
  }
}
