import { ILogUtils, ILogUtilsType } from "@snickerdoodlelabs/common-utils";
import {
  BlockchainCommonErrors,
  ConsentContractError,
  ConsentFactoryContractError,
  IpfsCID,
  PersistenceError,
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
} from "@core/interfaces/data/index.js";

@injectable()
export class CachingService implements ICachingService {
  public constructor(
    @inject(IQuestionnaireRepositoryType)
    protected questionnaireRepo: IQuestionnaireRepository,
    @inject(IConsentContractRepositoryType)
    protected consentContractRepo: IConsentContractRepository,
    @inject(IInvitationRepositoryType)
    protected invitationRepo: IInvitationRepository,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {}

  public updateQuestionnaireCache(): ResultAsync<
    void,
    | PersistenceError
    | UninitializedError
    | ConsentFactoryContractError
    | BlockchainCommonErrors
    | ConsentContractError
  > {
    // TODO: Remove this once the contracts are updated
    return okAsync(undefined);

    return ResultUtils.combine([
      this.questionnaireRepo.getCachedQuestionnaireIds(),
      this.invitationRepo.getAcceptedInvitations(),
      this.consentContractRepo.getDefaultQuestionnaires(),
    ]).andThen(
      ([
        cachedQuestionnaireIds,
        acceptedInvitations,
        defaultQuestionnaireIds,
      ]) => {
        // Loop over the accepted invitations and get the questionnaires from the consent contracts
        return ResultUtils.combine(
          acceptedInvitations.map((optInInfo) => {
            return this.consentContractRepo.getQuestionnaires(
              optInInfo.consentContractAddress,
            );
          }),
        ).andThen((consentContractQuestionnaires) => {
          // Build a set of all the IPFS CIDs that we are interested in.
          // Start with the default list, and then add the ones from the consent contracts
          const ipfsCIDs = new Set<IpfsCID>(defaultQuestionnaireIds);
          for (const consentContractMap of consentContractQuestionnaires) {
            for (const ipfsCID of consentContractMap.values()) {
              ipfsCIDs.add(ipfsCID);
            }
          }

          // Get a diff of the CIDs that we have in the cache already and those that we need
          const cidsToAdd = new Array<IpfsCID>();
          for (const cid of ipfsCIDs.values()) {
            if (!cachedQuestionnaireIds.includes(cid)) {
              cidsToAdd.push(cid);
            }
          }
          return this.questionnaireRepo.add(cidsToAdd);
        });
      },
    );
  }
}
