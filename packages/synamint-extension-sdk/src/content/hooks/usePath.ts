import { useEffect, useRef, useState } from "react";

/**
 * This hook provides to detect URL path changes on single-page applications
 */
const usePath = (): string => {
  const pathRef = useRef<string>();
  const [pathName, setPathName] = useState<string>(window.location.pathname);
  const config = { subtree: true, childList: true };
  const observer = new MutationObserver((mutations) => {
    if (window.location.pathname !== pathRef.current) {
      setPathName(window.location.pathname);
    }
  });
  useEffect(() => {
    observer.observe(document, config);
    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    pathRef.current = pathName;
  }, [pathName]);

  return pathName;
};

export default usePath;
