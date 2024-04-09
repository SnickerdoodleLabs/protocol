import { ILogUtils, ILogUtilsType } from "@snickerdoodlelabs/common-utils";
import {
  AjaxError,
  BlockchainCommonErrors,
  ConsentContractError,
  ConsentFactoryContractError,
  IpfsCID,
  PersistenceError,
  QuestionnairesContractError,
  UninitializedError,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync, okAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { ICachingService } from "@core/interfaces/business/index.js";
import {
  IConsentContractRepository,
  IConsentContractRepositoryType,
  IInvitationRepository,
  IInvitationRepositoryType,
  IQuestionnaireRepository,
  IQuestionnaireRepositoryType,
  IQuestionnairesContractRepository,
  IQuestionnairesContractRepositoryType,
} from "@core/interfaces/data/index.js";

@injectable()
export class CachingService implements ICachingService {
  public constructor(
    @inject(IQuestionnaireRepositoryType)
    protected questionnaireRepo: IQuestionnaireRepository,
    @inject(IConsentContractRepositoryType)
    protected consentContractRepo: IConsentContractRepository,
    @inject(IQuestionnairesContractRepositoryType)
    protected questionnairesContractRepo: IQuestionnairesContractRepository,
    @inject(IInvitationRepositoryType)
    protected invitationRepo: IInvitationRepository,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {}

  public updateQuestionnaireCache(): ResultAsync<
    void,
    | PersistenceError
    | UninitializedError
    | ConsentFactoryContractError
    | QuestionnairesContractError
    | BlockchainCommonErrors
    | ConsentContractError
    | AjaxError
  > {
    return ResultUtils.combine([
      this.invitationRepo.getAcceptedInvitations(),
      this.questionnairesContractRepo.getDefaultQuestionnaires(),
    ]).andThen(([acceptedInvitations, defaultQuestionnaireIds]) => {
      // Loop over the accepted invitations and get the questionnaires from the consent contracts
      return ResultUtils.combine(
        acceptedInvitations.map((optInInfo) => {
          return this.consentContractRepo.getQuestionnaires(
            optInInfo.consentContractAddress,
          );
        }),
      ).andThen((consentContractQuestionnairesCIDS) => {
        // Build a set of all the IPFS CIDs that we are interested in.
        // Start with the default list, and then add the ones from the consent contracts
        const ipfsCIDs = new Set<IpfsCID>(defaultQuestionnaireIds);
        for (const consentContractMap of consentContractQuestionnairesCIDS) {
          for (const ipfsCID of consentContractMap.values()) {
            ipfsCIDs.add(ipfsCID);
          }
        }

        return this.questionnaireRepo.add(Array.from(ipfsCIDs));
      });
    });
  }
}
