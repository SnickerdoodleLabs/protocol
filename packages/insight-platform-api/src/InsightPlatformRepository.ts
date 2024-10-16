import { CircomUtils } from "@snickerdoodlelabs/circuits";
import {
  ICommitmentWrapper,
  ICommitmentWrapperType,
  IMembershipWrapper,
  IMembershipWrapperType,
} from "@snickerdoodlelabs/circuits-sdk";
import {
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
  ObjectUtils,
} from "@snickerdoodlelabs/common-utils";
import {
  AjaxError,
  BigNumberString,
  EarnedReward,
  EVMContractAddress,
  IDynamicRewardParameter,
  IpfsCID,
  Signature,
  URLString,
  IQueryDeliveryItems,
  Commitment,
  CircuitError,
  NullifierBNS,
  TrapdoorBNS,
  PublicEvents,
  QueryPerformanceEvent,
  EQueryEvents,
  EStatus,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";
import { urlJoin } from "url-join-ts";

import { IInsightPlatformRepository } from "@insightPlatform/IInsightPlatformRepository.js";
import {
  IDeliverInsightsParams,
  IOptinParams,
  IPrivateOptinParams,
} from "@insightPlatform/params/index.js";

@injectable()
export class InsightPlatformRepository implements IInsightPlatformRepository {
  public constructor(
    @inject(IAxiosAjaxUtilsType) protected ajaxUtils: IAxiosAjaxUtils,
    @inject(IMembershipWrapperType)
    protected membershipWrapper: IMembershipWrapper,
    @inject(ICommitmentWrapperType)
    protected commitmentWrapper: ICommitmentWrapper,
  ) {}

  public deliverInsights(
    consentContractAddress: EVMContractAddress,
    trapdoor: TrapdoorBNS,
    nullifier: NullifierBNS,
    queryCID: IpfsCID,
    insights: IQueryDeliveryItems,
    rewardParameters: IDynamicRewardParameter[],
    anonymitySet: Commitment[],
    anonymitySetStart: number,
    insightPlatformBaseUrl: URLString,
    publicEvents: PublicEvents,
  ): ResultAsync<EarnedReward[], AjaxError | CircuitError> {
    // Calculate the values we need to include in the signal
    const commitment = CircomUtils.getCommitment(trapdoor, nullifier);
    const signalNullifier = CircomUtils.getSignalNullifier(nullifier, queryCID);

    // Check if the passed-in anonymity set includes the identity's commitment
    let anonymitySetSize = anonymitySet.length;
    if (anonymitySet.indexOf(commitment) === -1) {
      anonymitySetSize += 1;
    }

    const serializedInsights = ObjectUtils.serialize(insights);
    const serializedRewardParameters = ObjectUtils.serialize(rewardParameters);

    // Create the provable data
    const signal = {
      consentContractId: consentContractAddress,
      queryCID: queryCID,
      insights: serializedInsights,
      rewardParameters: serializedRewardParameters,
      signalNullifier: signalNullifier,
      anonymitySetStart: anonymitySetStart,
      anonymitySetSize: anonymitySetSize,
    } as Omit<IDeliverInsightsParams, "proof">;

    publicEvents.queryPerformance.next(
      new QueryPerformanceEvent(
        EQueryEvents.MembershipProve,
        EStatus.Start,
        queryCID,
      ),
    );
    return this.membershipWrapper
      .prove(
        ObjectUtils.serialize(signal),
        trapdoor,
        nullifier,
        anonymitySet,
        queryCID,
      )
      .mapErr((err) => {
        publicEvents.queryPerformance.next(
          new QueryPerformanceEvent(
            EQueryEvents.MembershipProve,
            EStatus.End,
            queryCID,
            undefined,
            err,
          ),
        );
        return err;
      })
      .andThen((proof) => {
        publicEvents.queryPerformance.next(
          new QueryPerformanceEvent(
            EQueryEvents.MembershipProve,
            EStatus.End,
            queryCID,
          ),
        );

        publicEvents.queryPerformance.next(
          new QueryPerformanceEvent(
            EQueryEvents.DeliverInsightsCall,
            EStatus.Start,
            queryCID,
          ),
        );
        const url = new URL(urlJoin(insightPlatformBaseUrl, "insights"));
        return this.ajaxUtils
          .post<EarnedReward[]>(url, {
            consentContractId: consentContractAddress,
            queryCID: queryCID,
            insights: serializedInsights,
            rewardParameters: serializedRewardParameters,
            signalNullifier: signalNullifier,
            anonymitySetStart: anonymitySetStart,
            anonymitySetSize: anonymitySetSize,
            proof: proof,
          } as IDeliverInsightsParams as unknown as Record<string, unknown>)
          .map((res) => {
            publicEvents.queryPerformance.next(
              new QueryPerformanceEvent(
                EQueryEvents.DeliverInsightsCall,
                EStatus.End,
                queryCID,
              ),
            );
            return res;
          })
          .mapErr((err) => {
            publicEvents.queryPerformance.next(
              new QueryPerformanceEvent(
                EQueryEvents.DeliverInsightsCall,
                EStatus.End,
                queryCID,
                undefined,
                err,
              ),
            );
            return err;
          });
      });
  }

  public optin(
    consentContractAddress: EVMContractAddress,
    trapdoor: TrapdoorBNS,
    nullifier: NullifierBNS,
    insightPlatformBaseUrl: URLString,
  ): ResultAsync<void, AjaxError | CircuitError> {
    // Calculate the values we need to include in the signal
    const commitment = CircomUtils.getCommitment(trapdoor, nullifier);

    // Create the provable data
    const signal = {
      consentContractId: consentContractAddress,
      commitment: commitment,
    };

    return this.commitmentWrapper
      .prove(ObjectUtils.serialize(signal), trapdoor, nullifier)
      .andThen((proof) => {
        const url = new URL(urlJoin(insightPlatformBaseUrl, "optin"));

        return this.ajaxUtils.post<{ success: boolean }>(url, {
          consentContractId: consentContractAddress,
          commitment: commitment.toString(),
          proof: proof,
        } as IOptinParams as unknown as Record<string, unknown>);
      })
      .map(() => {});
  }

  public privateOptin(
    consentContractAddress: EVMContractAddress,
    trapdoor: TrapdoorBNS,
    nullifier: NullifierBNS,
    nonce: BigNumberString,
    signature: Signature,
    insightPlatformBaseUrl: URLString,
  ): ResultAsync<void, AjaxError | CircuitError> {
    // Calculate the values we need to include in the signal
    const commitment = CircomUtils.getCommitment(trapdoor, nullifier);

    // Create the provable data
    const signal = {
      consentContractId: consentContractAddress,
      commitment: commitment,
      nonce: nonce,
      signature: signature,
    };

    return this.commitmentWrapper
      .prove(ObjectUtils.serialize(signal), trapdoor, nullifier)
      .andThen((proof) => {
        const url = new URL(urlJoin(insightPlatformBaseUrl, "optin"));

        return this.ajaxUtils.post<{ success: boolean }>(url, {
          consentContractId: consentContractAddress,
          commitment: commitment.toString(),
          proof: proof,
        } as IPrivateOptinParams as unknown as Record<string, unknown>);
      })
      .map(() => {});
  }
}
