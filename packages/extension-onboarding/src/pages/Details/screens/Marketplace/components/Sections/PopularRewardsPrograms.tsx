import CampaignItem from "@extension-onboarding/components/CampaignItem";
import Carousel from "@extension-onboarding/components/Carousel";

import { useSectionStyles } from "@extension-onboarding/pages/Details/screens/Marketplace/components/Sections/Section.style";
import { Box, Typography } from "@material-ui/core";
import { ETag, EVMContractAddress } from "@snickerdoodlelabs/objects";
import React, { FC } from "react";

interface IPopularRewardsProgramsProps {
  tag?: ETag;
}
const PopularRewardsPrograms: FC<IPopularRewardsProgramsProps> = ({ tag }) => {
  const sectionClasses = useSectionStyles();

  const responsive = {
    superLargeDesktop: {
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
    <>
      <Box mb={3}>
        <Typography className={sectionClasses.sectionTitle}>
          Popular Rewards Programs
        </Typography>
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
                tag={tag}
                consentContractAddress={item as EVMContractAddress}
              />
            </Box>
          ))}
        </Carousel>
      </Box>
    </>
  );
};

export default PopularRewardsPrograms;
