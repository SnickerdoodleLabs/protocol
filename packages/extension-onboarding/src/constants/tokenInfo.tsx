import ethereumCircle from "@extension-onboarding/assets/icons/ethereum-circle.svg";
import solanaCircle from "@extension-onboarding/assets/icons/solana-circle.svg";
import usdcCircle from "@extension-onboarding/assets/icons/usdc-circle.png";
import avaxCircle from "@extension-onboarding/assets/images/avax-circle.png";
import moonbeamCircle from "@extension-onboarding/assets/images/moonbeam-circle.png";
import polygonCircle from "@extension-onboarding/assets/images/polygon-circle.png";

interface ITokenInfo {
  [tickerSymbol: string]: { displayName: string; iconSrc: string };
}

export const tokenInfoObj: ITokenInfo = {
  ETH: { displayName: "Ethereum", iconSrc: ethereumCircle },
  AVAX: { displayName: "AVAX", iconSrc: avaxCircle },
  USDC: { displayName: "USDC", iconSrc: usdcCircle },
  MATIC: { displayName: "MATIC", iconSrc: polygonCircle },
  SOL: { displayName: "Sol", iconSrc: solanaCircle },
  GLMR: { displayName: "GLMR", iconSrc: moonbeamCircle },
};

export const stableCoins = [
  "USDC",
  "USDT",
  "BUSD",
  "DAI",
  "USDP",
  "TUSD",
  "USDD",
  "EURS",
  "GLMR",
];
