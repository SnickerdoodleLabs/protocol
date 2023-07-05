import React, { useEffect, useState } from "react";

export enum EUserAgent {
  ANDROID,
  IOS,
  UNKNOWN,
}

const useUserAgent = (): EUserAgent => {
  const [userAgent, setUserAgent] = useState<EUserAgent>(EUserAgent.UNKNOWN);

  const getUserAgent = () => {
    const userAgent =
      typeof window.navigator === "undefined" ? "" : navigator.userAgent;

    if (/android/i.test(userAgent)) {
      return EUserAgent.ANDROID;
    }

    if (/iPad|iPhone|iPod/.test(userAgent)) {
      return EUserAgent.IOS;
    }

    return EUserAgent.UNKNOWN;
  };

  useEffect(() => {
    setUserAgent(getUserAgent());
  }, []);

  return userAgent;
};

export default useUserAgent;
