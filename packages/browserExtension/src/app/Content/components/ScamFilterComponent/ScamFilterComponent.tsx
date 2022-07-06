import React, { useEffect, useMemo } from "react";
import { IExternalState } from "@shared/objects/State";
import ScamNotification from "./ScamNotification/ScamNotification";
import SafeUrlNotification from "./SafeUrlNotification";

const ScamFilterComponent = ({ backgroundState }: any) => {
  const isScam = useMemo(
    () =>
      backgroundState?.scamList.find(
        (list) => list.scamURL === window.location.origin,
      ),
    [backgroundState],
  );

  const isInYellowList = useMemo(
    () => backgroundState?.yellowList.includes(window.location.origin),
    [backgroundState],
  );

  const isInWhiteList = useMemo(
    () => backgroundState?.whiteList.includes(window.location.origin),
    [backgroundState],
  );

  const renderScamDangerous = useMemo(
    () => (isScam ? <ScamNotification safeURL={isScam.safeURL} /> : null),
    [isScam],
  );

  const renderSafeUrlNotification = useMemo(
    () => (isInWhiteList ? <SafeUrlNotification /> : null),
    [isInWhiteList],
  );

  const renderScamWarning = useMemo(
    () => (isInYellowList ? <h1>Warning</h1> : null),
    [isInWhiteList],
  );

  return (
    <>
      {renderSafeUrlNotification}
      {renderScamDangerous}
      {renderScamWarning}
    </>
  );
};
export default ScamFilterComponent;
