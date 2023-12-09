import Container from "@extension-onboarding/components/v2/Container";
import PageTitle from "@extension-onboarding/components/v2/PageTitle";
import { useDataWalletContext } from "@extension-onboarding/context/DataWalletContext";
import LinkedCryptoAccounts from "@extension-onboarding/pages/V2/Settings/Sections/LinkedCryptoAccounts";
import PersonalInfo from "@extension-onboarding/pages/V2/Settings/Sections/PersonalInfo";
const SocialMediaAccounts = lazy(
  () =>
    import(
      "@extension-onboarding/pages/V2/Settings/Sections/SocialMediaAccounts"
    ),
);
const StorageSetting = lazy(
  () =>
    import("@extension-onboarding/pages/V2/Settings/Sections/StorageSettings"),
);
import Wallets from "@extension-onboarding/pages/V2/Settings/Sections/Wallets";
import { ECoreProxyType } from "@snickerdoodlelabs/objects";
import React, { lazy, Suspense } from "react";

const Settings = () => {
  const { sdlDataWallet } = useDataWalletContext();
  return (
    <Container>
      <PageTitle title="Settings" />
      <Wallets />
      <LinkedCryptoAccounts />
      <PersonalInfo />
      {sdlDataWallet.proxyType != ECoreProxyType.IFRAME_BRIDGE && (
        <>
          <Suspense fallback={null}>
            <SocialMediaAccounts />
          </Suspense>
          <Suspense fallback={null}>
            <StorageSetting />
          </Suspense>
        </>
      )}
    </Container>
  );
};

export default Settings;
