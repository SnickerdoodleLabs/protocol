import { FeaturedCampaignItem } from "@extension-onboarding/components/CampaignItems";
import Carousel from "@extension-onboarding/components/Carousel";
import { useSectionStyles } from "@extension-onboarding/pages/Details/screens/Marketplace/components/Sections/Section.style";
import { Box, Typography } from "@material-ui/core";
import { ETag, EVMContractAddress } from "@snickerdoodlelabs/objects";
import React, { FC } from "react";

interface IFeaturedRewardsProgramsProps {
  tag?: ETag;
}
const FeaturedRewardsPrograms: FC<IFeaturedRewardsProgramsProps> = ({
  tag,
}) => {
  const sectionClasses = useSectionStyles();

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 1,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };
  return (
    <>
      <Box mb={3}>
        <Typography className={sectionClasses.sectionTitle}>
          Featured Rewards Programs
        </Typography>
      </Box>
      <Box className={sectionClasses.carouselWrapper}>
        <Carousel responsive={responsive}>
          {[
            "0xe9C9575E969a3f917a9CAF38a59859fB8E200B20",
            "0xeA730e52735aa6568daEB7d56E5e44f0B4d30E0c",
            "0xc336E4ff9271f4B4B2B9E514D4B73c066e3Fc1d6",
            "0x9031E8903f3192158046f72639db900d73b33359",
          ].map((item) => (
            <Box>
              <FeaturedCampaignItem
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

export default FeaturedRewardsPrograms;
