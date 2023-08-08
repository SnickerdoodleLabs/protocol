import { DomainName, PageInvitation } from "@snickerdoodlelabs/objects";
import { usePath } from "@web-integration/implementations/app/ui/hooks/usePath.js";
import { ISnickerdoodleIFrameProxy } from "@web-integration/interfaces/proxy/index.js";
import React, { useMemo, useState, useEffect, FC, useRef } from "react";
import { Subscription } from "rxjs";
import { parse } from "tldts";
interface IAppProps {
  proxy: ISnickerdoodleIFrameProxy;
}

export const App: FC<IAppProps> = ({ proxy }) => {
  const _pathName = usePath();
  const [pageInvitation, setPageInvitation] = useState<PageInvitation>();
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const initializedSubscription = useRef<Subscription | null>(null);
  const isUnlcokedRef = useRef<boolean>(false);

  useEffect(() => {
    console.log("path changed", _pathName);
    const path = window.location.pathname;
    const urlInfo = parse(window.location.href);
    const domain = urlInfo.domain;
    const url = `${urlInfo.hostname}${path.replace(/\/$/, "")}`;
    const domainName = DomainName(`snickerdoodle-protocol.${domain}`);
    getDomainInvitation(domainName, url);
  }, [_pathName]);

  const getDomainInvitation = (domain: DomainName, path: string) => {
    return proxy.getInvitationByDomain(domain, path).map((invitation) => {
      console.log("invitation result for", domain, path, ":", invitation);
    });
  };

  useEffect(() => {
    proxy.metrics.getUnlocked().map((isUnlocked) => {
      if (!isUnlocked) {
        subsribeInitailizeEvent();
      }
      setIsUnlocked(isUnlocked);
    });
  }, []);

  useEffect(() => {
    if (isUnlcokedRef.current !== isUnlocked) {
      isUnlcokedRef.current = isUnlocked;
    }
    if (isUnlocked) {
      initializedSubscription.current?.unsubscribe();
    }
  }, [isUnlocked]);

  const subsribeInitailizeEvent = () => {
    initializedSubscription.current = proxy.events.onInitialized.subscribe(
      () => {
        setIsUnlocked(true);
      },
    );
  };

  const clearInvitation = () => {
    setPageInvitation(undefined);
  };

  return null;
};
