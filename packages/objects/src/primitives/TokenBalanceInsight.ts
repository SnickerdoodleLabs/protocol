import { TokenBalance } from "@objects/businessObjects/TokenBalance.js";

export type TokenBalanceInsight = Omit<TokenBalance, "accountAddress">;
