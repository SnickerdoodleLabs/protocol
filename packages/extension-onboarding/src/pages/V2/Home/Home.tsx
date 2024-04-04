import Container from "@extension-onboarding/components/v2/Container";
import PageBanners from "@extension-onboarding/components/v2/PageBanners";
import ConnectDiscordCard from "@extension-onboarding/pages/V2/Home/ConnectDiscordCard";
import ConnectWalletCard from "@extension-onboarding/pages/V2/Home/ConnectWalletCard";
import QuestionnairesCard from "@extension-onboarding/pages/V2/Home/QuestionnairesCard";
import SocialLinks from "@extension-onboarding/pages/V2/Home/SocialLinks";
import { Box } from "@material-ui/core";
import { useResponsiveValue } from "@snickerdoodlelabs/shared-components";
import React, { FC } from "react";
import { useNavigate } from "react-router-dom";

const Home: FC = () => {
  const getResponsiveValue = useResponsiveValue();
  return (
    <>
      <PageBanners />
      <Container>
        <Box width="100%" overflow={{ xs: "hidden", sm: "display" }}>
          <img
            src="https://storage.googleapis.com/dw-assets/spa/images-v2/home-banner.svg"
            style={{
              width: getResponsiveValue({
                xs: "160%",
                sm: "calc(100% + 64px)",
              }),
              transform: `translateX(${getResponsiveValue({
                xs: "-20%",
                sm: "0%",
              })})`,
              marginLeft: getResponsiveValue({ xs: 0, sm: -32 }),
              marginBottom: getResponsiveValue({
                xs: -16,
                sm: -32,
                md: -56,
                lg: -64,
              }),
              marginTop: "28px",
              height: "auto",
            }}
          />
        </Box>
        <ConnectWalletCard />
        <ConnectDiscordCard />
        <QuestionnairesCard />
        <SocialLinks />
      </Container>
    </>
  );
};
export default Home;
