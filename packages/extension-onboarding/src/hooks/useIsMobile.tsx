import React, { useEffect, useState } from "react";

const useIsMobile = (): boolean | undefined => {
  const [isMobile, setMobile] = useState<boolean>();

  useEffect(() => {
    const userAgent =
      typeof window.navigator === "undefined" ? "" : navigator.userAgent;
    const mobile = Boolean(
      userAgent.match(
        /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i,
      ),
    );
    setMobile(mobile);
  }, []);

  return isMobile;
};

export default useIsMobile;
