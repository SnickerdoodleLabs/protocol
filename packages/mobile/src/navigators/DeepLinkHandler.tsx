import { ObjectUtils } from "@snickerdoodlelabs/utils/src/ObjectUtils";

import { parse } from "querystring";

import { useEffect, useState } from "react";
import { Linking } from "react-native";
import {
  IInvitationParams,
  useInvitationContext,
} from "../context/InvitationContext";

enum EDeeplink {
  INVITATION,
}

interface IDeepLink {
  type: EDeeplink;
  params: IInvitationParams;
}
//@TODO we can use it as a service rather than component
const DeepLinkHandler = () => {
  const [deepLink, setDeepLink] = useState<IDeepLink>();
  const { setInvitation } = useInvitationContext();

  useEffect(() => {
    Linking.getInitialURL().then((url) => checkUrl(url));
    Linking.addEventListener("url", urlChangeListener);
    return () => {
      Linking.removeAllListeners("url");
    };
  }, []);

  useEffect(() => {
    if (
      deepLink?.type === EDeeplink.INVITATION &&
      deepLink.params.consentAddress
    ) {
      setInvitation(deepLink.params);
    }
  }, [ObjectUtils.serialize(deepLink)]);

  const urlChangeListener = (event: { url: string }) => {
    checkUrl(event.url);
  };

  const checkUrl = (url: string | null) => {
    if (!url) {
      return null;
    }
    // @TODO temporary
    console.error("FOUND URL", url);
    const sanitizedSearch = url.replace(/(sdmobile:\/\/\??)/, "");
    const searchParams = parse(sanitizedSearch);
    if (searchParams.consentAddress) {
      console.error("FOUND PARAMS", searchParams);
      handleInvitationDeepLink(searchParams);
    }
    // other checks here
  };

  const handleInvitationDeepLink = (
    searchParams: Partial<IInvitationParams>,
  ) => {
    setDeepLink({
      type: EDeeplink.INVITATION,
      params: {
        consentAddress: searchParams.consentAddress,
        tokenId: searchParams.tokenId ?? undefined,
        signature: searchParams.signature ?? undefined,
      },
    });
  };

  return null;
};

export default DeepLinkHandler;
