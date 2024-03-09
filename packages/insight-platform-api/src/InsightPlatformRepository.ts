import {
  ICommitmentWrapper,
  ICommitmentWrapperType,
  IMembershipWrapper,
  IMembershipWrapperType,
  MembershipWrapper,
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
    trapdoor: BigNumberString,
    nullifier: BigNumberString,
    queryCID: IpfsCID,
    insights: IQueryDeliveryItems,
    rewardParameters: IDynamicRewardParameter[],
    anonymitySet: Commitment[],
    anonymitySetStart: number,
    insightPlatformBaseUrl: URLString,
  ): ResultAsync<EarnedReward[], AjaxError | CircuitError> {
    // Calculate the values we need to include in the signal
    const identity = MembershipWrapper.getIdentity(trapdoor, nullifier);
    const signalNullifier = MembershipWrapper.getSignalNullifier(
      identity,
      queryCID,
    );

    // Check if the passed-in anonymity set includes the identity's commitment
    let anonymitySetSize = anonymitySet.length;
    const identityCommitment =
      MembershipWrapper.getIdentityCommitment(identity);
    if (anonymitySet.indexOf(identityCommitment) === -1) {
      anonymitySetSize += 1;
    }

    // Create the proveable data
    const provableData = {
      consentContractId: consentContractAddress,
      queryCID: queryCID,
      insights: insights,
      rewardParameters: rewardParameters,
      signalNullifier: signalNullifier,
      anonymitySetStart: anonymitySetStart,
      anonymitySetSize: anonymitySetSize,
    } as Omit<IDeliverInsightsParams, "proof">;

    return this.membershipWrapper
      .prove(
        ObjectUtils.serialize(provableData),
        trapdoor,
        nullifier,
        anonymitySet,
        queryCID,
      )
      .andThen((proof) => {
        const url = new URL(
          urlJoin(insightPlatformBaseUrl, "insights/responses"),
        );

        return this.ajaxUtils.post<EarnedReward[]>(url, {
          consentContractId: consentContractAddress,
          queryCID: queryCID,
          insights: insights,
          rewardParameters: rewardParameters,
          signalNullifier: signalNullifier,
          anonymitySetStart: anonymitySetStart,
          anonymitySetSize: anonymitySetSize,
          proof: proof,
        } as IDeliverInsightsParams as unknown as Record<string, unknown>);
      });
  }

  public optin(
    consentContractAddress: EVMContractAddress,
    trapdoor: BigNumberString,
    nullifier: BigNumberString,
    insightPlatformBaseUrl: URLString,
  ): ResultAsync<void, AjaxError | CircuitError> {
    // Calculate the values we need to include in the signal
    const identity = MembershipWrapper.getIdentity(trapdoor, nullifier);
    const identityCommitment =
      MembershipWrapper.getIdentityCommitment(identity);

    // Create the proveable data
    const provableData = {
      consentContractId: consentContractAddress,
      commitment: identityCommitment,
    } as Omit<IOptinParams, "proof">;

    return this.commitmentWrapper
      .prove(ObjectUtils.serialize(provableData), trapdoor, nullifier)
      .andThen((proof) => {
        const url = new URL(urlJoin(insightPlatformBaseUrl, "insights/optin"));

        return this.ajaxUtils.post<{ success: boolean }>(url, {
          consentContractId: consentContractAddress,
          commitment: identityCommitment,
          proof: proof,
        } as IOptinParams as unknown as Record<string, unknown>);
      })
      .map(() => {});
  }

  public privateOptin(
    consentContractAddress: EVMContractAddress,
    trapdoor: BigNumberString,
    nullifier: BigNumberString,
    nonce: BigNumberString,
    signature: Signature,
    insightPlatformBaseUrl: URLString,
  ): ResultAsync<void, AjaxError | CircuitError> {
    // Calculate the values we need to include in the signal
    const identity = MembershipWrapper.getIdentity(trapdoor, nullifier);
    const identityCommitment =
      MembershipWrapper.getIdentityCommitment(identity);

    // Create the proveable data
    const provableData = {
      consentContractId: consentContractAddress,
      commitment: identityCommitment,
      nonce: nonce,
      signature: signature,
    } as Omit<IOptinParams, "proof">;

    return this.commitmentWrapper
      .prove(ObjectUtils.serialize(provableData), trapdoor, nullifier)
      .andThen((proof) => {
        const url = new URL(urlJoin(insightPlatformBaseUrl, "insights/optin"));

        return this.ajaxUtils.post<{ success: boolean }>(url, {
          consentContractId: consentContractAddress,
          commitment: identityCommitment,
          proof: proof,
        } as IPrivateOptinParams as unknown as Record<string, unknown>);
      })
      .map(() => {});
  }
}
