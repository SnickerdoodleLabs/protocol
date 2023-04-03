import ethereumCircle from "@extension-onboarding/assets/icons/ethereum-circle.svg";
import solanaCircle from "@extension-onboarding/assets/icons/solana-circle.svg";
import usdcCircle from "@extension-onboarding/assets/icons/usdc-circle.png";
import arbitrumCircle from "@extension-onboarding/assets/images/arbitrum-circle.png";
import avaxCircle from "@extension-onboarding/assets/images/avax-circle.png";
import binanceCircle from "@extension-onboarding/assets/images/bnb-circle.png";
import moonbeamCircle from "@extension-onboarding/assets/images/moonbeam-circle.png";
import optimismCircle from "@extension-onboarding/assets/images/optimism-circle.png";
import polygonCircle from "@extension-onboarding/assets/images/polygon-circle.png";
import gnosisCircle from "@extension-onboarding/assets/images/xDAI-circle.png";

interface ITokenInfo {
  [tickerSymbol: string]: { displayName: string; iconSrc: string };
}

export const tokenInfoObj: ITokenInfo = {
  ETH: { displayName: "Ethereum", iconSrc: ethereumCircle },
  AVAX: { displayName: "AVAX", iconSrc: avaxCircle },
  USDC: { displayName: "USDC", iconSrc: usdcCircle },
  MATIC: { displayName: "MATIC", iconSrc: polygonCircle },
  SOL: { displayName: "Sol", iconSrc: solanaCircle },
  xDAI: { displayName: "xDAI", iconSrc: gnosisCircle },
  BNB: { displayName: "Binance", iconSrc: binanceCircle },
  GLMR: { displayName: "Moonbeam", iconSrc: moonbeamCircle },
  ARB: { displayName: "Arbitrum", iconSrc: arbitrumCircle },
  OPT: { displayName: "Optimism", iconSrc: optimismCircle },
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
  "xDAI",
  "BNB",
  "GLMR",
  "ARB",
  "OPT",
];
