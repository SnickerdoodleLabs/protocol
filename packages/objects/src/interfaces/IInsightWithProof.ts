import { InsightString } from "@objects/primitives/InsightString.js";
import { ProofString } from "@objects/primitives/ProofString.js";

export interface IInsightWithProof {
  insight: InsightString;
  proof: ProofString;
}
