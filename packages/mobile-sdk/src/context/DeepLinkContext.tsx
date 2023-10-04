import { useEffect } from "react";
import { Linking } from "react-native";
import { useInvitationContext } from "./InvitationContext";
import {
  EVMContractAddress,
  Signature,
  Invitation,
  TokenId,
  DomainName,
} from "@snickerdoodlelabs/objects";
import { CryptoUtils } from "@snickerdoodlelabs/node-utils";

type DeepLinkParams = {
  consentAddress?: string;
  tokenId?: string;
  signature?: string;
};
const DeepLinkHandler = () => {
  const { handleInvitation } = useInvitationContext();
  useEffect(() => {
    Linking.getInitialURL().then((url) => checkUrl(url));
    Linking.addEventListener("url", urlChangeListener);
    return () => {
      Linking.removeAllListeners("url");
    };
  }, []);

  const urlChangeListener = (event: { url: string }) => {
    checkUrl(event.url);
  };

  const checkUrl = (url: string | null) => {
    if (!url) {
      return null;
    }
    const searchParams: DeepLinkParams = parseDeepLink(url);
    const cryptoUtils = new CryptoUtils();
    if (searchParams.consentAddress) {
      cryptoUtils
        .getTokenId()
        .map((tokenId) => {
          const _invitation: Invitation = {
            domain: "" as DomainName,
            consentContractAddress:
              searchParams.consentAddress as EVMContractAddress,
            tokenId: searchParams?.tokenId
              ? TokenId(BigInt(searchParams?.tokenId))
              : tokenId,
            businessSignature: searchParams?.signature as Signature | null,
          };
          handleInvitation(_invitation);
        })
        .mapErr((error) => {
          console.log("Error getting token id", error);
        });
    }

    return searchParams;
  };

  return null;
};

const parseDeepLink = (url: string) => {
  if (!url) {
    return {};
  }

  const sanitizedSearch = url.split("?")[1] || ""; // Get the query part of the URL
  const searchParams = sanitizedSearch.split("&");

  const queryParams: any = {};

  for (const param of searchParams) {
    const [key, value] = param.split("=");

    if (key && value) {
      queryParams[key] = decodeURIComponent(value);
    }
  }

  return queryParams;
};

export default DeepLinkHandler;
