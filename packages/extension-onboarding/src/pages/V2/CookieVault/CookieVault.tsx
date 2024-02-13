import Container from "@extension-onboarding/components/v2/Container";
import PageBanners from "@extension-onboarding/components/v2/PageBanners";
import Questionaries from "@extension-onboarding/pages/V2/CookieVault/Sections/Questionnaries/";
import React, { FC } from "react";
const CookieVault: FC = () => {
  return (
    <>
      <PageBanners />
      <Container>
        <Questionaries />
      </Container>
    </>
  );
};

export default CookieVault;
