import { Box, Grid, Typography } from "@material-ui/core";
import React, { FC, useState } from "react";
import Section, {
  useSectionStyles,
} from "@extension-onboarding/pages/Details/screens/RewardProgramDetails/components/Sections/Section";
import { EVMContractAddress, IpfsCID } from "@snickerdoodlelabs/objects";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import CampaignItem from "@extension-onboarding/components/CampaignItem";

interface IConsentOwnersOtherProgramsProps {
  consentContract: EVMContractAddress;
  brandInfo?: any;
}
const ConsentOwnersOtherPrograms: FC<IConsentOwnersOtherProgramsProps> = ({
  consentContract,
  brandInfo,
}) => {
  const sectionClasses = useSectionStyles();

  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 2,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 2,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 2,
    },
  };
  return (
    <Section>
      <Box mb={4}>
        <Typography className={sectionClasses.sectionTitle}>
          {!brandInfo
            ? `Popular Reward Programs of This Reward Program Owner`
            : `Popular ${brandInfo.name} Rewards Programs`}
        </Typography>
        <Box>
          <Typography
            className={sectionClasses.sectionDescription}
          ></Typography>
        </Box>
      </Box>
      <Box className={sectionClasses.carouselWrapper}>
        <Carousel responsive={responsive}>
          {[
            "0x6303c6f490CF742F6EaEDD560945f16E42136aCE",
            "0xc336E4ff9271f4B4B2B9E514D4B73c066e3Fc1d6",
            "0x9031E8903f3192158046f72639db900d73b33359",
          ].map((item) => (
            <Box mr={3}>
              <CampaignItem
                consentContractAddress={item as EVMContractAddress}
              />
            </Box>
          ))}
        </Carousel>
      </Box>
    </Section>
  );
};

export default ConsentOwnersOtherPrograms;
