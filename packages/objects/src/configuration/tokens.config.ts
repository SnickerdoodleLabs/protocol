import {
  ERC20TokenInformation,
  SupportedToken,
} from "@objects/businessObjects/TokenInformation";
import {
  EChain,
  ESupportedTokenName,
  ETokenType,
} from "@objects/enum/index.js";
import { ChainId, EVMContractAddress } from "@objects/primitives/index.js";

export const supportedERC20TokenConfig = new Map<
  SupportedToken,
  ERC20TokenInformation
>([
  [
    new SupportedToken(ESupportedTokenName.Degen, EChain.Base),
    new ERC20TokenInformation(
      "Degen",
      "DEGEN",
      ChainId(EChain.Base),
      ETokenType.ERC20,
      EVMContractAddress("0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed"),
      18,
      59000, // from actual ad Degen claimed : https://basescan.org/tx/0xfa7a7d95d2f411a47d109d5ccf0adbeeb288cb7efe82d2639ca0bc4855c4f296
    ),
  ],
  [
    new SupportedToken(ESupportedTokenName.CoqInu, EChain.Avalanche),
    new ERC20TokenInformation(
      "Coq Inu",
      "COQ",
      ChainId(EChain.Avalanche),
      ETokenType.ERC20,
      EVMContractAddress("0x420FcA0121DC28039145009570975747295f2329"),
      18,
      57000, // selected from highest average gas used : https://snowtrace.io/tx/0x8866b8a7907af6e4153cba41e4c839898d2150d7913bcae8468756674bf70de5?chainId=43114
    ),
  ],
]);

// To account for similar token names on different chains
export function getERC20TokenInfoByTokenNameAndChain(
  tokenName: ESupportedTokenName,
  chain: EChain,
): ERC20TokenInformation {
  const tokenInfo = supportedERC20TokenConfig.get(
    new SupportedToken(tokenName, chain),
  );
  if (tokenInfo == null) {
    throw new Error(
      `Unknown or unsupported token name : ${tokenName}, on chain ${chain}.`,
    );
  }

  return tokenInfo;
}
