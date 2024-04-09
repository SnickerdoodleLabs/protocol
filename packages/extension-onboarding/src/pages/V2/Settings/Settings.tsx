import Container from "@extension-onboarding/components/v2/Container";
import PageTitle from "@extension-onboarding/components/v2/PageTitle";
import LinkedCryptoAccounts from "@extension-onboarding/pages/V2/Settings/Sections/LinkedCryptoAccounts";
import PersonalInfo from "@extension-onboarding/pages/V2/Settings/Sections/PersonalInfo";
import SocialMediaAccounts from "@extension-onboarding/pages/V2/Settings/Sections/SocialMediaAccounts";
import StorageSetting from "@extension-onboarding/pages/V2/Settings/Sections/StorageSettings";
import Wallets from "@extension-onboarding/pages/V2/Settings/Sections/Wallets";
import React from "react";

const Settings = () => {
  return (
    <Container>
      <PageTitle title="Settings" />
      {/* <Wallets />
      <LinkedCryptoAccounts /> */}
      <PersonalInfo />
      {/* <SocialMediaAccounts /> */}
      <StorageSetting />
    </Container>
  );
};

export default Settings;
