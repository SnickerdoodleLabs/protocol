import { Insight } from "@objects/businessObjects/Insight.js";
import { IInsightWithProof } from "@objects/interfaces/IInsightWithProof.js";
import { InsightString } from "@objects/primitives/InsightString.js";
import { ProofString } from "@objects/primitives/ProofString.js";

export class InsightWithProof implements IInsightWithProof {
  public insight: InsightString;
  public proof: ProofString;
  public constructor(_insight: Insight, _proof: unknown) {
    this.insight = InsightString(JSON.stringify(_insight));
    this.proof = ProofString(JSON.stringify(_proof));
  }
}
